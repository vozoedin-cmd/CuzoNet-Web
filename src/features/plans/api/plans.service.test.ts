import {
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/services/api/api-client';

import {
  plansService,
  type CreatePlanRequest,
  type PlanDto,
  type RevisePlanRequest,
} from './plans.service';

const PLAN_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c40';
const VERSION_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c41';
const UUID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c50';

const plan: PlanDto = {
  code: 'HOME_20',
  currentVersion: {
    downloadKbps: 20_000,
    id: VERSION_ID,
    priceCents: 25_000,
    uploadKbps: 10_000,
    version: 1,
  },
  id: PLAN_ID,
  isActive: true,
  name: 'Hogar 20 Mbps',
  serviceType: 'simple_queue',
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

function featureSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = directory + '/' + entry;
    if (statSync(path).isDirectory()) return featureSourceFiles(path);
    return /\.(ts|tsx)$/.test(entry) ? [path] : [];
  });
}

describe('plansService', () => {
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

  it('consume GET /planes y adopta directamente la respuesta array', async () => {
    fetchMock.mockResolvedValue(jsonResponse([plan]));

    await expect(plansService.getPlans()).resolves.toEqual([plan]);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/planes',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('crea el plan y la primera versión en un único POST con Idempotency-Key', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(UUID);
    fetchMock.mockResolvedValue(jsonResponse(plan, 201));
    const request: CreatePlanRequest = {
      code: 'HOME_20',
      downloadKbps: 20_000,
      name: 'Hogar 20 Mbps',
      priceCents: 25_000,
      serviceType: 'simple_queue',
      uploadKbps: 10_000,
    };

    await expect(
      plansService.createPlan(request, { correlationId: UUID }),
    ).resolves.toEqual(plan);

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    const headers = new Headers(init.headers);

    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3001/api/v1/planes',
    );
    expect(init.method).toBe('POST');
    expect(body).toEqual(request);
    expect(Number.isInteger(body.priceCents)).toBe(true);
    expect(body.serviceType).toBe('simple_queue');
    expect(body).not.toHaveProperty('currencyCode');
    expect(body).not.toHaveProperty('validFrom');
    expect(headers.get('Idempotency-Key')).toBe(UUID);
    expect(plan.currentVersion.version).toBe(1);
  });

  it('revisa la versión y cambia isActive mediante PUT /planes/:planId', async () => {
    const revisedPlan: PlanDto = {
      ...plan,
      currentVersion: {
        ...plan.currentVersion,
        downloadKbps: 30_000,
        priceCents: 30_000,
        uploadKbps: 15_000,
        version: 2,
      },
      isActive: false,
    };
    fetchMock.mockResolvedValue(jsonResponse(revisedPlan));
    const request: RevisePlanRequest = {
      downloadKbps: 30_000,
      effectiveFrom: '2026-08-01',
      isActive: false,
      priceCents: 30_000,
      uploadKbps: 15_000,
    };

    await expect(
      plansService.revisePlan(PLAN_ID, request, {
        correlationId: UUID,
        idempotencyKey: 'revise-plan-key-0001',
      }),
    ).resolves.toEqual(revisedPlan);

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3001/api/v1/planes/' + PLAN_ID,
    );
    expect(init.method).toBe('PUT');
    expect(JSON.parse(String(init.body))).toEqual(request);
    expect(revisedPlan.currentVersion.version).toBe(2);
    expect(revisedPlan.isActive).toBe(false);
  });

  it.each([409, 422])('preserva ApiError para HTTP %s', async (status) => {
    const fields =
      status === 422
        ? [{ path: 'body.code', message: 'Código inválido.' }]
        : undefined;
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          code: status === 409 ? 'PLAN_CODE_CONFLICT' : 'VALIDATION_ERROR',
          correlationId: UUID,
          message: 'Solicitud rechazada.',
          ...(fields === undefined ? {} : { fields }),
        },
        status,
      ),
    );

    const error = await plansService
      .createPlan(
        {
          code: 'HOME_20',
          downloadKbps: 20_000,
          name: 'Hogar 20 Mbps',
          priceCents: 25_000,
          serviceType: 'simple_queue',
          uploadKbps: 10_000,
        },
        { correlationId: UUID, idempotencyKey: 'create-plan-key-0001' },
      )
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      code: status === 409 ? 'PLAN_CODE_CONFLICT' : 'VALIDATION_ERROR',
      correlationId: UUID,
      fields,
      message: 'Solicitud rechazada.',
      status,
    });
  });

  it('no contiene endpoints inexistentes ni fetch directo en Plans', () => {
    const featureDirectory = fileURLToPath(new URL('../', import.meta.url));
    const sources = featureSourceFiles(featureDirectory).map((path) => ({
      path,
      source: readFileSync(path, 'utf8'),
    }));

    const directFetch = sources
      .filter(({ source }) => /\bfetch\s*\(/.test(source))
      .map(({ path }) => path);
    expect(directFetch).toEqual([]);

    const serviceSource = readFileSync(
      fileURLToPath(new URL('./plans.service.ts', import.meta.url)),
      'utf8',
    );
    expect(serviceSource).not.toMatch(/\/versiones|\/estado|publicacion/);
    expect(serviceSource).not.toMatch(/getPlan\s*\(|getPlanVersion/);
  });
});
