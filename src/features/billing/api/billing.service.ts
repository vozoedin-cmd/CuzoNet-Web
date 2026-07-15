
import { apiClient } from '@/services/api/api-client';

export type PaymentMethod = 'cash' | 'transfer' | 'credit_card' | 'debit_card' | 'oxxo' | 'stripe';
export type PaymentStatus = 'completed' | 'pending' | 'failed';
export type InvoiceStatus = 'open' | 'paid' | 'cancelled';

export interface PaymentAssignmentDto {
  id: string;
  paymentId: string;
  invoiceId: string;
  amountCents: number;
  assignedAt: string;
}

export interface PaymentDto {
  id: string;
  clientId: string;
  reference: string;
  method: PaymentMethod;
  amountCents: number;
  unallocatedAmountCents: number;
  allocatedAmountCents: number;
  currencyCode: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface PaymentDetailsDto extends PaymentDto {
  assignments: PaymentAssignmentDto[];
  correlationId?: string;
  idempotencyKey?: string;
}

export interface InvoiceDto {
  id: string;
  clientId: string;
  amountCents: number;
  balanceCents: number;
  currencyCode: string;
  status: InvoiceStatus;
  dueDate: string;
  issuedAt: string;
}

export interface ClientAccountFinancialsDto {
  clientId: string;
  balanceCents: number;
  debtCents: number;
  creditCents: number;
  currencyCode: string;
  financialStatus: 'up_to_date' | 'in_arrears' | 'suspended';
  openInvoices: InvoiceDto[];
  recentPayments: PaymentDto[];
}

export interface StatementEntryDto {
  id: string;
  type: 'invoice' | 'payment' | 'assignment';
  description: string;
  amountCents: number;
  balanceAfterCents: number;
  currencyCode: string;
  date: string;
  referenceId: string;
}

export interface BillingStatsDto {
  todayRevenueCents: number;
  monthRevenueCents: number;
  pendingBalanceCents: number;
  delinquentClientsCount: number;
  unallocatedPaymentsCount: number;
  collectionRatePercent: number;
}

export interface GetPaymentsParams {
  search?: string;
  clientId?: string;
  method?: string;
  status?: string;
  currencyCode?: string;
  dateFrom?: string;
  dateTo?: string;
}

const isDemo = () => process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

const uuidv4 = () => crypto.randomUUID();

export const billingService = {
  getPayments: async (companyId: string, params: GetPaymentsParams): Promise<{ payments: PaymentDto[], stats: BillingStatsDto }> => {
    if (isDemo()) {
      const { getDemoPayments } = await import('../model/demo-billing.fixture');
      let data = getDemoPayments().payments;
      if (params.clientId) data = data.filter(p => p.clientId === params.clientId);
      if (params.method) data = data.filter(p => p.method === params.method);
      if (params.status) data = data.filter(p => p.status === params.status);
      if (params.search) data = data.filter(p => p.reference.toLowerCase().includes(params.search!.toLowerCase()) || p.clientId.toLowerCase().includes(params.search!.toLowerCase()));
      return { payments: data, stats: getDemoPayments().stats };
    }
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return await apiClient.get<{ payments: PaymentDto[], stats: BillingStatsDto }>(`/pagos?companyId=${companyId}&${query}`);
  },

  getPayment: async (companyId: string, paymentId: string): Promise<PaymentDetailsDto> => {
    if (isDemo()) {
      const { getDemoPaymentDetails } = await import('../model/demo-billing.fixture');
      return getDemoPaymentDetails(paymentId);
    }
    return await apiClient.get<PaymentDetailsDto>(`/pagos/${paymentId}?companyId=${companyId}`);
  },

  getClientAccount: async (companyId: string, clientId: string): Promise<ClientAccountFinancialsDto> => {
    if (isDemo()) {
      const { getDemoClientAccount } = await import('../model/demo-billing.fixture');
      return getDemoClientAccount(clientId);
    }
    return await apiClient.get<ClientAccountFinancialsDto>(`/clientes/${clientId}/cuenta?companyId=${companyId}`);
  },

  getClientStatement: async (companyId: string, clientId: string): Promise<StatementEntryDto[]> => {
    if (isDemo()) {
      const { getDemoClientStatement } = await import('../model/demo-billing.fixture');
      return getDemoClientStatement(clientId);
    }
    return await apiClient.get<StatementEntryDto[]>(`/clientes/${clientId}/estado-cuenta?companyId=${companyId}`);
  },

  registerPayment: async (companyId: string, data: Partial<PaymentDto>): Promise<PaymentDto> => {
    if (isDemo()) return { ...data, id: 'pay-' + uuidv4(), unallocatedAmountCents: data.amountCents || 0, allocatedAmountCents: 0, status: 'completed', createdAt: new Date().toISOString() } as PaymentDto;
    const idempotencyKey = crypto.randomUUID();
    return await apiClient.post<PaymentDto>(`/pagos?companyId=${companyId}`, data, { idempotencyKey });
  }
};
