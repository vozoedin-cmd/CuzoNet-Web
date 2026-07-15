
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

export interface ChartDataPoint {
  date: string;
  value1: number;
  value2?: number;
  value3?: number;
}

const isDemo = () => process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

export const analyticsService = {
  getOverview: async (companyId: string): Promise<DashboardOverviewDto> => {
    if (isDemo()) {
      const { demoOverview } = await import('../model/demo-analytics.fixture');
      return demoOverview;
    }
    return apiClient.get<DashboardOverviewDto>(`/dashboard/overview?companyId=${companyId}`);
  },

  getBillingSummary: async (companyId: string): Promise<BillingSummaryDto> => {
    if (isDemo()) {
      const { demoBillingSummary } = await import('../model/demo-analytics.fixture');
      return demoBillingSummary;
    }
    return apiClient.get<BillingSummaryDto>(`/dashboard/billing-summary?companyId=${companyId}`);
  },

  getNetworkHealth: async (companyId: string): Promise<NetworkHealthDto> => {
    if (isDemo()) {
      const { demoNetworkHealth } = await import('../model/demo-analytics.fixture');
      return demoNetworkHealth;
    }
    return apiClient.get<NetworkHealthDto>(`/dashboard/network-health?companyId=${companyId}`);
  },

  // Endpoints ficticios (Charts) -> retornan null en producción
  getRevenueTrend: async (companyId: string, timeRange: string): Promise<ChartDataPoint[] | null> => {
    if (isDemo()) {
      const { getDemoRevenueTrend } = await import('../model/demo-analytics.fixture');
      return getDemoRevenueTrend(timeRange);
    }
    return null; // Endpoint no existe
  },

  getClientGrowth: async (companyId: string, timeRange: string): Promise<ChartDataPoint[] | null> => {
    if (isDemo()) {
      const { getDemoClientGrowth } = await import('../model/demo-analytics.fixture');
      return getDemoClientGrowth(timeRange);
    }
    return null; // Endpoint no existe
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getServiceDistribution: async (companyId: string): Promise<{ name: string; value: number }[] | null> => {
    if (isDemo()) {
      const { demoServiceDistribution } = await import('../model/demo-analytics.fixture');
      return demoServiceDistribution;
    }
    return null; // Endpoint no existe
  },

  getNetworkAvailabilityTrend: async (companyId: string, timeRange: string): Promise<ChartDataPoint[] | null> => {
    if (isDemo()) {
      const { getDemoNetworkAvailability } = await import('../model/demo-analytics.fixture');
      return getDemoNetworkAvailability(timeRange);
    }
    return null; // Endpoint no existe
  },

  getAlertTrend: async (companyId: string, timeRange: string): Promise<ChartDataPoint[] | null> => {
    if (isDemo()) {
      const { getDemoAlertTrend } = await import('../model/demo-analytics.fixture');
      return getDemoAlertTrend(timeRange);
    }
    return null; // Endpoint no existe
  }
};
