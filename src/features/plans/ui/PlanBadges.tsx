
import * as React from "react"
import { PlanStatus, PlanVersionStatus, CompatibleServiceType } from "../api/plans.service"
import { Play, Pause, Route, Network, Wifi, FileEdit, CheckCircle2, Archive } from "lucide-react"

export function PlanStatusBadge({ status }: { status: PlanStatus }) {
  const cfg = {
    active: { icon: Play, label: 'Activo', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    inactive: { icon: Pause, label: 'Inactivo', color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' },
  };
  const { icon: Icon, label, color } = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${color}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  )
}

export function PlanVersionStatusBadge({ status }: { status: PlanVersionStatus }) {
  const cfg = {
    draft: { icon: FileEdit, label: 'Draft', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    published: { icon: CheckCircle2, label: 'Publicado', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    archived: { icon: Archive, label: 'Archivado', color: 'bg-zinc-800/10 text-zinc-400 border-zinc-800/20' },
  };
  const { icon: Icon, label, color } = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${color}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  )
}

export function ServiceTypeBadge({ type }: { type: CompatibleServiceType }) {
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
