import { useQuery } from '@tanstack/react-query';

import { dashboardService } from '../api/dashboard.service';
import { DASHBOARD_REFRESH_INTERVALS, dashboardKeys } from './dashboard.query';

export function useDashboardOverview() {
  return useQuery({
    queryFn: ({ signal }) => dashboardService.getOverview(signal),
    queryKey: dashboardKeys.overview(),
    refetchInterval: DASHBOARD_REFRESH_INTERVALS.overview,
  });
}
