
import { apiClient } from '@/services/api/api-client';

export type ServiceLifecycleStatus = 'pending' | 'active' | 'suspended' | 'cancelled' | 'archived';
export type ServiceType = 'simple_queue' | 'pppoe' | 'hotspot';
export type OperationStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled' | 'manual_review';

export interface ServiceDto {
  id: string;
  clientId: string;
  planVersionId: string;
  type: ServiceType;
  lifecycleStatus: ServiceLifecycleStatus;
  billingDay: number;
  createdAt: string;
  lastOperationId: string | null;
  technicalStatus?: string;
}

export interface ServiceOperationDto {
  id: string;
  serviceId: string;
  type: 'provision' | 'suspend' | 'resume' | 'cancel' | 'change_plan';
  status: OperationStatus;
  attemptCount: number;
  maxAttempts: number;
  lastError: string | null;
  queuedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface ServiceDetailsDto extends ServiceDto {
  recentOperations: ServiceOperationDto[];
}

export interface ServiceStatsDto {
  total: number;
  pending: number;
  active: number;
  suspended: number;
  cancelled: number;
  pendingOperations: number;
}

export interface GetServicesParams {
  search?: string;
  lifecycleStatus?: string;
  serviceType?: string;
  planVersionId?: string;
  clientId?: string;
  billingDay?: string;
  page?: number;
  limit?: number;
}

// Endpoint global eliminado

const isDemo = () => process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

const uuidv4 = () => crypto.randomUUID();

export const servicesService = {
  getServices: async (companyId: string, params: GetServicesParams): Promise<{ services: ServiceDto[] }> => {
    if (isDemo()) {
      const { getDemoServices } = await import('../model/demo-services.fixture');
      let data = getDemoServices().services;
      if (params.clientId) data = data.filter(s => s.clientId === params.clientId);
      if (params.lifecycleStatus) data = data.filter(s => s.lifecycleStatus === params.lifecycleStatus);
      if (params.serviceType) data = data.filter(s => s.type === params.serviceType);
      if (params.billingDay) data = data.filter(s => s.billingDay === Number(params.billingDay));
      return { services: data };
    }
    if (!params.clientId) {
      return { services: [] }; // No fetch if no client
    }
    // Utilizamos el endpoint de cliente
    const services = await apiClient.get<ServiceDto[]>(`/clientes/${params.clientId}/servicios?companyId=${companyId}`);
    // Filtrar localmente si el backend no soporta query params en este endpoint
    let filtered = services;
    if (params.lifecycleStatus) filtered = filtered.filter(s => s.lifecycleStatus === params.lifecycleStatus);
    if (params.serviceType) filtered = filtered.filter(s => s.type === params.serviceType);
    if (params.billingDay) filtered = filtered.filter(s => s.billingDay === Number(params.billingDay));
    return { services: filtered };
  },

  getService: async (companyId: string, serviceId: string): Promise<ServiceDetailsDto> => {
    if (isDemo()) {
      const { getDemoServiceDetails } = await import('../model/demo-services.fixture');
      return getDemoServiceDetails(serviceId);
    }
    return await apiClient.get<ServiceDetailsDto>(`/servicios/${serviceId}?companyId=${companyId}`);
  },

  createService: async (companyId: string, clientId: string, data: Partial<ServiceDto>): Promise<ServiceDto> => {
    if (isDemo()) return { ...data, id: 'srv-' + uuidv4(), lifecycleStatus: 'pending' } as ServiceDto;
    const idempotencyKey = crypto.randomUUID();
    return await apiClient.post<ServiceDto>(`/clientes/${clientId}/servicios?companyId=${companyId}`, data, { idempotencyKey });
  },

  requestOperation: async (companyId: string, serviceId: string, data: Record<string, unknown> & { type: string }): Promise<ServiceOperationDto> => {
    if (isDemo()) return { id: 'op-' + uuidv4(), serviceId, type: data.type as 'provision', status: 'queued', attemptCount: 0, maxAttempts: 3, lastError: null, queuedAt: new Date().toISOString(), startedAt: null, completedAt: null };
    const idempotencyKey = crypto.randomUUID();
    return await apiClient.post<ServiceOperationDto>(`/servicios/${serviceId}/operaciones?companyId=${companyId}`, data, { idempotencyKey });
  },

  getOperation: async (companyId: string, operationId: string): Promise<ServiceOperationDto> => {
    if (isDemo()) {
      const { getDemoOperation } = await import('../model/demo-services.fixture');
      return getDemoOperation(operationId);
    }
    return await apiClient.get<ServiceOperationDto>(`/operaciones/${operationId}?companyId=${companyId}`);
  }
};
