
import { useQuery } from '@tanstack/react-query';
import { workersService, GetWorkersParams } from '../api/workers.service';

export function useWorkersHealth(companyId: string, params: GetWorkersParams) {
  return useQuery({
    queryKey: ['workers', 'health', companyId, params],
    queryFn: () => workersService.getWorkersHealth(companyId, params),
    refetchInterval: 10000,
  });
}

export function useWorkerStatistics(companyId: string) {
  return useQuery({
    queryKey: ['workers', 'statistics', companyId],
    queryFn: () => workersService.getWorkerStatistics(companyId),
    refetchInterval: 30000,
  });
}

export function usePendingOperations(companyId: string) {
  return useQuery({
    queryKey: ['workers', 'operations', 'pending', companyId],
    queryFn: () => workersService.getPendingOperations(companyId),
    refetchInterval: 15000,
  });
}

export function useFailedOperations(companyId: string) {
  return useQuery({
    queryKey: ['workers', 'operations', 'failed', companyId],
    queryFn: () => workersService.getFailedOperations(companyId),
    refetchInterval: 15000,
  });
}

export function useActiveLeases(companyId: string, workerId: string | null) {
  return useQuery({
    queryKey: ['workers', 'leases', companyId, workerId],
    queryFn: () => {
      if (!workerId) return Promise.resolve([]);
      return workersService.getActiveLeases(companyId, workerId);
    },
    enabled: !!workerId,
    refetchInterval: 10000,
  });
}
