import {
  readFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/services/api/api-client';

import {
  billingService,
  type ClientAccountDto,
  type CreatePaymentRequest,
  type PaymentDto,
  type PaymentPageDto,
} from './billing.service';

const CLIENT_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c10';
const PAYMENT_ID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c20';
const UUID = '01890f2e-7b2a-7cc0-8b9a-7e6b4f3a2c50';

const payment: PaymentDto = {
  allocations: [],
  amountCents: 10_005,
  clientId: CLIENT_ID,
  currencyCode: 'GTQ',
  id: PAYMENT_ID,
  method: 'transfer',
  receivedAt: '2026-07-15T14:30:00.000Z',
  status: 'recorded',
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

describe('billingService', () => {
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

  it('lista la página real con page/pageSize y filtros clientId/from/to', async () => {
    const page: PaymentPageDto = {
      data: [payment],
      page: 2,
      pageSize: 20,
      total: 25,
    };
    fetchMock.mockResolvedValue(jsonResponse(page));

    await expect(
      billingService.getPayments({
        clientId: CLIENT_ID,
        from: '2026-07-01',
        page: 2,
        pageSize: 20,
        to: '2026-07-15',
      }),
    ).resolves.toEqual(page);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/pagos?page=2&pageSize=20&clientId=' +
        CLIENT_ID +
        '&from=2026-07-01&to=2026-07-15',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('registra el DTO real con Idempotency-Key y campos exactos', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(UUID);
    fetchMock.mockResolvedValue(jsonResponse(payment, 201));
    const request: CreatePaymentRequest = {
      amountCents: 10_005,
      clientId: CLIENT_ID,
      currencyCode: 'GTQ',
      externalReference: 'TRANSFER-123',
      method: 'transfer',
      receivedAt: '2026-07-15T14:30:00.000Z',
    };

    await expect(
      billingService.registerPayment(request, { correlationId: UUID }),
    ).resolves.toEqual(payment);

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    const headers = new Headers(init.headers);

    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3001/api/v1/pagos',
    );
    expect(init.method).toBe('POST');
    expect(body).toEqual(request);
    expect(Number.isInteger(body.amountCents)).toBe(true);
    expect(body.method).toBe('transfer');
    expect(body.receivedAt).toBe('2026-07-15T14:30:00.000Z');
    expect(body.externalReference).toBe('TRANSFER-123');
    expect(body).not.toHaveProperty('assignments');
    expect(headers.get('Idempotency-Key')).toBe(UUID);
  });

  it('consulta la cuenta real del cliente', async () => {
    const account: ClientAccountDto = {
      clientId: CLIENT_ID,
      creditCents: 10_000,
      currencyCode: 'GTQ',
      debtCents: 0,
      invoiceCount: 0,
      nextDueOn: null,
      overdueCents: 0,
    };
    fetchMock.mockResolvedValue(jsonResponse(account));

    await expect(
      billingService.getClientAccount(CLIENT_ID),
    ).resolves.toEqual(account);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'http://localhost:3001/api/v1/clientes/' + CLIENT_ID + '/cuenta',
    );
    expect(fetchMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it.each([409, 422])('preserva ApiError para HTTP %s', async (status) => {
    const fields =
      status === 422
        ? [{ path: 'body.amountCents', message: 'Debe ser positivo.' }]
        : undefined;
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          code: status === 409 ? 'CURRENCY_MISMATCH' : 'VALIDATION_ERROR',
          correlationId: UUID,
          message: 'Solicitud rechazada.',
          ...(fields === undefined ? {} : { fields }),
        },
        status,
      ),
    );

    const error = await billingService
      .registerPayment(
        {
          amountCents: 10_000,
          clientId: CLIENT_ID,
          currencyCode: 'GTQ',
          method: 'cash',
          receivedAt: '2026-07-15T14:30:00.000Z',
        },
        { correlationId: UUID, idempotencyKey: 'payment-key-000001' },
      )
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      code: status === 409 ? 'CURRENCY_MISMATCH' : 'VALIDATION_ERROR',
      correlationId: UUID,
      fields,
      message: 'Solicitud rechazada.',
      status,
    });
  });

  it('no contiene endpoints ficticios ni fetch directo en Billing', () => {
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
      fileURLToPath(new URL('./billing.service.ts', import.meta.url)),
      'utf8',
    );
    expect(serviceSource).not.toContain("'/pagos/'");
    expect(serviceSource).not.toMatch(
      /estado-cuenta|\/facturas|reversion|delete\s*:/,
    );
    expect(serviceSource).not.toMatch(/getPayment\s*\(|getClientStatement/);
  });
});
