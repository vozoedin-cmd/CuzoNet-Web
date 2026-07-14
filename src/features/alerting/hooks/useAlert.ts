
import { useQuery } from '@tanstack/react-query';
import { alertingService } from '../api/alerting.service';

export function useAlert(companyId: string, alertId: string | null) {
  return useQuery({
    queryKey: ['alerts', 'detail', companyId, alertId],
    queryFn: () => alertingService.getAlert(companyId, alertId!),
    enabled: !!alertId,
  });
}
