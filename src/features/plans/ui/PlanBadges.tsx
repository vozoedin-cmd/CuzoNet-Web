import { Network, Pause, Play, Route, Wifi } from 'lucide-react';

import type { PlanServiceType } from '../api/plans.service';

export function PlanActivityBadge({ isActive }: { isActive: boolean }) {
  const Icon = isActive ? Play : Pause;

  return (
    <span
      className={
        'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ' +
        (isActive
          ? 'bg-green-500/10 text-green-600 border-green-500/20'
          : 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20')
      }
    >
      <Icon className="h-3 w-3" /> {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
}

export function ServiceTypeBadge({ type }: { type: PlanServiceType }) {
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
