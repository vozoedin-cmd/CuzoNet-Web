
import { apiClient } from '@/services/api/api-client';

export type PlanStatus = 'active' | 'inactive';
export type PlanVersionStatus = 'draft' | 'published' | 'archived';
export type CompatibleServiceType = 'simple_queue' | 'pppoe' | 'hotspot';

export interface PlanVersionDto {
  id: string;
  planId: string;
  versionNumber: number;
  status: PlanVersionStatus;
  priceCents: number;
  currencyCode: string;
  uploadKbps: number;
  downloadKbps: number;
  burstUploadKbps?: number;
  burstDownloadKbps?: number;
  priority?: number;
  validFrom: string;
  validUntil?: string;
  createdAt: string;
  publishedAt?: string;
}

export interface PlanDto {
  id: string;
  code: string;
  name: string;
  compatibleServiceType: CompatibleServiceType;
  status: PlanStatus;
  currentVersionId?: string;
  currentVersion?: PlanVersionDto;
  versionsCount: number;
  updatedAt: string;
}

export interface PlanDetailsDto extends PlanDto {
  versions: PlanVersionDto[];
}

export interface PlanStatsDto {
  total: number;
  active: number;
  inactive: number;
  draftVersions: number;
  publishedVersions: number;
  simpleQueueCount: number;
}

export interface GetPlansParams {
  search?: string;
  status?: string;
  compatibleServiceType?: string;
  currencyCode?: string;
}

const isDemo = () => process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

const uuidv4 = () => crypto.randomUUID();

export const plansService = {
  getPlans: async (companyId: string, params: GetPlansParams): Promise<{ plans: PlanDto[], stats: PlanStatsDto }> => {
    if (isDemo()) {
      const { getDemoPlans } = await import('../model/demo-plans.fixture');
      let data = getDemoPlans().plans;
      if (params.search) data = data.filter(p => p.name.toLowerCase().includes(params.search!.toLowerCase()) || p.code.toLowerCase().includes(params.search!.toLowerCase()));
      if (params.status) data = data.filter(p => p.status === params.status);
      if (params.compatibleServiceType) data = data.filter(p => p.compatibleServiceType === params.compatibleServiceType);
      if (params.currencyCode && params.currencyCode !== 'ALL') data = data.filter(p => p.currentVersion?.currencyCode === params.currencyCode);
      return { plans: data, stats: getDemoPlans().stats };
    }
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return await apiClient.get<{ plans: PlanDto[], stats: PlanStatsDto }>(`/planes?companyId=${companyId}&${query}`);
  },

  getPlan: async (companyId: string, planId: string): Promise<PlanDetailsDto> => {
    if (isDemo()) {
      const { getDemoPlanDetails } = await import('../model/demo-plans.fixture');
      return getDemoPlanDetails(planId);
    }
    return await apiClient.get<PlanDetailsDto>(`/planes/${planId}?companyId=${companyId}`);
  },

  getPlanVersion: async (companyId: string, planId: string, versionId: string): Promise<PlanVersionDto> => {
    if (isDemo()) {
      const { getDemoPlanDetails } = await import('../model/demo-plans.fixture');
      const plan = getDemoPlanDetails(planId);
      return plan.versions.find(v => v.id === versionId) || plan.versions[0];
    }
    return await apiClient.get<PlanVersionDto>(`/planes/${planId}/versiones/${versionId}?companyId=${companyId}`);
  },

  createPlan: async (companyId: string, data: Partial<PlanDto>): Promise<PlanDto> => {
    if (isDemo()) return { ...data, id: 'plan-' + uuidv4(), status: 'inactive', versionsCount: 0 } as PlanDto;
    const idempotencyKey = crypto.randomUUID();
    return await apiClient.post<PlanDto>(`/planes?companyId=${companyId}`, data, { idempotencyKey });
  },

  createPlanVersion: async (companyId: string, planId: string, data: Partial<PlanVersionDto>): Promise<PlanVersionDto> => {
    if (isDemo()) return { ...data, id: 'pv-' + uuidv4(), planId, status: 'draft', versionNumber: 99, createdAt: new Date().toISOString() } as PlanVersionDto;
    const idempotencyKey = crypto.randomUUID();
    return await apiClient.post<PlanVersionDto>(`/planes/${planId}/versiones?companyId=${companyId}`, data, { idempotencyKey });
  },

  publishPlanVersion: async (companyId: string, planId: string, versionId: string): Promise<PlanVersionDto> => {
    if (isDemo()) return { id: versionId, planId, status: 'published', publishedAt: new Date().toISOString() } as PlanVersionDto;
    const idempotencyKey = crypto.randomUUID();
    return await apiClient.post<PlanVersionDto>(`/planes/${planId}/versiones/${versionId}/publicacion?companyId=${companyId}`, {}, { idempotencyKey });
  },

  changePlanStatus: async (companyId: string, planId: string, status: PlanStatus): Promise<PlanDto> => {
    if (isDemo()) return { id: planId, status } as PlanDto;
    const idempotencyKey = crypto.randomUUID();
    return await apiClient.put<PlanDto>(`/planes/${planId}/estado?companyId=${companyId}`, { status }, { idempotencyKey });
  }
};
