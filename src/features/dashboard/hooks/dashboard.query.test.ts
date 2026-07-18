import { describe, expect, it } from 'vitest';

import { DASHBOARD_REFRESH_INTERVALS, dashboardKeys } from './dashboard.query';

describe('Dashboard query contracts', () => {
  it('usa keys estables e independientes', () => {
    expect(dashboardKeys.overview()).toEqual(['dashboard', 'overview']);
    expect(dashboardKeys.billingSummary()).toEqual(['dashboard', 'billing-summary']);
    expect(dashboardKeys.networkHealth()).toEqual(['dashboard', 'network-health']);
  });

  it('usa polling no agresivo según cada bloque', () => {
    expect(DASHBOARD_REFRESH_INTERVALS).toEqual({
      billingSummary: 60_000,
      networkHealth: 30_000,
      overview: 30_000,
    });
  });
});
