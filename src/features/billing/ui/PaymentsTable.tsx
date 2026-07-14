
import * as React from "react"
import { PaymentDto } from "../api/billing.service"
import { PaymentStatusBadge, PaymentMethodBadge, formatMoney } from "./BillingFormatting"
import { useBillingStore } from "../model/billing.store"
import { AlertCircle } from "lucide-react"

export function PaymentsTable({ payments }: { payments: PaymentDto[] }) {
  const { selectPayment } = useBillingStore();
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Referencia / Cliente</th>
            <th className="px-4 py-3 font-medium">Método</th>
            <th className="px-4 py-3 font-medium">Monto Total</th>
            <th className="px-4 py-3 font-medium">Asignado</th>
            <th className="px-4 py-3 font-medium">Sin Asignar</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {payments.map(p => (
            <tr 
              key={p.id} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectPayment(p.id)}
            >
              <td className="px-4 py-3">
                <p className="font-mono text-xs font-bold">{p.reference}</p>
                <p className="text-xs text-muted-foreground">{p.clientId}</p>
              </td>
              <td className="px-4 py-3">
                <PaymentMethodBadge method={p.method} />
              </td>
              <td className="px-4 py-3 font-bold">
                {formatMoney(p.amountCents, p.currencyCode)}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {formatMoney(p.allocatedAmountCents, p.currencyCode)}
              </td>
              <td className="px-4 py-3 text-xs">
                {p.unallocatedAmountCents > 0 ? (
                  <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-1 rounded w-max">
                    <AlertCircle className="w-3 h-3" />
                    {formatMoney(p.unallocatedAmountCents, p.currencyCode)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{formatMoney(0, p.currencyCode)}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <PaymentStatusBadge status={p.status} />
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(p.createdAt)}</td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                No se encontraron pagos financieros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
