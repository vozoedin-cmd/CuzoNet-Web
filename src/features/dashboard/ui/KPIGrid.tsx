import {
  BellRing,
  HandCoins,
  ServerCrash,
  Users,
  Wifi,
} from 'lucide-react';

import type { DashboardOverviewDto } from '../api/dashboard.service';
import { DashboardBlockError, DashboardBlockMeta, DashboardBlockSkeleton } from './DashboardStates';
import { formatMinorUnits } from './DashboardFormatting';
import { MetricCard } from './MetricCard';

interface KPIGridProps {
  data?: DashboardOverviewDto;
  error: Error | null;
  isFetching: boolean;
  isLoading: boolean;
  updatedAt: number;
}

export function KPIGrid({
  data,
  error,
  isFetching,
  isLoading,
  updatedAt,
}: KPIGridProps) {
  if (isLoading) return <DashboardBlockSkeleton cards={5} />;
  if (error !== null) {
    return <DashboardBlockError error={error} title="No se pudo cargar el resumen operativo" />;
  }
  if (data === undefined) return null;

  const hasNoData =
    data.totalActiveClients === 0 &&
    data.totalActiveServices === 0 &&
    data.monthlyExpectedRevenueCents === 0 &&
    data.activeCriticalAlerts === 0 &&
    data.downNetworkNodes === 0;

  return (
    <section className="space-y-3" aria-labelledby="dashboard-overview-title">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold" id="dashboard-overview-title">
            Resumen operativo
          </h2>
          {hasNoData ? (
            <p className="text-sm text-muted-foreground">No hay registros para resumir.</p>
          ) : null}
        </div>
        <DashboardBlockMeta isFetching={isFetching} updatedAt={updatedAt} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard icon={Users} title="Clientes activos" value={data.totalActiveClients} />
        <MetricCard icon={Wifi} title="Servicios activos" value={data.totalActiveServices} />
        <MetricCard
          description="Moneda: No disponible"
          icon={HandCoins}
          title="Ingreso mensual esperado"
          value={formatMinorUnits(data.monthlyExpectedRevenueCents)}
        />
        <MetricCard
          icon={BellRing}
          title="Alertas críticas activas"
          value={data.activeCriticalAlerts}
        />
        <MetricCard
          icon={ServerCrash}
          title="Nodos de red caídos"
          value={data.downNetworkNodes}
        />
      </div>
    </section>
  );
}
