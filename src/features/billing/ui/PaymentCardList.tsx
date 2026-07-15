import type { PaymentDto } from '../api/billing.service';
import { useBillingStore } from '../model/billing.store';
import { formatMoney, formatPaymentDate } from './BillingFormatting';
import { PaymentMethodBadge, PaymentStatusBadge } from './PaymentBadges';

export function PaymentCardList({
  payments,
}: {
  payments: readonly PaymentDto[];
}) {
  const selectPayment = useBillingStore((state) => state.selectPayment);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {payments.map((payment) => (
        <button
          type="button"
          key={payment.id}
          className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors flex flex-col gap-3 text-left"
          onClick={() => selectPayment(payment.id)}
        >
          <div className="flex items-center justify-between border-b pb-2 w-full">
            <PaymentMethodBadge method={payment.method} />
            <PaymentStatusBadge status={payment.status} />
          </div>
          <div>
            <h4 className="font-mono text-xs text-muted-foreground break-all">
              {payment.id}
            </h4>
            <p className="text-lg font-bold">
              {formatMoney(payment.amountCents, payment.currencyCode)}
            </p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border w-full">
            Cliente: {payment.clientId}
            <br />
            Recibido: {formatPaymentDate(payment.receivedAt)}
            <br />
            Referencia externa: No disponible
          </div>
        </button>
      ))}
    </div>
  );
}
