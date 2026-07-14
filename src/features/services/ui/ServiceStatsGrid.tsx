
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ServiceStatsDto } from "../api/services.service"
import { ServerCrash, Play, Pause, Activity } from "lucide-react"

export function ServiceStatsGrid({ stats }: { stats?: ServiceStatsDto }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <ServerCrash className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Servicios</p>
            <h3 className="text-2xl font-bold">{stats?.total ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full">
            <Play className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Activos</p>
            <h3 className="text-2xl font-bold">{stats?.active ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full">
            <Pause className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Suspendidos</p>
            <h3 className="text-2xl font-bold">{stats?.suspended ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-full">
            <Activity className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ops Pendientes</p>
            <h3 className="text-2xl font-bold">{stats?.pendingOperations ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
