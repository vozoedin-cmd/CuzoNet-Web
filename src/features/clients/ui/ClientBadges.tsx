import { Building2, User } from 'lucide-react';

import type { ClientStatus, ClientType } from '../api/clients.service';

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const styles: Record<ClientStatus, string> = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    archived: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  };
  const labels: Record<ClientStatus, string> = {
    active: 'Activo',
    archived: 'Archivado',
  };

  return (
    <span
      className={
        'px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ' +
        styles[status]
      }
    >
      {labels[status]}
    </span>
  );
}

export function ClientTypeBadge({ type }: { type: ClientType }) {
  const Icon = type === 'company' ? Building2 : User;
  const label = type === 'company' ? 'Empresa' : 'Persona';

  return (
    <div
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] uppercase font-medium bg-muted text-muted-foreground"
      title={label}
    >
      <Icon className="h-3 w-3" /> {label}
    </div>
  );
}
