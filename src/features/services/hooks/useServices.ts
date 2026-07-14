
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesService, GetServicesParams, ServiceDto } from '../api/services.service';

export function useServices(companyId: string, params: GetServicesParams) {
  return useQuery({
    queryKey: ['services', companyId, params],
    queryFn: () => servicesService.getServices(companyId, params),
    refetchInterval: 30000,
  });
}

export function useService(companyId: string, serviceId: string | null) {
  return useQuery({
    queryKey: ['service', 'detail', companyId, serviceId],
    queryFn: () => servicesService.getService(companyId, serviceId!),
    enabled: !!serviceId,
  });
}

export function useProvisioningOperation(companyId: string, operationId: string | null) {
  return useQuery({
    queryKey: ['service', 'operation', companyId, operationId],
    queryFn: () => servicesService.getOperation(companyId, operationId!),
    enabled: !!operationId,
    refetchInterval: (query) => {
      const st = query.state.data?.status;
      if (st === 'queued' || st === 'running') return 5000;
      return false;
    }
  });
}

export function useServiceMutations(companyId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['services'] });
  const invalidateDetail = (id: string) => queryClient.invalidateQueries({ queryKey: ['service', 'detail', companyId, id] });

  const createService = useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: Partial<ServiceDto> }) => servicesService.createService(companyId, clientId, data),
    onSuccess: invalidate,
  });

  const requestOperation = useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: Record<string, unknown> & { type: string } }) => servicesService.requestOperation(companyId, serviceId, data),
    onSuccess: (data, variables) => {
      invalidate();
      invalidateDetail(variables.serviceId);
    },
  });

  return { createService, requestOperation };
}
