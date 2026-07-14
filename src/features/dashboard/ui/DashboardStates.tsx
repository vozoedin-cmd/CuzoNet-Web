
import * as React from "react"
import { AlertCircle, InboxIcon } from "lucide-react"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-muted rounded animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-[120px] bg-muted rounded-xl animate-pulse" />)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-1 md:col-span-2 h-[200px] bg-muted rounded-xl animate-pulse" />
        <div className="col-span-1 md:col-span-2 h-[200px] bg-muted rounded-xl animate-pulse" />
      </div>
    </div>
  )
}

export function DashboardErrorState({ error }: { error: Error }) {
  return (
    <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 flex flex-col items-center justify-center text-center text-destructive h-[400px]">
      <AlertCircle className="h-10 w-10 mb-4" />
      <h3 className="text-lg font-bold mb-1">Error de Conexión</h3>
      <p className="text-sm opacity-90 max-w-md">
        No se pudo cargar el centro de operaciones. {error.message}
      </p>
    </div>
  )
}

export function DashboardEmptyState() {
  return (
    <div className="rounded-xl border p-12 flex flex-col items-center justify-center text-center text-muted-foreground h-[400px] bg-card/50">
      <InboxIcon className="h-12 w-12 mb-4 opacity-20" />
      <h3 className="text-lg font-medium mb-1">Centro de Operaciones Vacío</h3>
      <p className="text-sm max-w-sm mx-auto">
        No hay datos disponibles en la red para mostrar en este momento. Registra tu primer cliente o enruta tu primer nodo.
      </p>
    </div>
  )
}
