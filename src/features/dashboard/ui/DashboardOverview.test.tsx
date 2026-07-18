import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../hooks/useDashboardOverview', () => ({
  useDashboardOverview: () => ({
    data: {
      activeCriticalAlerts: 2,
      downNetworkNodes: 1,
      monthlyExpectedRevenueCents: 125_000,
      totalActiveClients: 20,
      totalActiveServices: 24,
    },
    dataUpdatedAt: Date.parse('2026-07-15T12:00:00.000Z'),
    error: null,
    isFetching: false,
    isLoading: false,
  }),
}));

vi.mock('../hooks/useDashboardBillingSummary', () => ({
  useDashboardBillingSummary: () => ({
    data: {
      collectedThisMonthCents: 75_000,
      collectionRatePercentage: 60,
      overdueThisMonthCents: 50_000,
      unpaidInvoicesCount: 4,
    },
    dataUpdatedAt: Date.parse('2026-07-15T12:00:00.000Z'),
    error: null,
    isFetching: false,
    isLoading: false,
  }),
}));

vi.mock('../hooks/useDashboardNetworkHealth', () => ({
  useDashboardNetworkHealth: () => ({
    data: undefined,
    dataUpdatedAt: 0,
    error: new Error('Network reader unavailable'),
    isFetching: false,
    isLoading: false,
  }),
}));

import { DashboardOverview } from './DashboardOverview';

describe('DashboardOverview', () => {
  it('mantiene Overview y Billing visibles cuando Network Health falla', () => {
    const html = renderToStaticMarkup(<DashboardOverview />);

    expect(html).toContain('Clientes activos');
    expect(html).toContain('Resumen de cobros');
    expect(html).toContain('No se pudo cargar la salud de red');
    expect(html).toContain('Network reader unavailable');
  });
});
