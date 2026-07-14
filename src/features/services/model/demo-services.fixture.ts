
import { ServiceDto, ServiceDetailsDto, ServiceStatsDto, ServiceOperationDto } from '../api/services.service';

export const getDemoServices = (): { services: ServiceDto[], stats: ServiceStatsDto } => {
  const services: ServiceDto[] = [
    {
      id: 'srv-001',
      clientId: 'cli-001',
      planVersionId: 'pv-100',
      type: 'pppoe',
      lifecycleStatus: 'active',
      billingDay: 1,
      createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
      lastOperationId: 'op-001',
      
    },
    {
      id: 'srv-002',
      clientId: 'cli-002',
      planVersionId: 'pv-200',
      type: 'simple_queue',
      lifecycleStatus: 'pending',
      billingDay: 15,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      lastOperationId: null,
      
    },
    {
      id: 'srv-003',
      clientId: 'cli-003',
      planVersionId: 'pv-150',
      type: 'hotspot',
      lifecycleStatus: 'suspended',
      billingDay: 5,
      createdAt: new Date(Date.now() - 86400000 * 50).toISOString(),
      lastOperationId: 'op-003',
      
    },
  ];

  const stats: ServiceStatsDto = {
    total: 1200,
    pending: 15,
    active: 1050,
    suspended: 80,
    cancelled: 55,
    pendingOperations: 8
  };

  return { services, stats };
};

export const getDemoServiceDetails = (id: string): ServiceDetailsDto => {
  const base = getDemoServices().services.find(s => s.id === id) || getDemoServices().services[0];
  return {
    ...base,
    recentOperations: [
      {
        id: base.lastOperationId || 'op-demo',
        serviceId: base.id,
        type: 'provision',
        status: base.lifecycleStatus === 'active' ? 'succeeded' : (base.lifecycleStatus === 'pending' ? 'queued' : 'failed'),
        attemptCount: base.lifecycleStatus === 'suspended' ? 3 : 1,
        maxAttempts: 3,
        lastError: base.lifecycleStatus === 'suspended' ? '[SANITIZED] Error de conexión al RouterOS: Timeout' : null,
        queuedAt: new Date(Date.now() - 3600000).toISOString(),
        startedAt: new Date(Date.now() - 3500000).toISOString(),
        completedAt: base.lifecycleStatus === 'active' ? new Date(Date.now() - 3400000).toISOString() : null,
      }
    ]
  };
};

export const getDemoOperation = (id: string): ServiceOperationDto => {
  return {
    id,
    serviceId: 'srv-demo',
    type: 'provision',
    status: 'running',
    attemptCount: 1,
    maxAttempts: 3,
    lastError: null,
    queuedAt: new Date(Date.now() - 60000).toISOString(),
    startedAt: new Date(Date.now() - 10000).toISOString(),
    completedAt: null
  };
};
