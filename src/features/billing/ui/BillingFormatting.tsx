
import * as React from "react"
import { PaymentStatus, PaymentMethod, InvoiceStatus } from "../api/billing.service"
import { CheckCircle2, Clock, XCircle, Banknote, CreditCard, Building, Smartphone, Send } from "lucide-react"

export function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(cents / 100);
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = {
    completed: { icon: CheckCircle2, label: 'Completado', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    pending: { icon: Clock, label: 'Pendiente', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    failed: { icon: XCircle, label: 'Fallido', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  };
  const { icon: Icon, label, color } = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${color}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  )
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = {
    paid: { label: 'Pagada', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    open: { label: 'Abierta', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    cancelled: { label: 'Cancelada', color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' },
  };
  const { label, color } = cfg[status];
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded border uppercase tracking-wider ${color}`}>
      {label}
    </span>
  )
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const cfg = {
    cash: { icon: Banknote, label: 'Efectivo' },
    transfer: { icon: Building, label: 'Transferencia' },
    credit_card: { icon: CreditCard, label: 'T. Crédito' },
    debit_card: { icon: CreditCard, label: 'T. Débito' },
    oxxo: { icon: Smartphone, label: 'OXXO Pay' },
    stripe: { icon: Send, label: 'Stripe' },
  };
  const { icon: Icon, label } = cfg[method] || { icon: Banknote, label: method };
  return (
    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] uppercase font-medium bg-muted text-muted-foreground">
      <Icon className="h-3 w-3" /> {label}
    </div>
  )
}
