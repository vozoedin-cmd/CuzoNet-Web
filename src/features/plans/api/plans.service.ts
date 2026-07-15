import {
  apiClient,
  type ApiRequestOptions,
} from '@/services/api/api-client';

export type PlanServiceType = 'simple_queue' | 'pppoe' | 'hotspot';

export interface PlanVersionDto {
  downloadKbps: number;
  id: string;
  priceCents: number;
  uploadKbps: number;
  version: number;
}

export interface PlanDto {
  code: string;
  currentVersion: PlanVersionDto;
  id: string;
  isActive: boolean;
  name: string;
  serviceType: PlanServiceType;
}

export interface CreatePlanRequest {
  code: string;
  downloadKbps: number;
  name: string;
  priceCents: number;
  serviceType: PlanServiceType;
  uploadKbps: number;
}

export interface RevisePlanRequest {
  downloadKbps: number;
  effectiveFrom: string;
  isActive?: boolean;
  priceCents: number;
  uploadKbps: number;
}

export type PlanMutationOptions = Pick<
  ApiRequestOptions,
  'correlationId' | 'idempotencyKey' | 'signal'
>;

function mutationOptions(options: PlanMutationOptions = {}): ApiRequestOptions {
  return {
    ...options,
    idempotencyKey: options.idempotencyKey ?? crypto.randomUUID(),
  };
}

export const plansService = {
  getPlans(signal?: AbortSignal): Promise<PlanDto[]> {
    return apiClient.get<PlanDto[]>('/planes', { signal });
  },

  createPlan(
    data: CreatePlanRequest,
    options?: PlanMutationOptions,
  ): Promise<PlanDto> {
    return apiClient.post<PlanDto, CreatePlanRequest>(
      '/planes',
      data,
      mutationOptions(options),
    );
  },

  revisePlan(
    planId: string,
    data: RevisePlanRequest,
    options?: PlanMutationOptions,
  ): Promise<PlanDto> {
    return apiClient.put<PlanDto, RevisePlanRequest>(
      '/planes/' + planId,
      data,
      mutationOptions(options),
    );
  },
};
