
import * as React from "react"
import { DashboardOverviewDto, BillingSummaryDto } from "../api/analytics.service"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, Activity, AlertTriangle, Briefcase } from "lucide-react"

interface Props {
  overview?: DashboardOverviewDto;
  billing?: BillingSummaryDto;
}

export function ExecutiveKPIGrid({ overview, billing }: Props) {
  const fmtMoney = (cents?: number) => cents != null ? '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '--';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded font-bold uppercase">Ingresos</span>
          </div>
          <h3 className="text-xl font-bold mt-1">{fmtMoney(billing?.collectedThisMonthCents)}</h3>
          <p className="text-[10px] text-muted-foreground">Mes actual</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase">Morosidad</span>
          </div>
          <h3 className="text-xl font-bold">{fmtMoney(billing?.overdueThisMonthCents)}</h3>
          <p className="text-[10px] text-muted-foreground">{billing?.unpaidInvoicesCount ?? '--'} facturas vencidas</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-bold uppercase">Clientes</span>
          </div>
          <h3 className="text-xl font-bold">{overview?.totalActiveClients ?? '--'}</h3>
          <p className="text-[10px] text-muted-foreground">Activos totales</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Briefcase className="h-4 w-4 text-indigo-500" />
            <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded font-bold uppercase">Servicios</span>
          </div>
          <h3 className="text-xl font-bold">{overview?.totalActiveServices ?? '--'}</h3>
          <p className="text-[10px] text-muted-foreground">Activos totales</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Activity className="h-4 w-4 text-red-500" />
            <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase">Red Caída</span>
          </div>
          <h3 className="text-xl font-bold">{overview?.downNetworkNodes ?? '--'}</h3>
          <p className="text-[10px] text-muted-foreground">Nodos offline</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase">Alertas</span>
          </div>
          <h3 className="text-xl font-bold">{overview?.activeCriticalAlerts ?? '--'}</h3>
          <p className="text-[10px] text-muted-foreground">Críticas activas</p>
        </CardContent>
      </Card>
    </div>
  )
}
