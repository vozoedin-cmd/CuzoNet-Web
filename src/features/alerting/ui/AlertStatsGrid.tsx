
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertStatsDto } from "../api/alerting.service"
import { AlertOctagon, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react"

export function AlertStatsGrid({ stats }: { stats?: AlertStatsDto }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full">
            <AlertOctagon className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Abiertas</p>
            <h3 className="text-2xl font-bold">{stats?.open ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-rose-600/10 rounded-full animate-pulse">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Críticas</p>
            <h3 className="text-2xl font-bold">{stats?.critical ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reconocidas</p>
            <h3 className="text-2xl font-bold">{stats?.acknowledged ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Resueltas Hoy</p>
            <h3 className="text-2xl font-bold">{stats?.resolvedToday ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
