import {
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/services/api/api-client';

import {
  servicesService,
  type CreateServiceRequest,
  type OperationDto,
} from './services.service';

const CLIENT_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c10';
const SERVICE_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c20';
const PLAN_VERSION_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c22';
const OPERATION_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c30';
const ROUTER_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c40';
const UUID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c50';

const backendService = {
  billingDay: 1,
  clientId: CLIENT_ID,
  id: SERVICE_ID,
  lifecycleStatus: 'pending',
  planVersionId: PLAN_VERSION_ID,
  serviceType: 'simple_queue',
} as const;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-Id': UUID,
    },
    status,
  });
}

function featureSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = directory + '/' + entry;
    if (statSync(path).isDirectory()) return featureSourceFiles(path);
    return /\.(ts|tsx)$/.test(entry) ? [path] : [];
  });
}

describe('servicesService', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3001/api/v1');
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('lista servicios por cliente y adapta id a serviceId', async () => {
    fetchMock.mockResolvedValue(jsonResponse([backendService]));

    await expect(
      servicesService.getClientServices(CLIENT_ID),
    ).resolves.toEqual([
      {
        billingDay: 1,
        clientId: CLIENT_ID,
        lifecycleStatus: 'pending',
        planVersionId: PLAN_VERSION_ID,
        serviceId: SERVICE_ID,
        serviceType: 'simple_queue',
      },
    ]);

    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3001/api/v1/clientes/' + CLIENT_ID + '/servicios',
    );
    expect(fetchMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('no realiza request cuando falta clientId', async () => {
    await expect(servicesService.getClientServices(null)).resolves.toEqual([]);
    await expect(servicesService.getClientServices('')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('consulta el detalle por el endpoint real', async () => {
    fetchMock.mockResolvedValue(jsonResponse(backendService));

    await expect(servicesService.getService(SERVICE_ID)).resolves.toMatchObject({
      serviceId: SERVICE_ID,
    });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3001/api/v1/servicios/' + SERVICE_ID,
    );
  });

  it('crea con respuesta 201, serviceType contractual e Idempotency-Key', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(UUID);
    fetchMock.mockResolvedValue(jsonResponse(backendService, 201));
    const request: CreateServiceRequest = {
      billingDay: 1,
      planVersionId: PLAN_VERSION_ID,
      serviceType: 'simple_queue',
    };

    await expect(
      servicesService.createService(CLIENT_ID, request, {
        correlationId: UUID,
      }),
    ).resolves.toMatchObject({
      serviceId: SERVICE_ID,
      serviceType: 'simple_queue',
    });

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    const headers = new Headers(init.headers);

    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3001/api/v1/clientes/' + CLIENT_ID + '/servicios',
    );
    expect(init.method).toBe('POST');
    expect(body).toEqual(request);
    expect(body).not.toHaveProperty('clientId');
    expect(body.serviceType).toBe('simple_queue');
    expect(headers.get('Idempotency-Key')).toBe(UUID);
  });

  it('tipa OperationAcceptedDto y después consulta OperationDto', async () => {
    const accepted = {
      correlationId: UUID,
      operationId: OPERATION_ID,
      status: 'queued',
    } as const;
    const operation: OperationDto = {
      attemptCount: 0,
      completedAt: null,
      createdAt: '2026-07-15T10:00:00.000Z',
      id: OPERATION_ID,
      lastError: null,
      serviceId: SERVICE_ID,
      status: 'queued',
      type: 'provision',
    };
    fetchMock
      .mockResolvedValueOnce(jsonResponse(accepted, 202))
      .mockResolvedValueOnce(jsonResponse(operation));

    await expect(
      servicesService.requestProvisioning(
        SERVICE_ID,
        { routerId: ROUTER_ID, type: 'provision' },
        { correlationId: UUID, idempotencyKey: 'provision-key' },
      ),
    ).resolves.toEqual(accepted);
    await expect(servicesService.getOperation(OPERATION_ID)).resolves.toEqual(
      operation,
    );

    const postInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3001/api/v1/servicios/' +
        SERVICE_ID +
        '/operaciones',
    );
    expect(JSON.parse(String(postInit.body))).toEqual({
      routerId: ROUTER_ID,
      type: 'provision',
    });
    expect(fetchMock.mock.calls[1][0]).toBe(
      'http://localhost:3001/api/v1/operaciones/' + OPERATION_ID,
    );
    expect(fetchMock.mock.calls[1][1]).toEqual(
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it.each([409, 422])('propaga ApiError estructurado para HTTP %s', async (status) => {
    const fields =
      status === 422
        ? [{ path: 'body.billingDay', message: 'Debe estar entre 1 y 28.' }]
        : undefined;
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          code: status === 409 ? 'SERVICE_CONFLICT' : 'VALIDATION_ERROR',
          correlationId: UUID,
          message: 'Solicitud rechazada.',
          ...(fields === undefined ? {} : { fields }),
        },
        status,
      ),
    );

    const error = await servicesService
      .createService(
        CLIENT_ID,
        {
          billingDay: 1,
          planVersionId: PLAN_VERSION_ID,
          serviceType: 'pppoe',
        },
        { correlationId: UUID, idempotencyKey: 'create-key' },
      )
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      code: status === 409 ? 'SERVICE_CONFLICT' : 'VALIDATION_ERROR',
      correlationId: UUID,
      fields,
      message: 'Solicitud rechazada.',
      status,
    });
  });

  it('no usa fetch directo dentro del feature Services', () => {
    const featureDirectory = fileURLToPath(new URL('../', import.meta.url));
    const offenders = featureSourceFiles(featureDirectory).filter((path) =>
      /\bfetch\s*\(/.test(readFileSync(path, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });
});
