import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  dashboardService,
  type BillingSummaryDto,
  type DashboardOverviewDto,
  type NetworkHealthDto,
} from './dashboard.service';

const overview: DashboardOverviewDto = {
  activeCriticalAlerts: 2,
  downNetworkNodes: 1,
  monthlyExpectedRevenueCents: 125_000,
  totalActiveClients: 20,
  totalActiveServices: 24,
};
const billing: BillingSummaryDto = {
  collectedThisMonthCents: 75_000,
  collectionRatePercentage: 60,
  overdueThisMonthCents: 50_000,
  unpaidInvoicesCount: 4,
};
const network: NetworkHealthDto = {
  criticalLinks: [{ id: 'link-1', name: 'Enlace Norte', usagePercentage: 91 }],
  equipmentsDown: 1,
  equipmentsWarning: 2,
  totalEquipments: 12,
};

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}

function productionSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = directory + '/' + entry;
    if (statSync(path).isDirectory()) return productionSourceFiles(path);
    const isSource = entry.endsWith('.ts') || entry.endsWith('.tsx');
    return isSource && !entry.includes('.test.') ? [path] : [];
  });
}

describe('dashboardService', () => {
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

  it.each([
    ['overview', overview, () => dashboardService.getOverview()],
    ['billing-summary', billing, () => dashboardService.getBillingSummary()],
    ['network-health', network, () => dashboardService.getNetworkHealth()],
  ])('consume GET /dashboard/%s con el DTO real', async (path, dto, call) => {
    fetchMock.mockResolvedValue(jsonResponse(dto));

    await expect(call()).resolves.toEqual(dto);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/api/v1/dashboard/' + path,
      expect.objectContaining({ method: 'GET' }),
    );
    expect(String(fetchMock.mock.calls[0][0])).not.toContain('companyId');
  });

  it('propaga AbortSignal mediante el apiClient central', async () => {
    fetchMock.mockResolvedValue(jsonResponse(overview));
    const controller = new AbortController();

    await dashboardService.getOverview(controller.signal);

    expect(fetchMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('no usa fixtures, companyId ficticio ni fetch directo en Dashboard', () => {
    const featureDirectory = fileURLToPath(new URL('../', import.meta.url));
    const sources = productionSourceFiles(featureDirectory).map((path) => ({
      path,
      source: readFileSync(path, 'utf8'),
    }));

    const directFetchToken = 'fetch' + '(';
    expect(
      sources.filter(({ source }) => source.includes(directFetchToken)).map(({ path }) => path),
    ).toEqual([]);
    expect(sources.map(({ source }) => source).join(' ')).not.toMatch(
      /mock-company|demo-dashboard|fixture/i,
    );

    const serviceSource = readFileSync(
      fileURLToPath(new URL('./dashboard.service.ts', import.meta.url)),
      'utf8',
    );
    expect(serviceSource).toContain("import { apiClient }");
  });
});
