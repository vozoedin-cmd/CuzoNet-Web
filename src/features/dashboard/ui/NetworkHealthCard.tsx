import { Activity, AlertTriangle, Gauge, ServerCrash } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { NetworkHealthDto } from '../api/dashboard.service';
import { DashboardBlockError, DashboardBlockMeta, DashboardBlockSkeleton } from './DashboardStates';
import { formatPercentage } from './DashboardFormatting';
import { MetricCard } from './MetricCard';

interface NetworkHealthCardProps {
  data?: NetworkHealthDto;
  error: Error | null;
  isFetching: boolean;
  isLoading: boolean;
  updatedAt: number;
}

export function NetworkHealthCard({
  data,
  error,
  isFetching,
  isLoading,
  updatedAt,
}: NetworkHealthCardProps) {
  if (isLoading) return <DashboardBlockSkeleton cards={3} />;
  if (error !== null) {
    return <DashboardBlockError error={error} title="No se pudo cargar la salud de red" />;
  }
  if (data === undefined) return null;

  const hasNoData =
    data.totalEquipments === 0 &&
    data.equipmentsDown === 0 &&
    data.equipmentsWarning === 0 &&
    data.criticalLinks.length === 0;

  return (
    <Card>
      <CardHeader className="gap-3">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Salud de red
          </CardTitle>
          <CardDescription>
            Equipamiento monitoreado y enlaces críticos disponibles.
          </CardDescription>
        </div>
        <DashboardBlockMeta isFetching={isFetching} updatedAt={updatedAt} />
      </CardHeader>
      <CardContent className="space-y-4">
        {hasNoData ? (
          <p className="text-sm text-muted-foreground">Sin datos técnicos disponibles.</p>
        ) : null}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={Gauge}
            title="Equipos monitoreados"
            value={data.totalEquipments}
          />
          <MetricCard
            icon={ServerCrash}
            title="Equipos caídos"
            value={data.equipmentsDown}
          />
          <MetricCard
            icon={AlertTriangle}
            title="Equipos con advertencia"
            value={data.equipmentsWarning}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Enlaces críticos</h3>
          {data.criticalLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay utilización de enlaces críticos disponible.
            </p>
          ) : (
            <ul className="divide-y rounded-md border">
              {data.criticalLinks.map((link) => (
                <li className="flex items-center justify-between gap-4 p-3 text-sm" key={link.id}>
                  <span className="font-medium">{link.name}</span>
                  <span>{formatPercentage(link.usagePercentage)}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
