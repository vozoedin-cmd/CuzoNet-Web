import {
  Activity,
  Archive,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Network,
  Pause,
  Play,
  Route,
  Wifi,
  XCircle,
} from 'lucide-react';

import type {
  OperationStatus,
  ServiceLifecycleStatus,
  ServiceType,
} from '../api/services.service';

export function ServiceLifecycleStatusBadge({
  status,
}: {
  status: ServiceLifecycleStatus;
}) {
  const config = {
    pending: {
      icon: Activity,
      label: 'Pendiente',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    active: {
      icon: Play,
      label: 'Activo',
      color: 'bg-green-500/10 text-green-600 border-green-500/20',
    },
    suspended: {
      icon: Pause,
      label: 'Suspendido',
      color: 'bg-red-500/10 text-red-600 border-red-500/20',
    },
    cancelled: {
      icon: XCircle,
      label: 'Cancelado',
      color: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20',
    },
    archived: {
      icon: Archive,
      label: 'Archivado',
      color: 'bg-zinc-800/10 text-zinc-500 border-zinc-800/20',
    },
  };
  const { icon: Icon, label, color } = config[status];

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

export function ServiceTypeBadge({ type }: { type: ServiceType }) {
  const config = {
    simple_queue: { icon: Route, label: 'Simple Queue' },
    pppoe: { icon: Network, label: 'PPPoE' },
    hotspot: { icon: Wifi, label: 'Hotspot' },
  };
  const { icon: Icon, label } = config[type];

  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] uppercase font-medium bg-muted text-muted-foreground">
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

export function OperationStatusBadge({ status }: { status: OperationStatus }) {
  const config = {
    queued: { icon: Activity, label: 'En cola' },
    running: { icon: Activity, label: 'En ejecución' },
    succeeded: { icon: CheckCircle2, label: 'Exitosa' },
    failed: { icon: CircleAlert, label: 'Fallida' },
    cancelled: { icon: CircleX, label: 'Cancelada' },
    manual_review: { icon: CircleAlert, label: 'Revisión manual' },
  };
  const { icon: Icon, label } = config[status];

  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase">
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}
