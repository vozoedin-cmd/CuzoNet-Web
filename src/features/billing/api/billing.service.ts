import {
  apiClient,
  type ApiRequestOptions,
} from '@/services/api/api-client';

export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'online' | 'other';
export type PaymentStatus = 'recorded' | 'reversed';

export interface PaymentAllocationDto {
  amountCents: number;
  invoiceId: string;
}

export interface PaymentDto {
  allocations: readonly PaymentAllocationDto[];
  amountCents: number;
  clientId: string;
  currencyCode: string;
  id: string;
  method: PaymentMethod;
  receivedAt: string;
  status: PaymentStatus;
}

export interface PaymentPageDto {
  data: readonly PaymentDto[];
  page: number;
  pageSize: number;
  total: number;
}

export interface GetPaymentsParams {
  clientId?: string;
  from?: string;
  page: number;
  pageSize: number;
  to?: string;
}

export interface CreatePaymentRequest {
  allocations?: readonly PaymentAllocationDto[];
  amountCents: number;
  clientId: string;
  currencyCode: string;
  externalReference?: string;
  method: PaymentMethod;
  receivedAt: string;
}

export interface ClientAccountDto {
  clientId: string;
  creditCents: number;
  currencyCode: string;
  debtCents: number;
  invoiceCount: number;
  nextDueOn: string | null;
  overdueCents: number;
}

export type BillingMutationOptions = Pick<
  ApiRequestOptions,
  'correlationId' | 'idempotencyKey' | 'signal'
>;

function buildPaymentsQuery(params: GetPaymentsParams): string {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  if (params.clientId !== undefined) query.set('clientId', params.clientId);
  if (params.from !== undefined) query.set('from', params.from);
  if (params.to !== undefined) query.set('to', params.to);

  return '?' + query.toString();
}

function mutationOptions(options: BillingMutationOptions = {}): ApiRequestOptions {
  return {
    ...options,
    idempotencyKey: options.idempotencyKey ?? crypto.randomUUID(),
  };
}

export const billingService = {
  getPayments(
    params: GetPaymentsParams,
    signal?: AbortSignal,
  ): Promise<PaymentPageDto> {
    return apiClient.get<PaymentPageDto>(
      '/pagos' + buildPaymentsQuery(params),
      { signal },
    );
  },

  registerPayment(
    data: CreatePaymentRequest,
    options?: BillingMutationOptions,
  ): Promise<PaymentDto> {
    return apiClient.post<PaymentDto, CreatePaymentRequest>(
      '/pagos',
      data,
      mutationOptions(options),
    );
  },

  getClientAccount(
    clientId: string,
    signal?: AbortSignal,
  ): Promise<ClientAccountDto> {
    return apiClient.get<ClientAccountDto>(
      '/clientes/' + clientId + '/cuenta',
      { signal },
    );
  },
};
