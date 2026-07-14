
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService, GetPaymentsParams, PaymentDto } from '../api/billing.service';

export function usePayments(companyId: string, params: GetPaymentsParams) {
  return useQuery({
    queryKey: ['payments', companyId, params],
    queryFn: () => billingService.getPayments(companyId, params),
  });
}

export function usePayment(companyId: string, paymentId: string | null) {
  return useQuery({
    queryKey: ['payment', 'detail', companyId, paymentId],
    queryFn: () => billingService.getPayment(companyId, paymentId!),
    enabled: !!paymentId,
  });
}

export function useClientAccount(companyId: string, clientId: string | null) {
  return useQuery({
    queryKey: ['billing', 'account', companyId, clientId],
    queryFn: () => billingService.getClientAccount(companyId, clientId!),
    enabled: !!clientId,
  });
}

export function useClientStatement(companyId: string, clientId: string | null) {
  return useQuery({
    queryKey: ['billing', 'statement', companyId, clientId],
    queryFn: () => billingService.getClientStatement(companyId, clientId!),
    enabled: !!clientId,
  });
}

export function useBillingMutations(companyId: string) {
  const queryClient = useQueryClient();
  
  const registerPayment = useMutation({
    mutationFn: (data: Partial<PaymentDto>) => billingService.registerPayment(companyId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      if (variables.clientId) {
        queryClient.invalidateQueries({ queryKey: ['billing', 'account', companyId, variables.clientId] });
        queryClient.invalidateQueries({ queryKey: ['billing', 'statement', companyId, variables.clientId] });
      }
    },
  });

  return { registerPayment };
}
