import {
  apiClient,
  type ApiRequestOptions,
} from '@/services/api/api-client';

export type ServiceLifecycleStatus =
  | 'pending'
  | 'active'
  | 'suspended'
  | 'cancelled'
  | 'archived';
export type ServiceType = 'simple_queue' | 'pppoe' | 'hotspot';
export type OperationStatus =
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'manual_review';

interface BackendServiceDto {
  billingDay: number;
  clientId: string;
  id: string;
  lifecycleStatus: ServiceLifecycleStatus;
  planVersionId: string;
  serviceType: ServiceType;
  startedOn?: string;
}

export interface ServiceDto {
  billingDay: number;
  clientId: string;
  lifecycleStatus: ServiceLifecycleStatus;
  planVersionId: string;
  serviceId: string;
  serviceType: ServiceType;
  startedOn?: string;
}

export interface CreateServiceRequest {
  billingDay: number;
  planVersionId: string;
  serviceType: ServiceType;
}

export interface RequestProvisioningRequest {
  ipAddressId?: string;
  routerId: string;
  serviceAddressId?: string;
  type: 'provision';
}

export interface OperationAcceptedDto {
  correlationId: string;
  operationId: string;
  status: 'queued';
}

export interface OperationDto {
  attemptCount: number;
  completedAt: string | null;
  createdAt: string;
  id: string;
  lastError: string | null;
  serviceId: string;
  status: OperationStatus;
  type: 'provision';
}

export type ServiceMutationOptions = Pick<
  ApiRequestOptions,
  'correlationId' | 'idempotencyKey' | 'signal'
>;

export const TERMINAL_OPERATION_STATUSES = [
  'succeeded',
  'failed',
  'cancelled',
  'manual_review',
] as const satisfies readonly OperationStatus[];

export function isTerminalOperationStatus(status: OperationStatus): boolean {
  return TERMINAL_OPERATION_STATUSES.some((terminal) => terminal === status);
}

function toServiceDto(service: BackendServiceDto): ServiceDto {
  return {
    billingDay: service.billingDay,
    clientId: service.clientId,
    lifecycleStatus: service.lifecycleStatus,
    planVersionId: service.planVersionId,
    serviceId: service.id,
    serviceType: service.serviceType,
    ...(service.startedOn === undefined ? {} : { startedOn: service.startedOn }),
  };
}

function mutationOptions(options: ServiceMutationOptions = {}): ApiRequestOptions {
  return {
    ...options,
    idempotencyKey: options.idempotencyKey ?? crypto.randomUUID(),
  };
}

export const servicesService = {
  async getClientServices(
    clientId: string | null,
    signal?: AbortSignal,
  ): Promise<ServiceDto[]> {
    if (clientId === null || clientId.trim().length === 0) return [];

    const services = await apiClient.get<BackendServiceDto[]>(
      '/clientes/' + clientId + '/servicios',
      { signal },
    );
    return services.map(toServiceDto);
  },

  async getService(serviceId: string, signal?: AbortSignal): Promise<ServiceDto> {
    const service = await apiClient.get<BackendServiceDto>(
      '/servicios/' + serviceId,
      { signal },
    );
    return toServiceDto(service);
  },

  async createService(
    clientId: string,
    data: CreateServiceRequest,
    options?: ServiceMutationOptions,
  ): Promise<ServiceDto> {
    const service = await apiClient.post<BackendServiceDto, CreateServiceRequest>(
      '/clientes/' + clientId + '/servicios',
      data,
      mutationOptions(options),
    );
    return toServiceDto(service);
  },

  requestProvisioning(
    serviceId: string,
    data: RequestProvisioningRequest,
    options?: ServiceMutationOptions,
  ): Promise<OperationAcceptedDto> {
    return apiClient.post<OperationAcceptedDto, RequestProvisioningRequest>(
      '/servicios/' + serviceId + '/operaciones',
      data,
      mutationOptions(options),
    );
  },

  getOperation(operationId: string, signal?: AbortSignal): Promise<OperationDto> {
    return apiClient.get<OperationDto>('/operaciones/' + operationId, { signal });
  },
};
