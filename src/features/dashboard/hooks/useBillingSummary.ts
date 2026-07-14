
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/dashboard.service';

export function useBillingSummary(companyId: string) {
  return useQuery({
    queryKey: ['dashboard', 'billing-summary', companyId],
    queryFn: () => dashboardService.getBillingSummary(companyId),
    refetchInterval: 30000,
  });
}
