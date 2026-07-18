export const DASHBOARD_REFRESH_INTERVALS = {
  billingSummary: 60_000,
  networkHealth: 30_000,
  overview: 30_000,
} as const;

export const dashboardKeys = {
  all: ['dashboard'] as const,
  billingSummary: () => [...dashboardKeys.all, 'billing-summary'] as const,
  networkHealth: () => [...dashboardKeys.all, 'network-health'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
};
