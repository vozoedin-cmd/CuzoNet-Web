import {
  Banknote,
  Building,
  CheckCircle2,
  CreditCard,
  RotateCcw,
  Smartphone,
} from 'lucide-react';

import type {
  PaymentMethod,
  PaymentStatus,
} from '../api/billing.service';

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const config = {
    recorded: {
      color: 'bg-green-500/10 text-green-600 border-green-500/20',
      icon: CheckCircle2,
      label: 'Registrado',
    },
    reversed: {
      color: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
      icon: RotateCcw,
      label: 'Revertido',
    },
  };
  const { color, icon: Icon, label } = config[status];

  return (
    <span
      className={
        'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ' +
        color
      }
    >
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const config = {
    cash: { icon: Banknote, label: 'Efectivo' },
    transfer: { icon: Building, label: 'Transferencia' },
    card: { icon: CreditCard, label: 'Tarjeta' },
    online: { icon: Smartphone, label: 'En línea' },
    other: { icon: Banknote, label: 'Otro' },
  };
  const { icon: Icon, label } = config[method];

  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] uppercase font-medium bg-muted text-muted-foreground">
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}
