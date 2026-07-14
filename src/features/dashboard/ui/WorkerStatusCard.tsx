
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HardHat, ServerCog, PlayCircle, PauseCircle, AlertTriangle } from "lucide-react"

export function WorkerStatusCard() {
  // Placeholders explícitamente tipados para UI hasta que exista API
  const metrics = {
    activeWorkers: 12,
    stoppedWorkers: 0,
    pendingJobs: 45,
    failedJobs: 2
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardHat className="h-5 w-5 text-primary" />
          Automatización
        </CardTitle>
        <CardDescription>Estado de trabajos en 2do plano</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2 text-sm">
              <PlayCircle className="h-4 w-4 text-green-500" />
              <span>Workers Activos</span>
            </div>
            <span className="font-bold">{metrics.activeWorkers}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PauseCircle className="h-4 w-4" />
              <span>Detenidos</span>
            </div>
            <span className="font-medium text-muted-foreground">{metrics.stoppedWorkers}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2 text-sm">
              <ServerCog className="h-4 w-4 text-blue-500" />
              <span>Ops. Pendientes</span>
            </div>
            <span className="font-bold">{metrics.pendingJobs}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Ops. Fallidas</span>
            </div>
            <span className="font-bold text-red-500">{metrics.failedJobs}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
