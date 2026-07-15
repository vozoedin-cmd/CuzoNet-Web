import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError, apiClient } from './api-client';

const GENERATED_CORRELATION_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c50';

function jsonResponse(
  body: unknown,
  init: { headers?: HeadersInit; status?: number; statusText?: string } = {},
): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      ...Object.fromEntries(new Headers(init.headers)),
    },
    status: init.status ?? 200,
    statusText: init.statusText,
  });
}

describe('apiClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3001/api/v1/');
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('construye la URL exclusivamente desde NEXT_PUBLIC_API_BASE_URL', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [] }));

    await apiClient.get('/clientes?page=1');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/clientes?page=1',
      expect.any(Object),
    );
  });

  it('falla claramente en desarrollo cuando falta NEXT_PUBLIC_API_BASE_URL', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '');

    await expect(apiClient.get('/health')).rejects.toThrow(
      'Falta la variable requerida NEXT_PUBLIC_API_BASE_URL.',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('preserva code, message, correlationId y fields del ApiError del backend', async () => {
    const fields = [{ message: 'Es requerido.', path: 'body.legalName' }];
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          code: 'VALIDATION_ERROR',
          correlationId: GENERATED_CORRELATION_ID,
          fields,
          message: 'La solicitud contiene datos inválidos.',
        },
        {
          headers: { 'X-Correlation-Id': GENERATED_CORRELATION_ID },
          status: 422,
          statusText: 'Unprocessable Entity',
        },
      ),
    );

    const error = await apiClient.get('/clientes').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      code: 'VALIDATION_ERROR',
      correlationId: GENERATED_CORRELATION_ID,
      fields,
      message: 'La solicitud contiene datos inválidos.',
      status: 422,
    });
  });

  it('genera correlationId con crypto.randomUUID y respeta el proporcionado por el caller', async () => {
    const randomUuid = vi.spyOn(crypto, 'randomUUID').mockReturnValue(GENERATED_CORRELATION_ID);
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await apiClient.get('/health');
    const generatedHeaders = new Headers(fetchMock.mock.calls[0][1]?.headers);

    await apiClient.get('/health', { correlationId: 'caller-correlation-id' });
    const providedHeaders = new Headers(fetchMock.mock.calls[1][1]?.headers);

    expect(randomUuid).toHaveBeenCalledOnce();
    expect(generatedHeaders.get('X-Correlation-Id')).toBe(GENERATED_CORRELATION_ID);
    expect(providedHeaders.get('X-Correlation-Id')).toBe('caller-correlation-id');
  });

  it('envía Idempotency-Key en mutaciones y no lo envía en GET', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await apiClient.post<void>('/pagos', {}, { idempotencyKey: 'payment-key' });
    await apiClient.get<void>('/pagos', { idempotencyKey: 'must-not-be-sent' });

    const mutationHeaders = new Headers(fetchMock.mock.calls[0][1]?.headers);
    const getHeaders = new Headers(fetchMock.mock.calls[1][1]?.headers);
    expect(mutationHeaders.get('Idempotency-Key')).toBe('payment-key');
    expect(getHeaders.has('Idempotency-Key')).toBe(false);
  });

  it('aplica timeout y combina un AbortSignal proporcionado', async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        signal?.addEventListener('abort', () => reject(signal.reason), { once: true });
      });
    });

    const timeoutPromise = apiClient.get('/health', { timeoutMs: 100 });
    const timeoutAssertion = expect(timeoutPromise).rejects.toMatchObject({
      code: 'REQUEST_TIMEOUT',
      status: 0,
    });
    await vi.advanceTimersByTimeAsync(100);
    await timeoutAssertion;

    const callerController = new AbortController();
    const abortPromise = apiClient.get('/health', { signal: callerController.signal });
    const abortAssertion = expect(abortPromise).rejects.toMatchObject({
      code: 'REQUEST_ABORTED',
      status: 0,
    });
    callerController.abort();
    await abortAssertion;
  });

  it('devuelve undefined para 204 sin intentar leer JSON ni texto', async () => {
    const text = vi.fn();
    fetchMock.mockResolvedValue({
      headers: new Headers({ 'X-Correlation-Id': GENERATED_CORRELATION_ID }),
      ok: true,
      status: 204,
      statusText: 'No Content',
      text,
    } as unknown as Response);

    await expect(apiClient.delete<void>('/clientes/client-1')).resolves.toBeUndefined();
    expect(text).not.toHaveBeenCalled();
  });

  it('tipa errores con body no JSON y conserva una copia sanitizada', async () => {
    fetchMock.mockResolvedValue(
      new Response('upstream unavailable', {
        headers: { 'X-Correlation-Id': GENERATED_CORRELATION_ID },
        status: 502,
        statusText: 'Bad Gateway',
      }),
    );

    await expect(apiClient.get('/health')).rejects.toMatchObject({
      code: 'HTTP_502',
      correlationId: GENERATED_CORRELATION_ID,
      message: 'Bad Gateway',
      responseBody: 'upstream unavailable',
      status: 502,
    });
  });
});
