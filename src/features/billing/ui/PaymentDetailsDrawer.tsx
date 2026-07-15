import { Receipt, X } from 'lucide-react';

import type { PaymentDto } from '../api/billing.service';
import { useBillingStore } from '../model/billing.store';
import { formatMoney, formatPaymentDate } from './BillingFormatting';
import { PaymentMethodBadge, PaymentStatusBadge } from './PaymentBadges';

export function PaymentDetailsDrawer({
  payment,
}: {
  payment: PaymentDto | undefined;
}) {
  const drawerOpen = useBillingStore((state) => state.drawerOpen);
  const setDrawerOpen = useBillingStore((state) => state.setDrawerOpen);

  if (!drawerOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar resumen del pago"
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
      />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l bg-background shadow-2xl flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Resumen del pago
          </h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-2 hover:bg-muted rounded-full"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {payment === undefined ? (
          <div className="p-6 text-sm text-muted-foreground">
            El pago seleccionado ya no está disponible en la página actual.
          </div>
        ) : (
          <div className="p-6 flex-1 overflow-y-auto space-y-5">
            <div>
              <h3 className="text-3xl font-extrabold mb-2">
                {formatMoney(payment.amountCents, payment.currencyCode)}
              </h3>
              <div className="flex gap-2 flex-wrap">
                <PaymentMethodBadge method={payment.method} />
                <PaymentStatusBadge status={payment.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20 text-sm">
              <SummaryField label="Payment ID" value={payment.id} mono />
              <SummaryField label="Client ID" value={payment.clientId} mono />
              <SummaryField label="Moneda" value={payment.currencyCode} />
              <SummaryField
                label="Fecha recibida"
                value={formatPaymentDate(payment.receivedAt)}
              />
              <SummaryField
                label="Referencia externa"
                value="No disponible"
              />
              <SummaryField
                label="Correlation ID"
                value="No disponible"
              />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function SummaryField({
  label,
  mono = false,
  value,
}: {
  label: string;
  mono?: boolean;
  value: string;
}) {
  return (
    <div>
      <span className="text-muted-foreground text-xs block">{label}</span>
      <span className={mono ? 'font-mono break-all' : ''}>{value}</span>
    </div>
  );
}
