
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  // Mock Correlation ID
  headers.set('X-Correlation-ID', 'corr-' + Math.random().toString(36).substring(2, 10));

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch (_) {
      // Ignorar si no es JSON
    }
    throw new ApiError(errorMessage, response.status);
  }

  // Handle empty responses (like 204 No Content)
  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch (_) {
    return text as unknown as T;
  }
}

export const apiClient = {
  get: <T>(url: string, headers?: HeadersInit) => request<T>(url, { method: 'GET', headers }),
  post: <T>(url: string, body?: unknown, headers?: HeadersInit) => request<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined, headers }),
  put: <T>(url: string, body?: unknown, headers?: HeadersInit) => request<T>(url, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, headers }),
  patch: <T>(url: string, body?: unknown, headers?: HeadersInit) => request<T>(url, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, headers }),
  delete: <T>(url: string, headers?: HeadersInit) => request<T>(url, { method: 'DELETE', headers }),
};
