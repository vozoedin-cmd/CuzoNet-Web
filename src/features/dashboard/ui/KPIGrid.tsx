
import * as React from "react"
import { MetricCard } from "./MetricCard"
import { Users, Server, DollarSign, Bell, HardHat, Activity, BarChart3, Inbox } from "lucide-react"
import type { DashboardOverviewDto } from "../api/dashboard.service"

interface KPIGridProps {
  data?: DashboardOverviewDto;
  isLoading: boolean;
}

export function KPIGrid({ data, isLoading }: KPIGridProps) {
  const formatCurrency = (cents: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard 
        title="Total Clientes" 
        value={data?.totalActiveClients} 
        icon={Users} 
        isLoading={isLoading} 
      />
      <MetricCard 
        title="Servicios Activos" 
        value={data?.totalActiveServices} 
        icon={Server} 
        isLoading={isLoading} 
      />
      <MetricCard 
        title="Facturación del Mes" 
        value={data ? formatCurrency(data.monthlyExpectedRevenueCents) : undefined} 
        icon={DollarSign} 
        isLoading={isLoading} 
      />
      <MetricCard 
        title="Alertas Críticas" 
        value={data?.activeCriticalAlerts} 
        icon={Bell} 
        isLoading={isLoading} 
      />
      {/* UI placeholdes for metrics not in BFF yet */}
      <MetricCard 
        title="Estado Workers" 
        value="100%" 
        icon={HardHat} 
        isLoading={isLoading} 
        description="Todos en línea"
      />
      <MetricCard 
        title="Disponibilidad" 
        value="99.9%" 
        icon={Activity} 
        isLoading={isLoading} 
      />
      <MetricCard 
        title="Tráfico Total" 
        value="1.2 Tbps" 
        icon={BarChart3} 
        isLoading={isLoading} 
      />
      <MetricCard 
        title="Notificaciones Pendientes" 
        value="0" 
        icon={Inbox} 
        isLoading={isLoading} 
      />
    </div>
  )
}
