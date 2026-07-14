
import * as React from "react"
import { ServiceLifecycleStatus, ServiceType } from "../api/services.service"
import { Activity, Play, Pause, XCircle, Archive, Network, Route, Wifi } from "lucide-react"

export function ServiceLifecycleStatusBadge({ status }: { status: ServiceLifecycleStatus }) {
  const cfg = {
    pending: { icon: Activity, label: 'Pendiente', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    active: { icon: Play, label: 'Activo', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    suspended: { icon: Pause, label: 'Suspendido', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
    cancelled: { icon: XCircle, label: 'Cancelado', color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' },
    archived: { icon: Archive, label: 'Archivado', color: 'bg-zinc-800/10 text-zinc-400 border-zinc-800/20' },
  };
  const { icon: Icon, label, color } = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${color}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  )
}

export function ServiceTypeBadge({ type }: { type: ServiceType }) {
  const cfg = {
    simple_queue: { icon: Route, label: 'Simple Queue' },
    pppoe: { icon: Network, label: 'PPPoE' },
    hotspot: { icon: Wifi, label: 'Hotspot' },
  };
  const { icon: Icon, label } = cfg[type];
  return (
    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] uppercase font-medium bg-muted text-muted-foreground" title={label}>
      <Icon className="h-3 w-3" /> {label}
    </div>
  )
}
