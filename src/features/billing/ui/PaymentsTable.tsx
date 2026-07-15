import type { PaymentDto } from '../api/billing.service';
import { useBillingStore } from '../model/billing.store';
import { formatMoney, formatPaymentDate } from './BillingFormatting';
import { PaymentMethodBadge, PaymentStatusBadge } from './PaymentBadges';

export function PaymentsTable({
  payments,
}: {
  payments: readonly PaymentDto[];
}) {
  const selectPayment = useBillingStore((state) => state.selectPayment);

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Pago / Cliente</th>
            <th className="px-4 py-3 font-medium">Método</th>
            <th className="px-4 py-3 font-medium">Monto</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Recibido</th>
            <th className="px-4 py-3 font-medium">Referencia externa</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectPayment(payment.id)}
            >
              <td className="px-4 py-3">
                <p className="font-mono text-xs font-bold">{payment.id}</p>
                <p className="text-xs text-muted-foreground">
                  {payment.clientId}
                </p>
              </td>
              <td className="px-4 py-3">
                <PaymentMethodBadge method={payment.method} />
              </td>
              <td className="px-4 py-3 font-bold">
                {formatMoney(payment.amountCents, payment.currencyCode)}
              </td>
              <td className="px-4 py-3">
                <PaymentStatusBadge status={payment.status} />
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {formatPaymentDate(payment.receivedAt)}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                No disponible
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
