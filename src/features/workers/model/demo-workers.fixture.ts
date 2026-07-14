
import { WorkerHealthDto, WorkerStatisticsDto, PendingOperationDto, FailedOperationDto, ActiveLeaseDto } from '../api/workers.service';

export const getDemoWorkersHealth = (): WorkerHealthDto[] => [
  {
    workerId: 'wrk-outbox-01',
    role: 'outbox',
    status: 'healthy',
    heartbeat: new Date().toISOString(),
    processedCount: 15420,
    failedCount: 12,
    retryCount: 45,
    lastSuccessAt: new Date(Date.now() - 5000).toISOString(),
    lastFailureAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    workerId: 'wrk-prov-01',
    role: 'provisioning',
    status: 'healthy',
    heartbeat: new Date().toISOString(),
    processedCount: 345,
    failedCount: 2,
    retryCount: 5,
    lastSuccessAt: new Date(Date.now() - 15000).toISOString(),
    lastFailureAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    workerId: 'wrk-notif-01',
    role: 'notifications',
    status: 'degraded',
    heartbeat: new Date(Date.now() - 45000).toISOString(),
    processedCount: 8900,
    failedCount: 150,
    retryCount: 300,
    lastSuccessAt: new Date(Date.now() - 60000).toISOString(),
    lastFailureAt: new Date(Date.now() - 30000).toISOString(),
  },
  {
    workerId: 'wrk-auto-01',
    role: 'automation',
    status: 'stopped',
    heartbeat: new Date(Date.now() - 3600000).toISOString(),
    processedCount: 1200,
    failedCount: 0,
    retryCount: 0,
    lastSuccessAt: new Date(Date.now() - 3600000).toISOString(),
  }
];

export const getDemoWorkerStatistics = (): WorkerStatisticsDto => ({
  totalActive: 2,
  totalDegraded: 1,
  totalStopped: 1,
  pendingOperations: 8,
  failedOperations: 3,
  totalRetries: 350,
  lastGlobalSuccessAt: new Date(Date.now() - 5000).toISOString(),
});

export const getDemoPendingOperations = (): PendingOperationDto[] => [
  {
    operationId: 'op-prov-991',
    type: 'provisioning',
    serviceId: 'srv-101',
    status: 'running',
    attemptCount: 1,
    maxAttempts: 3,
    claimedBy: 'wrk-prov-01',
    leaseUntil: new Date(Date.now() + 30000).toISOString(),
    createdAt: new Date(Date.now() - 10000).toISOString(),
  },
  {
    operationId: 'op-notif-882',
    type: 'notification',
    status: 'queued',
    attemptCount: 0,
    maxAttempts: 5,
    createdAt: new Date(Date.now() - 2000).toISOString(),
  }
];

export const getDemoFailedOperations = (): FailedOperationDto[] => [
  {
    operationId: 'op-prov-003',
    errorCode: 'ROUTER_TIMEOUT',
    lastError: 'connection timed out after 30000ms: password authentication failed for admin@192.168.1.1',
    attempts: 3,
    status: 'failed',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    manualReview: true,
  },
  {
    operationId: 'op-notif-004',
    errorCode: 'PROVIDER_ERROR',
    lastError: 'SMTP 550 Message rejected due to spam filter heuristics. See link for details.',
    attempts: 5,
    status: 'manual_review',
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    manualReview: true,
  }
];

export const getDemoActiveLeases = (workerId: string): ActiveLeaseDto[] => {
  return [
    {
      id: 'lease-001',
      workerId,
      operationId: 'op-prov-991',
      status: 'claimed',
      timestamp: new Date(Date.now() - 10000).toISOString(),
    },
    {
      id: 'lease-002',
      workerId,
      operationId: 'op-prov-991',
      status: 'renewed',
      timestamp: new Date(Date.now() - 5000).toISOString(),
    }
  ];
};
