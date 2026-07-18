import { AlertTriangle, CreditCard, FileWarning, Percent } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { BillingSummaryDto } from '../api/dashboard.service';
import { DashboardBlockError, DashboardBlockMeta, DashboardBlockSkeleton } from './DashboardStates';
import { formatMinorUnits, formatPercentage } from './DashboardFormatting';
import { MetricCard } from './MetricCard';

interface BillingSummaryCardProps {
  data?: BillingSummaryDto;
  error: Error | null;
  isFetching: boolean;
  isLoading: boolean;
  updatedAt: number;
}

export function BillingSummaryCard({
  data,
  error,
  isFetching,
  isLoading,
  updatedAt,
}: BillingSummaryCardProps) {
  if (isLoading) return <DashboardBlockSkeleton />;
  if (error !== null) {
    return <DashboardBlockError error={error} title="No se pudo cargar el resumen de cobros" />;
  }
  if (data === undefined) return null;

  const hasNoData =
    data.collectedThisMonthCents === 0 &&
    data.overdueThisMonthCents === 0 &&
    data.unpaidInvoicesCount === 0;

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Resumen de cobros
            </CardTitle>
            <CardDescription>
              Métricas del período expuesto por el backend.
            </CardDescription>
          </div>
          <Link className="text-sm font-medium text-primary hover:underline" href="/billing">
            Abrir pagos
          </Link>
        </div>
        <DashboardBlockMeta isFetching={isFetching} updatedAt={updatedAt} />
      </CardHeader>
      <CardContent className="space-y-3">
        {hasNoData ? (
          <p className="text-sm text-muted-foreground">
            No hay actividad de cobro ni facturas pendientes en el período.
          </p>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            description="Moneda: No disponible"
            icon={CreditCard}
            title="Recaudado este mes"
            value={formatMinorUnits(data.collectedThisMonthCents)}
          />
          <MetricCard
            description="Moneda: No disponible"
            icon={AlertTriangle}
            title="Monto vencido"
            value={formatMinorUnits(data.overdueThisMonthCents)}
          />
          <MetricCard
            icon={FileWarning}
            title="Facturas pendientes"
            value={data.unpaidInvoicesCount}
          />
          <MetricCard
            icon={Percent}
            title="Tasa de cobro"
            value={formatPercentage(data.collectionRatePercentage) + '%'}
          />
        </div>
      </CardContent>
    </Card>
  );
}
