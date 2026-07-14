
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/dashboard.service';

export function useNetworkHealth(companyId: string) {
  return useQuery({
    queryKey: ['dashboard', 'network-health', companyId],
    queryFn: () => dashboardService.getNetworkHealth(companyId),
    refetchInterval: 30000,
  });
}
