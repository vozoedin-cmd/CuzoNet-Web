import { useQuery } from '@tanstack/react-query';

import { dashboardService } from '../api/dashboard.service';
import { DASHBOARD_REFRESH_INTERVALS, dashboardKeys } from './dashboard.query';

export function useDashboardBillingSummary() {
  return useQuery({
    queryFn: ({ signal }) => dashboardService.getBillingSummary(signal),
    queryKey: dashboardKeys.billingSummary(),
    refetchInterval: DASHBOARD_REFRESH_INTERVALS.billingSummary,
  });
}
