
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../api/analytics.service';
import { useAnalyticsStore } from '../model/analytics.store';

export function useExecutiveSummary(companyId: string) {
  return useQuery({
    queryKey: ['analytics', 'overview', companyId],
    queryFn: () => analyticsService.getOverview(companyId),
    refetchInterval: 60000,
  });
}

export function useRevenueAnalytics(companyId: string) {
  const timeRange = useAnalyticsStore(s => s.timeRange);
  return useQuery({
    queryKey: ['analytics', 'revenue', companyId, timeRange],
    queryFn: async () => {
      const summary = await analyticsService.getBillingSummary(companyId);
      const trend = await analyticsService.getRevenueTrend(companyId, timeRange);
      return { summary, trend };
    },
    refetchInterval: 60000,
  });
}

export function useClientAnalytics(companyId: string) {
  const timeRange = useAnalyticsStore(s => s.timeRange);
  return useQuery({
    queryKey: ['analytics', 'clients', companyId, timeRange],
    queryFn: () => analyticsService.getClientGrowth(companyId, timeRange),
  });
}

export function useNetworkAnalytics(companyId: string) {
  return useQuery({
    queryKey: ['analytics', 'network', companyId],
    queryFn: () => analyticsService.getNetworkHealth(companyId),
    refetchInterval: 30000,
  });
}

export function useAvailabilityAnalytics(companyId: string) {
  const timeRange = useAnalyticsStore(s => s.timeRange);
  return useQuery({
    queryKey: ['analytics', 'availability', companyId, timeRange],
    queryFn: () => analyticsService.getNetworkAvailabilityTrend(companyId, timeRange),
  });
}

export function useAlertAnalytics(companyId: string) {
  const timeRange = useAnalyticsStore(s => s.timeRange);
  return useQuery({
    queryKey: ['analytics', 'alerts', companyId, timeRange],
    queryFn: () => analyticsService.getAlertTrend(companyId, timeRange),
  });
}
