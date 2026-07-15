import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/services/api/api-client';

import {
  plansService,
  type CreatePlanRequest,
  type PlanDto,
  type PlanMutationOptions,
  type RevisePlanRequest,
} from '../api/plans.service';

export const planKeys = {
  all: ['plans'] as const,
  list: () => [...planKeys.all, 'list'] as const,
};

export function usePlans() {
  return useQuery<PlanDto[], ApiError>({
    queryKey: planKeys.list(),
    queryFn: ({ signal }) => plansService.getPlans(signal),
    refetchInterval: 30_000,
  });
}

interface CreatePlanVariables {
  data: CreatePlanRequest;
  options?: PlanMutationOptions;
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation<PlanDto, ApiError, CreatePlanVariables>({
    mutationFn: ({ data, options }) => plansService.createPlan(data, options),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: planKeys.list() });
    },
  });
}

interface RevisePlanVariables {
  data: RevisePlanRequest;
  options?: PlanMutationOptions;
  planId: string;
}

export function useRevisePlan() {
  const queryClient = useQueryClient();

  return useMutation<PlanDto, ApiError, RevisePlanVariables>({
    mutationFn: ({ data, options, planId }) =>
      plansService.revisePlan(planId, data, options),
    onSuccess: (revisedPlan) => {
      queryClient.setQueryData<PlanDto[]>(planKeys.list(), (plans) =>
        plans?.map((plan) =>
          plan.id === revisedPlan.id ? revisedPlan : plan,
        ),
      );
      void queryClient.invalidateQueries({ queryKey: planKeys.list() });
    },
  });
}
