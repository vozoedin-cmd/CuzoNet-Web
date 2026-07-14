
import * as React from "react"
import { useBillingStore } from "../model/billing.store"
import { usePayment } from "../hooks/useBilling"
import { PaymentStatusBadge, PaymentMethodBadge, formatMoney } from "./BillingFormatting"
import { X, Receipt, Link, ShieldCheck, AlertCircle } from "lucide-react"

export function PaymentDetailsDrawer({ companyId }: { companyId: string }) {
  const { selectedPaymentId, drawerOpen, setDrawerOpen } = useBillingStore();
  const { data, isLoading, isError } = usePayment(companyId, selectedPaymentId);

  if (!drawerOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l bg-background shadow-2xl p-0 flex flex-col animate-in slide-in-from-right-full duration-300">
        
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Recibo de Pago
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading && <div className="p-6 animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-32 bg-muted rounded w-full" />
        </div>}

        {isError && <div className="p-6 text-red-500">Error cargando recibo.</div>}

        {!isLoading && !isError && data && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-3xl font-extrabold mb-1">{formatMoney(data.amountCents, data.currencyCode)}</h3>
              <p className="font-mono text-sm text-muted-foreground mb-4">Ref: {data.reference}</p>
              <div className="flex gap-2 mb-4">
                <PaymentMethodBadge method={data.method} />
                <PaymentStatusBadge status={data.status} />
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border">
                  Cliente: {data.clientId}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              {data.unallocatedAmountCents > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3 text-amber-600">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Dinero sin asignar</h4>
                    <p className="text-xs mt-1">
                      Existen <strong>{formatMoney(data.unallocatedAmountCents, data.currencyCode)}</strong> que entraron a caja pero no se han ligado a ninguna factura. Puedes conciliar manualmente desde el Estado de Cuenta.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-bold text-sm flex items-center gap-2 border-b pb-2"><Link className="w-4 h-4" /> Asignaciones (Facturas Cubiertas)</h4>
                {data.assignments.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No hay facturas ligadas a este pago.</p>
                ) : (
                  <div className="space-y-2">
                    {data.assignments.map(a => (
                      <div key={a.id} className="flex justify-between items-center p-3 border rounded-lg bg-card text-sm">
                        <div>
                          <p className="font-mono text-xs">{a.invoiceId}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(a.assignedAt).toLocaleString()}</p>
                        </div>
                        <p className="font-bold text-green-500">{formatMoney(a.amountCents, data.currencyCode)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-bold text-sm flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Trazabilidad Transaccional</h4>
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20 text-xs">
                  <div>
                    <span className="text-muted-foreground block mb-1">ID Interno</span>
                    <span className="font-mono">{data.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Fecha Registro</span>
                    <span>{new Date(data.createdAt).toLocaleString()}</span>
                  </div>
                  {data.correlationId && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground block mb-1">Correlation ID</span>
                      <span className="font-mono opacity-50">{data.correlationId}</span>
                    </div>
                  )}
                  {data.idempotencyKey && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground block mb-1">Idempotency Key</span>
                      <span className="font-mono opacity-50">{data.idempotencyKey.substring(0, 15)}***</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  )
}
