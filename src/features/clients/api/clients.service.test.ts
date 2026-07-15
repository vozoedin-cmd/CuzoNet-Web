import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/services/api/api-client';

import {
  clientsService,
  type ClientDto,
  type ClientPageDto,
  type CreateClientRequest,
} from './clients.service';

const CLIENT_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c10';
const UUID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c50';

const client: ClientDto = {
  id: CLIENT_ID,
  clientType: 'person',
  legalName: 'Ana Pérez',
  documentType: 'DPI',
  documentNumber: '1234567890101',
  status: 'active',
  contacts: [
    { type: 'phone', value: '+50255555555', isPrimary: true },
  ],
  addresses: [],
  createdAt: '2026-07-15T10:00:00.000Z',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-Id': UUID,
    },
    status,
  });
}

describe('clientsService', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3001/api/v1');
    vi.stubEnv('NEXT_PUBLIC_ENABLE_DEMO_DATA', 'false');
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('envía paginación, búsqueda y filtros soportados por GET /clientes', async () => {
    const page: ClientPageDto = {
      data: [client],
      page: 2,
      pageSize: 10,
      total: 15,
    };
    fetchMock.mockResolvedValue(jsonResponse(page));

    await expect(
      clientsService.getClients({
        page: 2,
        pageSize: 10,
        search: 'Ana Pérez',
        status: 'active',
      }),
    ).resolves.toEqual(page);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/clientes?page=2&pageSize=10&search=Ana+P%C3%A9rez&status=active',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('si el modo demo está deshabilitado siempre consulta el backend real', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ data: [], page: 1, pageSize: 25, total: 0 }),
    );

    await clientsService.getClients({ page: 1, pageSize: 25 });

    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('crea el cliente con el DTO exacto e Idempotency-Key generado por crypto', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(UUID);
    fetchMock.mockResolvedValue(jsonResponse(client, 201));
    const request: CreateClientRequest = {
      clientType: 'person',
      legalName: 'Ana Pérez',
      documentType: 'DPI',
      documentNumber: '1234567890101',
      contacts: [
        { type: 'phone', value: '+50255555555', isPrimary: true },
      ],
    };

    await expect(clientsService.create(request)).resolves.toEqual(client);

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = new Headers(init.headers);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3001/api/v1/clientes',
    );
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual(request);
    expect(headers.get('Idempotency-Key')).toBe(UUID);
  });

  it('actualiza y archiva usando los endpoints canónicos', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ ...client, legalName: 'Ana P.' }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    await clientsService.update(
      CLIENT_ID,
      { legalName: 'Ana P.' },
      { idempotencyKey: 'update-client-key' },
    );
    await clientsService.archive(CLIENT_ID, {
      idempotencyKey: 'archive-client-key',
    });

    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3001/api/v1/clientes/' + CLIENT_ID,
    );
    expect(fetchMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(
      new Headers((fetchMock.mock.calls[0][1] as RequestInit).headers).get(
        'Idempotency-Key',
      ),
    ).toBe('update-client-key');
    expect(fetchMock.mock.calls[1][0]).toBe(
      'http://localhost:3001/api/v1/clientes/' + CLIENT_ID,
    );
    expect(fetchMock.mock.calls[1][1]).toEqual(
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('propaga ApiError con los campos estructurados del backend', async () => {
    const fields = [{ path: 'query.page', message: 'Debe ser positivo.' }];
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          code: 'VALIDATION_ERROR',
          message: 'Parámetros inválidos.',
          correlationId: UUID,
          fields,
        },
        422,
      ),
    );

    const error = await clientsService
      .getClients({ page: 0 })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 422,
      code: 'VALIDATION_ERROR',
      message: 'Parámetros inválidos.',
      correlationId: UUID,
      fields,
    });
  });
});
