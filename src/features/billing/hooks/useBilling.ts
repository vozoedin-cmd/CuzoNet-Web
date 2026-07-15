import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import type { ApiError } from '@/services/api/api-client';

import {
  billingService,
  type BillingMutationOptions,
  type ClientAccountDto,
  type CreatePaymentRequest,
  type GetPaymentsParams,
  type PaymentDto,
  type PaymentPageDto,
} from '../api/billing.service';

export const billingKeys = {
  all: ['billing'] as const,
  paymentLists: () => [...billingKeys.all, 'payments'] as const,
  payments: (params: GetPaymentsParams) =>
    [...billingKeys.paymentLists(), params] as const,
  accounts: () => [...billingKeys.all, 'accounts'] as const,
  account: (clientId: string) => [...billingKeys.accounts(), clientId] as const,
};

export function getRegisterPaymentInvalidationKeys(clientId: string) {
  return [billingKeys.paymentLists(), billingKeys.account(clientId)] as const;
}

export function usePayments(params: GetPaymentsParams) {
  return useQuery<PaymentPageDto, ApiError>({
    queryKey: billingKeys.payments(params),
    queryFn: ({ signal }) => billingService.getPayments(params, signal),
    placeholderData: keepPreviousData,
    refetchInterval: 30_000,
  });
}

export function useClientAccount(clientId: string | null) {
  return useQuery<ClientAccountDto, ApiError>({
    queryKey: billingKeys.account(clientId ?? ''),
    queryFn: ({ signal }) =>
      billingService.getClientAccount(clientId ?? '', signal),
    enabled: clientId !== null && clientId.length > 0,
  });
}

interface RegisterPaymentVariables {
  data: CreatePaymentRequest;
  options?: BillingMutationOptions;
}

export function useRegisterPayment() {
  const queryClient = useQueryClient();

  return useMutation<PaymentDto, ApiError, RegisterPaymentVariables>({
    mutationFn: ({ data, options }) =>
      billingService.registerPayment(data, options),
    onSuccess: (payment) => {
      const [paymentsKey, accountKey] =
        getRegisterPaymentInvalidationKeys(payment.clientId);
      void queryClient.invalidateQueries({ queryKey: paymentsKey });
      void queryClient.invalidateQueries({ queryKey: accountKey });
    },
  });
}
