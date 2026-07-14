
import * as React from "react"
import { PaymentDto } from "../api/billing.service"
import { PaymentStatusBadge, PaymentMethodBadge, formatMoney } from "./BillingFormatting"
import { useBillingStore } from "../model/billing.store"

export function PaymentCardList({ payments }: { payments: PaymentDto[] }) {
  const { selectPayment } = useBillingStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {payments.map(p => (
        <div 
          key={p.id} 
          className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors flex flex-col gap-3"
          onClick={() => selectPayment(p.id)}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <PaymentMethodBadge method={p.method} />
            <PaymentStatusBadge status={p.status} />
          </div>
          <div>
            <h4 className="font-mono text-xs text-muted-foreground">Ref: {p.reference}</h4>
            <p className="text-lg font-bold">{formatMoney(p.amountCents, p.currencyCode)}</p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border flex flex-col gap-1">
            <div className="flex justify-between">
              <span>Cliente:</span>
              <span className="font-mono text-foreground">{p.clientId}</span>
            </div>
            <div className="flex justify-between">
              <span>Asignado:</span>
              <span>{formatMoney(p.allocatedAmountCents, p.currencyCode)}</span>
            </div>
            {p.unallocatedAmountCents > 0 && (
              <div className="flex justify-between text-amber-500 font-bold bg-amber-500/10 px-1 rounded">
                <span>Sin asignar:</span>
                <span>{formatMoney(p.unallocatedAmountCents, p.currencyCode)}</span>
              </div>
            )}
          </div>
        </div>
      ))}
      {payments.length === 0 && (
        <div className="col-span-1 sm:grid-cols-2 lg:col-span-3 text-center py-8 text-muted-foreground border rounded-xl border-dashed">
          No hay pagos financieros
        </div>
      )}
    </div>
  )
}
