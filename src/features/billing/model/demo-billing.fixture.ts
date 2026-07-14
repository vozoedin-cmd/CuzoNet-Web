
import { PaymentDto, PaymentDetailsDto, BillingStatsDto, ClientAccountFinancialsDto, StatementEntryDto } from '../api/billing.service';

export const getDemoPayments = (): { payments: PaymentDto[], stats: BillingStatsDto } => {
  const payments: PaymentDto[] = [
    {
      id: 'pay-001',
      clientId: 'cli-001',
      reference: 'TRX-987654321',
      method: 'transfer',
      amountCents: 49900,
      allocatedAmountCents: 49900,
      unallocatedAmountCents: 0,
      currencyCode: 'MXN',
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'pay-002',
      clientId: 'cli-002',
      reference: 'OXXO-123456789',
      method: 'oxxo',
      amountCents: 29900,
      allocatedAmountCents: 0,
      unallocatedAmountCents: 29900,
      currencyCode: 'MXN',
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'pay-003',
      clientId: 'cli-003',
      reference: 'CASH-001',
      method: 'cash',
      amountCents: 100000,
      allocatedAmountCents: 50000,
      unallocatedAmountCents: 50000,
      currencyCode: 'MXN',
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  const stats: BillingStatsDto = {
    todayRevenueCents: 100000,
    monthRevenueCents: 1545000,
    pendingBalanceCents: 350000,
    delinquentClientsCount: 42,
    unallocatedPaymentsCount: 5,
    collectionRatePercent: 85.5
  };

  return { payments, stats };
};

export const getDemoPaymentDetails = (id: string): PaymentDetailsDto => {
  const base = getDemoPayments().payments.find(p => p.id === id) || getDemoPayments().payments[0];
  return {
    ...base,
    correlationId: 'corr-demo-999',
    idempotencyKey: 'idemp-demo-888',
    assignments: base.allocatedAmountCents > 0 ? [
      {
        id: 'asn-001',
        paymentId: base.id,
        invoiceId: 'inv-001',
        amountCents: base.allocatedAmountCents,
        assignedAt: base.createdAt
      }
    ] : []
  };
};

export const getDemoClientAccount = (clientId: string): ClientAccountFinancialsDto => {
  return {
    clientId,
    balanceCents: 49900,
    debtCents: 49900,
    creditCents: 0,
    currencyCode: 'MXN',
    financialStatus: 'in_arrears',
    openInvoices: [
      {
        id: 'inv-001',
        clientId,
        amountCents: 49900,
        balanceCents: 49900,
        currencyCode: 'MXN',
        status: 'open',
        dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        issuedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      }
    ],
    recentPayments: getDemoPayments().payments.filter(p => p.clientId === clientId)
  };
};

export const getDemoClientStatement = (clientId: string): StatementEntryDto[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = clientId;
  return [
    {
      id: 'st-001',
      type: 'invoice',
      description: 'Factura F-001 generada',
      amountCents: 49900,
      balanceAfterCents: 49900,
      currencyCode: 'MXN',
      date: new Date(Date.now() - 86400000 * 15).toISOString(),
      referenceId: 'inv-001'
    }
  ];
};
