
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { alertingService } from '../api/alerting.service';

export function useAcknowledgeAlert(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) => alertingService.acknowledge(companyId, alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useResolveAlert(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) => alertingService.resolve(companyId, alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
