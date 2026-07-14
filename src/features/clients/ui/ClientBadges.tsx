
import * as React from "react"
import { ClientStatus, ClientType } from "../api/clients.service"
import { Building2, User } from "lucide-react"

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const cfg = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    archived: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    delinquent: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  const labels = {
    active: 'Activo',
    archived: 'Archivado',
    delinquent: 'Moroso'
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${cfg[status]}`}>
      {labels[status]}
    </span>
  )
}

export function ClientTypeBadge({ type }: { type: ClientType }) {
  const Icon = type === 'company' ? Building2 : User;
  const label = type === 'company' ? 'Empresa' : 'Persona';
  return (
    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] uppercase font-medium bg-muted text-muted-foreground" title={label}>
      <Icon className="h-3 w-3" /> {label}
    </div>
  )
}
