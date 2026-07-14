
import { useQuery } from '@tanstack/react-query';
import { monitoringService } from '../api/monitoring.service';

export function useMonitoring(companyId: string) {
  return useQuery({
    queryKey: ['monitoring', 'dashboard', companyId],
    queryFn: () => monitoringService.getDashboard(companyId),
    refetchInterval: 15000, // Requerido: 15 segundos
  });
}
