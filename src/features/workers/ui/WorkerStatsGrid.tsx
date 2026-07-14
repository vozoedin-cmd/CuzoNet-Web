
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { WorkerStatisticsDto } from "../api/workers.service"
import { Activity, AlertTriangle, XCircle, RotateCcw } from "lucide-react"

export function WorkerStatsGrid({ stats }: { stats?: WorkerStatisticsDto }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full relative">
            <Activity className="h-6 w-6 text-green-500" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Activos / Degradados</p>
            <h3 className="text-xl font-bold">{stats?.totalActive ?? '--'} / {stats?.totalDegraded ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-full">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ops Pendientes</p>
            <h3 className="text-xl font-bold">{stats?.pendingOperations ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ops Fallidas / Stopped</p>
            <h3 className="text-xl font-bold text-red-500">{stats?.failedOperations ?? '--'} / {stats?.totalStopped ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <RotateCcw className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Retries</p>
            <h3 className="text-xl font-bold">{stats?.totalRetries ?? '--'}</h3>
            <p className="text-[10px] text-muted-foreground truncate" title={stats?.lastGlobalSuccessAt}>
              Último éxito: {stats?.lastGlobalSuccessAt ? new Date(stats.lastGlobalSuccessAt).toLocaleTimeString() : '--'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
