
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { PlanStatsDto } from "../api/plans.service"
import { Package, Play, Pause, Route } from "lucide-react"

export function PlanStatsGrid({ stats }: { stats?: PlanStatsDto }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Planes</p>
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
          <div className="p-3 bg-zinc-500/10 rounded-full">
            <Pause className="h-6 w-6 text-zinc-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Inactivos</p>
            <h3 className="text-2xl font-bold">{stats?.inactive ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-full">
            <Route className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Draft / Pendientes</p>
            <h3 className="text-2xl font-bold">{stats?.draftVersions ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
