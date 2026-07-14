
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansService, GetPlansParams, PlanDto, PlanVersionDto, PlanStatus } from '../api/plans.service';

export function usePlans(companyId: string, params: GetPlansParams) {
  return useQuery({
    queryKey: ['plans', companyId, params],
    queryFn: () => plansService.getPlans(companyId, params),
  });
}

export function usePlan(companyId: string, planId: string | null) {
  return useQuery({
    queryKey: ['plan', 'detail', companyId, planId],
    queryFn: () => plansService.getPlan(companyId, planId!),
    enabled: !!planId,
  });
}

export function usePlanVersion(companyId: string, planId: string | null, versionId: string | null) {
  return useQuery({
    queryKey: ['plan', 'version', companyId, planId, versionId],
    queryFn: () => plansService.getPlanVersion(companyId, planId!, versionId!),
    enabled: !!planId && !!versionId,
  });
}

export function usePlanMutations(companyId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['plans'] });
  const invalidateDetail = (id: string) => queryClient.invalidateQueries({ queryKey: ['plan', 'detail', companyId, id] });

  const createPlan = useMutation({
    mutationFn: (data: Partial<PlanDto>) => plansService.createPlan(companyId, data),
    onSuccess: invalidate,
  });

  const createPlanVersion = useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: Partial<PlanVersionDto> }) => plansService.createPlanVersion(companyId, planId, data),
    onSuccess: (_, v) => { invalidate(); invalidateDetail(v.planId); },
  });

  const publishPlanVersion = useMutation({
    mutationFn: ({ planId, versionId }: { planId: string; versionId: string }) => plansService.publishPlanVersion(companyId, planId, versionId),
    onSuccess: (_, v) => { invalidate(); invalidateDetail(v.planId); },
  });

  const changePlanStatus = useMutation({
    mutationFn: ({ planId, status }: { planId: string; status: PlanStatus }) => plansService.changePlanStatus(companyId, planId, status),
    onSuccess: (_, v) => { invalidate(); invalidateDetail(v.planId); },
  });

  return { createPlan, createPlanVersion, publishPlanVersion, changePlanStatus };
}
