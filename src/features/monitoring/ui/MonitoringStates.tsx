
import * as React from "react"
import { AlertCircle, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function MonitoringSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Skeleton className="col-span-1 lg:col-span-2 h-[400px] rounded-xl" />
        <Skeleton className="col-span-1 lg:col-span-2 h-[400px] rounded-xl" />
      </div>
    </div>
  )
}

export function MonitoringError({ error }: { error: Error }) {
  return (
    <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 flex flex-col items-center justify-center text-center text-destructive h-[400px]">
      <AlertCircle className="h-10 w-10 mb-4" />
      <h3 className="text-lg font-bold mb-1">Falla de Monitoreo</h3>
      <p className="text-sm opacity-90 max-w-md">
        No se pudieron obtener las telemetrías. {error.message}
      </p>
    </div>
  )
}

export function MonitoringEmpty() {
  return (
    <div className="rounded-xl border p-12 flex flex-col items-center justify-center text-center text-muted-foreground h-[400px] bg-card/50">
      <Activity className="h-12 w-12 mb-4 opacity-20" />
      <h3 className="text-lg font-medium mb-1">Sin Métricas</h3>
      <p className="text-sm max-w-sm mx-auto">
        No hay datos de rendimiento registrados para los últimos 60 minutos.
      </p>
    </div>
  )
}
