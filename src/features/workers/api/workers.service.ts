
// import { apiClient } from '@/services/api/api-client'; // Reserved for future use

export type WorkerRole = 'outbox' | 'automation' | 'provisioning' | 'notifications';
export type WorkerHealthStatus = 'healthy' | 'degraded' | 'stopped' | 'unknown';
export type OperationStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled' | 'manual_review';

export interface WorkerHealthDto {
  workerId: string;
  role: WorkerRole;
  status: WorkerHealthStatus;
  heartbeat: string;
  processedCount: number;
  failedCount: number;
  retryCount: number;
  lastSuccessAt?: string;
  lastFailureAt?: string;
}

export interface WorkerStatisticsDto {
  totalActive: number;
  totalDegraded: number;
  totalStopped: number;
  pendingOperations: number;
  failedOperations: number;
  totalRetries: number;
  lastGlobalSuccessAt?: string;
}

export interface PendingOperationDto {
  operationId: string;
  type: string;
  serviceId?: string;
  status: OperationStatus;
  attemptCount: number;
  maxAttempts: number;
  claimedBy?: string;
  leaseUntil?: string;
  createdAt: string;
}

export interface FailedOperationDto {
  operationId: string;
  errorCode: string;
  lastError: string; // Will be sanitized in UI
  attempts: number;
  status: OperationStatus;
  updatedAt: string;
  manualReview: boolean;
}

export interface ActiveLeaseDto {
  id: string;
  workerId: string;
  operationId: string;
  status: 'claimed' | 'renewed' | 'expired' | 'completed' | 'recovered';
  timestamp: string;
}

export interface GetWorkersParams {
  role?: string;
  status?: string;
  workerId?: string;
}

const isDemo = () => process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

export const workersService = {
  getWorkersHealth: async (companyId: string, params: GetWorkersParams): Promise<WorkerHealthDto[]> => {
    if (isDemo()) {
      const { getDemoWorkersHealth } = await import('../model/demo-workers.fixture');
      let data = getDemoWorkersHealth();
      if (params.role) data = data.filter(w => w.role === params.role);
      if (params.status) data = data.filter(w => w.status === params.status);
      const wId = params.workerId;
      if (wId) data = data.filter(w => w.workerId.includes(wId));
      return data;
    }
    return []; // Endpoint GET /workers/health no existe
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWorkerStatistics: async (companyId: string): Promise<WorkerStatisticsDto | null> => {
    if (isDemo()) {
      const { getDemoWorkerStatistics } = await import('../model/demo-workers.fixture');
      return getDemoWorkerStatistics();
    }
    return null; // Endpoint GET /workers/estadisticas no existe
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPendingOperations: async (companyId: string): Promise<PendingOperationDto[]> => {
    if (isDemo()) {
      const { getDemoPendingOperations } = await import('../model/demo-workers.fixture');
      return getDemoPendingOperations();
    }
    return []; // Endpoint GET /operaciones/pendientes no existe
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFailedOperations: async (companyId: string): Promise<FailedOperationDto[]> => {
    if (isDemo()) {
      const { getDemoFailedOperations } = await import('../model/demo-workers.fixture');
      return getDemoFailedOperations();
    }
    return []; // Endpoint GET /operaciones/fallidas no existe
  },

  getActiveLeases: async (companyId: string, workerId: string): Promise<ActiveLeaseDto[]> => {
    if (isDemo()) {
      const { getDemoActiveLeases } = await import('../model/demo-workers.fixture');
      return getDemoActiveLeases(workerId);
    }
    return []; // Endpoint GET /workers/:workerId/leases no existe
  }
};
