
import * as React from "react"
import { AlertCircle, Map as MapIcon } from "lucide-react"

export function NetworkMapSkeleton() {
  return (
    <div className="w-full h-full min-h-[500px] rounded-xl bg-muted animate-pulse flex items-center justify-center border">
      <MapIcon className="h-10 w-10 text-muted-foreground/50" />
    </div>
  )
}

export function NetworkMapError({ error }: { error: Error }) {
  return (
    <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 flex flex-col items-center justify-center text-center text-destructive h-full min-h-[500px]">
      <AlertCircle className="h-10 w-10 mb-4" />
      <h3 className="text-lg font-bold mb-1">Error cargando topología</h3>
      <p className="text-sm opacity-90 max-w-md">
        {error.message}
      </p>
    </div>
  )
}

export function NetworkMapEmpty() {
  return (
    <div className="rounded-xl border p-12 flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[500px] bg-card/50">
      <MapIcon className="h-12 w-12 mb-4 opacity-20" />
      <h3 className="text-lg font-medium mb-1">Sin Topología Registrada</h3>
      <p className="text-sm max-w-sm mx-auto">
        No se detectaron nodos o enlaces activos. Provisiona los equipos en Inventario para visualizar la red.
      </p>
    </div>
  )
}
