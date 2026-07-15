import { Network, Package, Pause, Play } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import type { PlanDto } from '../api/plans.service';

export function PlanStatsGrid({ plans }: { plans: readonly PlanDto[] }) {
  const stats = [
    {
      color: 'text-primary bg-primary/10',
      icon: Package,
      label: 'Total',
      value: plans.length,
    },
    {
      color: 'text-green-600 bg-green-500/10',
      icon: Play,
      label: 'Activos',
      value: plans.filter((plan) => plan.isActive).length,
    },
    {
      color: 'text-zinc-600 bg-zinc-500/10',
      icon: Pause,
      label: 'Inactivos',
      value: plans.filter((plan) => !plan.isActive).length,
    },
    {
      color: 'text-blue-600 bg-blue-500/10',
      icon: Network,
      label: 'Simple Queue',
      value: plans.filter((plan) => plan.serviceType === 'simple_queue').length,
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
