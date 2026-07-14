
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/dashboard.service';

export function useDashboardOverview(companyId: string) {
  return useQuery({
    queryKey: ['dashboard', 'overview', companyId],
    queryFn: () => dashboardService.getOverview(companyId),
    refetchInterval: 30000,
  });
}
