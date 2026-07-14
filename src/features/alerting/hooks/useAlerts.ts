
import { useQuery } from '@tanstack/react-query';
import { alertingService, GetAlertsParams } from '../api/alerting.service';

export function useAlerts(companyId: string, params: GetAlertsParams) {
  return useQuery({
    queryKey: ['alerts', companyId, params],
    queryFn: () => alertingService.getAlerts(companyId, params),
    refetchInterval: 20000, // Requerido: 20s
  });
}
