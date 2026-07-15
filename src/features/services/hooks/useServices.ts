import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/services/api/api-client';

import {
  isTerminalOperationStatus,
  servicesService,
  type CreateServiceRequest,
  type OperationAcceptedDto,
  type OperationDto,
  type OperationStatus,
  type RequestProvisioningRequest,
  type ServiceDto,
  type ServiceMutationOptions,
} from '../api/services.service';

export const serviceKeys = {
  all: ['services'] as const,
  clientLists: () => [...serviceKeys.all, 'client'] as const,
  clientServices: (clientId: string) =>
    [...serviceKeys.clientLists(), clientId] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (serviceId: string) => [...serviceKeys.details(), serviceId] as const,
  operations: () => [...serviceKeys.all, 'operation'] as const,
  operation: (operationId: string) =>
    [...serviceKeys.operations(), operationId] as const,
};

export function getOperationPollingInterval(
  status: OperationStatus | undefined,
): 5000 | false {
  return status === undefined || isTerminalOperationStatus(status) ? false : 5000;
}

export function useClientServices(clientId: string | null) {
  return useQuery<ServiceDto[], ApiError>({
    queryKey: serviceKeys.clientServices(clientId ?? ''),
    queryFn: ({ signal }) => servicesService.getClientServices(clientId, signal),
    enabled: clientId !== null && clientId.trim().length > 0,
    refetchInterval: 30_000,
  });
}

export function useService(serviceId: string | null) {
  return useQuery<ServiceDto, ApiError>({
    queryKey: serviceKeys.detail(serviceId ?? ''),
    queryFn: ({ signal }) => servicesService.getService(serviceId ?? '', signal),
    enabled: serviceId !== null && serviceId.length > 0,
  });
}

interface CreateServiceVariables {
  data: CreateServiceRequest;
  options?: ServiceMutationOptions;
}

export function useCreateService(clientId: string | null) {
  const queryClient = useQueryClient();

  return useMutation<ServiceDto, ApiError, CreateServiceVariables>({
    mutationFn: ({ data, options }) => {
      if (clientId === null || clientId.trim().length === 0) {
        throw new Error('Se requiere un cliente seleccionado.');
      }
      return servicesService.createService(clientId, data, options);
    },
    onSuccess: (service) => {
      queryClient.setQueryData(serviceKeys.detail(service.serviceId), service);
      void queryClient.invalidateQueries({
        queryKey: serviceKeys.clientServices(service.clientId),
      });
    },
  });
}

interface RequestProvisioningVariables {
  data: RequestProvisioningRequest;
  options?: ServiceMutationOptions;
}

export function useRequestProvisioning(serviceId: string | null) {
  const queryClient = useQueryClient();

  return useMutation<OperationAcceptedDto, ApiError, RequestProvisioningVariables>({
    mutationFn: ({ data, options }) => {
      if (serviceId === null || serviceId.length === 0) {
        throw new Error('Se requiere un servicio seleccionado.');
      }
      return servicesService.requestProvisioning(serviceId, data, options);
    },
    onSuccess: () => {
      if (serviceId === null) return;

      const service = queryClient.getQueryData<ServiceDto>(
        serviceKeys.detail(serviceId),
      );
      void queryClient.invalidateQueries({ queryKey: serviceKeys.detail(serviceId) });
      if (service !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: serviceKeys.clientServices(service.clientId),
        });
      }
    },
  });
}

export function useProvisioningOperation(operationId: string | null) {
  return useQuery<OperationDto, ApiError>({
    queryKey: serviceKeys.operation(operationId ?? ''),
    queryFn: ({ signal }) =>
      servicesService.getOperation(operationId ?? '', signal),
    enabled: operationId !== null && operationId.length > 0,
    retry: 2,
    refetchInterval: (query) =>
      getOperationPollingInterval(query.state.data?.status),
  });
}
