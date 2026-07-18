import { useQuery } from '@tanstack/react-query';

import { dashboardService } from '../api/dashboard.service';
import { DASHBOARD_REFRESH_INTERVALS, dashboardKeys } from './dashboard.query';

export function useDashboardNetworkHealth() {
  return useQuery({
    queryFn: ({ signal }) => dashboardService.getNetworkHealth(signal),
    queryKey: dashboardKeys.networkHealth(),
    refetchInterval: DASHBOARD_REFRESH_INTERVALS.networkHealth,
  });
}
