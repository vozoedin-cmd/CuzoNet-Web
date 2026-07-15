import { Archive, Pause, Play, ServerCrash } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import type { ServiceDto } from '../api/services.service';

export function ServiceStatsGrid({
  services,
}: {
  services: readonly ServiceDto[];
}) {
  const stats = [
    {
      icon: ServerCrash,
      label: 'Total',
      value: services.length,
      color: 'text-primary bg-primary/10',
    },
    {
      icon: Play,
      label: 'Activos',
      value: services.filter((item) => item.lifecycleStatus === 'active').length,
      color: 'text-green-600 bg-green-500/10',
    },
    {
      icon: Pause,
      label: 'Suspendidos',
      value: services.filter((item) => item.lifecycleStatus === 'suspended').length,
      color: 'text-red-600 bg-red-500/10',
    },
    {
      icon: Archive,
      label: 'Pendientes',
      value: services.filter((item) => item.lifecycleStatus === 'pending').length,
      color: 'text-amber-600 bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <span className={'rounded-full p-2 ' + stat.color}>
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">
                  {stat.label}
                </span>
                <span className="text-xl font-bold">{stat.value}</span>
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
