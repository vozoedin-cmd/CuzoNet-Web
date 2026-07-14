
import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useBillingStore } from "../model/billing.store"
import { useBillingMutations } from "../hooks/useBilling"

function SimpleDialog({ open, onClose, title, children }: { open: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border shadow-xl rounded-xl w-full max-w-xl p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">X</button>
      </div>
    </div>
  )
}

const inputClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

const paymentSchema = z.object({
  clientId: z.string().min(2, "Requerido"),
  amountCents: z.number().min(1, "Debe ser mayor a 0 (en centavos)"),
  currencyCode: z.string().length(3),
  method: z.enum(['cash', 'transfer', 'credit_card', 'debit_card', 'oxxo', 'stripe']),
  reference: z.string().min(2, "Requerencia obligatoria para trazabilidad")
})

export function RegisterPaymentDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal, filters } = useBillingStore();
  const { registerPayment } = useBillingMutations(companyId);
  
  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { currencyCode: 'MXN', method: 'transfer', clientId: filters.clientId || '' }
  });

  const amountCents = useWatch({ control, name: "amountCents" });

  const onSubmit = (data: z.infer<typeof paymentSchema>) => {
    if (confirm(`¿Confirmas el registro del pago por ${data.amountCents / 100} ${data.currencyCode}?`)) {
      registerPayment.mutate(data, { onSuccess: () => setActiveModal('none') });
    }
  }

  return (
    <SimpleDialog open={activeModal === 'register_payment'} onClose={() => setActiveModal('none')} title="Registrar Ingreso (Pago Manual)">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md text-xs text-blue-500 mb-4">
          El dinero entrará a la cuenta del cliente. El backend calculará automáticamente la distribución si no especificas facturas. <strong>No uses decimales (usa centavos).</strong>
        </div>
        <div>
          <label className="text-xs font-medium">Client ID</label>
          <input {...register("clientId")} className={inputClass} placeholder="Ej. cli-123" />
          {errors.clientId && <p className="text-[10px] text-red-500 mt-1">{errors.clientId.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Monto Total (Centavos)</label>
            <input type="number" {...register("amountCents", { valueAsNumber: true })} className={inputClass} placeholder="Ej. 50000 = $500.00" />
            {errors.amountCents && <p className="text-[10px] text-red-500 mt-1">{errors.amountCents.message}</p>}
            {amountCents > 0 && <p className="text-[10px] text-green-500 mt-1 font-bold">Conversión visual: $\{(amountCents / 100).toFixed(2)}</p>}
          </div>
          <div>
            <label className="text-xs font-medium">Moneda</label>
            <input {...register("currencyCode")} className={inputClass} placeholder="MXN" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Método</label>
            <select {...register("method")} className={inputClass}>
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia / SPEI</option>
              <option value="credit_card">Tarjeta Crédito</option>
              <option value="debit_card">Tarjeta Débito</option>
              <option value="oxxo">OXXO Pay</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Referencia / Folio / TxID</label>
            <input {...register("reference")} className={inputClass} placeholder="Obligatorio" />
            {errors.reference && <p className="text-[10px] text-red-500 mt-1">{errors.reference.message}</p>}
          </div>
        </div>
        
        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button type="submit" disabled={!isValid} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50">Registrar Pago Seguro</button>
        </div>
      </form>
    </SimpleDialog>
  )
}
