
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bell, AlertOctagon, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react"
import { DashboardOverviewDto } from "../api/dashboard.service"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface AlertsSummaryCardProps {
  overview?: DashboardOverviewDto;
  isLoading: boolean;
}

export function AlertsSummaryCard({ overview, isLoading }: AlertsSummaryCardProps) {
  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-xl" />

  const critical = overview?.activeCriticalAlerts || 0;
  // Placeholders para datos aún no provistos por backend
  const warning = 12;
  const acknowledged = 3;
  const recentAlerts = [
    { id: 1, type: "CRITICAL", title: "Enlace troncal caído", time: "Hace 2 min" },
    { id: 2, type: "WARNING", title: "Latencia alta en BGP-1", time: "Hace 15 min" },
    { id: 3, type: "CRITICAL", title: "Saturación OLT Centro", time: "Hace 24 min" },
  ];

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Centro de Alertas
          </CardTitle>
          <CardDescription>Eventos activos en la infraestructura</CardDescription>
        </div>
        <Link href="/alerting" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Ver todas <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="flex flex-col items-center justify-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <AlertOctagon className="h-5 w-5 text-red-500 mb-1" />
            <span className="text-xl font-bold text-red-500">{critical}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Críticas</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <AlertTriangle className="h-5 w-5 text-amber-500 mb-1" />
            <span className="text-xl font-bold text-amber-500">{warning}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Warning</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <ShieldCheck className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-xl font-bold text-blue-500">{acknowledged}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Ack</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase">Últimas alertas</h4>
          {recentAlerts.map(alert => (
            <div key={alert.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${alert.type === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <span className="text-sm font-medium">{alert.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{alert.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
