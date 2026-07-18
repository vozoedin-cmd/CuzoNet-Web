import { apiClient } from '@/services/api/api-client';

export interface DashboardOverviewDto {
  activeCriticalAlerts: number;
  downNetworkNodes: number;
  monthlyExpectedRevenueCents: number;
  totalActiveClients: number;
  totalActiveServices: number;
}

export interface BillingSummaryDto {
  collectedThisMonthCents: number;
  collectionRatePercentage: number;
  overdueThisMonthCents: number;
  unpaidInvoicesCount: number;
}

export interface NetworkHealthDto {
  criticalLinks: Array<{
    id: string;
    name: string;
    usagePercentage: number;
  }>;
  equipmentsDown: number;
  equipmentsWarning: number;
  totalEquipments: number;
}

export const dashboardService = {
  getBillingSummary: (signal?: AbortSignal) =>
    apiClient.get<BillingSummaryDto>('/dashboard/billing-summary', { signal }),
  getNetworkHealth: (signal?: AbortSignal) =>
    apiClient.get<NetworkHealthDto>('/dashboard/network-health', { signal }),
  getOverview: (signal?: AbortSignal) =>
    apiClient.get<DashboardOverviewDto>('/dashboard/overview', { signal }),
};
