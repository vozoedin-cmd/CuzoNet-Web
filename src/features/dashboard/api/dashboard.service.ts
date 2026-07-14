
import { apiClient } from '@/services/api/api-client';

export interface DashboardOverviewDto {
  totalActiveClients: number;
  totalActiveServices: number;
  monthlyExpectedRevenueCents: number;
  activeCriticalAlerts: number;
  downNetworkNodes: number;
}

export interface BillingSummaryDto {
  collectedThisMonthCents: number;
  overdueThisMonthCents: number;
  unpaidInvoicesCount: number;
  collectionRatePercentage: number;
}

export interface NetworkHealthDto {
  totalEquipments: number;
  equipmentsDown: number;
  equipmentsWarning: number;
  criticalLinks: Array<{ id: string; name: string; usagePercentage: number }>;
}

export const dashboardService = {
  getOverview: (companyId: string) => 
    apiClient.get<DashboardOverviewDto>(`/dashboard/overview?companyId=${companyId}`),
    
  getBillingSummary: (companyId: string) => 
    apiClient.get<BillingSummaryDto>(`/dashboard/billing-summary?companyId=${companyId}`),
    
  getNetworkHealth: (companyId: string) => 
    apiClient.get<NetworkHealthDto>(`/dashboard/network-health?companyId=${companyId}`),
};
