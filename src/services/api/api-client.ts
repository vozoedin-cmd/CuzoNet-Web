const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_RESPONSE_STRING_LENGTH = 2_000;
const MAX_RESPONSE_DEPTH = 5;
const SENSITIVE_KEY_PATTERN = /authorization|cookie|password|secret|token/i;

export interface ApiErrorDetails {
  code: string;
  correlationId?: string;
  fields?: unknown;
  message: string;
  responseBody?: unknown;
  status: number;
}

export interface ApiResponseMetadata {
  correlationId: string;
  status: number;
}

export interface ApiRequestOptions {
  authorization?: string;
  correlationId?: string;
  headers?: HeadersInit;
  idempotencyKey?: string;
  onResponse?: (metadata: ApiResponseMetadata) => void;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export class ApiError extends Error {
  readonly code: string;
  readonly correlationId?: string;
  readonly fields?: unknown;
  readonly responseBody?: unknown;
  readonly status: number;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = 'ApiError';
    this.status = details.status;
    this.code = details.code;
    this.correlationId = details.correlationId;
    this.fields = details.fields;
    this.responseBody = details.responseBody;
  }
}

function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (baseUrl === undefined || baseUrl.trim().length === 0) {
    const environmentHint =
      process.env.NODE_ENV === 'development'
        ? ' Configúrala en el archivo de entorno local antes de iniciar Next.js.'
        : '';
    throw new Error(`Falta la variable requerida NEXT_PUBLIC_API_BASE_URL.${environmentHint}`);
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  try {
    new URL(normalizedBaseUrl);
  } catch {
    throw new Error('NEXT_PUBLIC_API_BASE_URL debe ser una URL absoluta válida.');
  }

  return normalizedBaseUrl;
}

function buildUrl(endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    throw new Error('El apiClient solo acepta endpoints relativos a NEXT_PUBLIC_API_BASE_URL.');
  }

  return `${getApiBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}

function sanitizeResponseBody(value: unknown, depth = 0): unknown {
  if (depth >= MAX_RESPONSE_DEPTH) {
    return '[TRUNCATED]';
  }

  if (typeof value === 'string') {
    return value.length > MAX_RESPONSE_STRING_LENGTH
      ? `${value.slice(0, MAX_RESPONSE_STRING_LENGTH)}…`
      : value;
  }

  if (
    value === null ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined'
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.slice(0, 50).map((item) => sanitizeResponseBody(item, depth + 1));
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 50)
        .map(([key, item]) => [
          key,
          SENSITIVE_KEY_PATTERN.test(key) ? '[REDACTED]' : sanitizeResponseBody(item, depth + 1),
        ]),
    );
  }

  return String(value);
}

function getErrorBodyValue(body: unknown, key: string): unknown {
  if (body !== null && typeof body === 'object' && key in body) {
    return (body as Record<string, unknown>)[key];
  }

  return undefined;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function request<TResponse>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  body: unknown,
  options: ApiRequestOptions,
): Promise<TResponse> {
  const correlationId = options.correlationId ?? crypto.randomUUID();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new ApiError({
      code: 'INVALID_TIMEOUT',
      correlationId,
      message: 'El timeout HTTP debe ser un número positivo.',
      status: 0,
    });
  }

  const url = buildUrl(endpoint);
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  headers.set('X-Correlation-Id', correlationId);

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (options.authorization !== undefined) {
    headers.set('Authorization', options.authorization);
  }
  if (method !== 'GET' && options.idempotencyKey !== undefined) {
    headers.set('Idempotency-Key', options.idempotencyKey);
  }

  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort(options.signal?.reason);

  if (options.signal?.aborted === true) {
    abortFromCaller();
  } else {
    options.signal?.addEventListener('abort', abortFromCaller, { once: true });
  }

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      body: body === undefined ? undefined : JSON.stringify(body),
      headers,
      method,
      signal: controller.signal,
    });
    const responseCorrelationId = response.headers.get('X-Correlation-Id') ?? correlationId;

    options.onResponse?.({
      correlationId: responseCorrelationId,
      status: response.status,
    });

    if (response.status === 204) {
      return undefined as TResponse;
    }

    const responseBody = await readResponseBody(response);
    if (!response.ok) {
      const bodyCode = getErrorBodyValue(responseBody, 'code');
      const bodyMessage = getErrorBodyValue(responseBody, 'message');
      const bodyCorrelationId = getErrorBodyValue(responseBody, 'correlationId');
      const fields = getErrorBodyValue(responseBody, 'fields');

      throw new ApiError({
        code: typeof bodyCode === 'string' ? bodyCode : `HTTP_${response.status}`,
        correlationId:
          response.headers.get('X-Correlation-Id') ??
          (typeof bodyCorrelationId === 'string' ? bodyCorrelationId : correlationId),
        ...(fields === undefined ? {} : { fields }),
        message:
          typeof bodyMessage === 'string'
            ? bodyMessage
            : response.statusText || `La solicitud HTTP falló con estado ${response.status}.`,
        ...(responseBody === undefined
          ? {}
          : { responseBody: sanitizeResponseBody(responseBody) }),
        status: response.status,
      });
    }

    return responseBody as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (controller.signal.aborted) {
      throw new ApiError({
        code: timedOut ? 'REQUEST_TIMEOUT' : 'REQUEST_ABORTED',
        correlationId,
        message: timedOut
          ? `La solicitud HTTP excedió el timeout de ${timeoutMs} ms.`
          : 'La solicitud HTTP fue cancelada.',
        status: 0,
      });
    }

    throw new ApiError({
      code: 'NETWORK_ERROR',
      correlationId,
      message: 'No fue posible completar la solicitud HTTP.',
      status: 0,
    });
  } finally {
    clearTimeout(timeoutId);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }
}

export const apiClient = {
  delete: <TResponse>(endpoint: string, options: ApiRequestOptions = {}) =>
    request<TResponse>('DELETE', endpoint, undefined, options),
  get: <TResponse>(endpoint: string, options: ApiRequestOptions = {}) =>
    request<TResponse>('GET', endpoint, undefined, options),
  patch: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options: ApiRequestOptions = {},
  ) => request<TResponse>('PATCH', endpoint, body, options),
  post: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options: ApiRequestOptions = {},
  ) => request<TResponse>('POST', endpoint, body, options),
  put: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options: ApiRequestOptions = {},
  ) => request<TResponse>('PUT', endpoint, body, options),
};
