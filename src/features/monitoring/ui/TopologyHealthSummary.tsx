
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopologyHealthDto } from "../api/monitoring.service"
import { ShieldCheck, AlertTriangle, ServerCrash, Activity } from "lucide-react"

export function TopologyHealthSummary({ health }: { health: TopologyHealthDto }) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Salud de Topología</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-green-500" /> Activos</span>
            <p className="text-2xl font-bold">{health.activeEquipments}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-amber-500" /> Degradados</span>
            <p className="text-2xl font-bold">{health.degradedEquipments}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><ServerCrash className="h-3 w-3 text-red-500" /> Offline</span>
            <p className="text-2xl font-bold">{health.offlineEquipments}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3 text-primary" /> Disponibilidad</span>
            <p className="text-2xl font-bold">{health.globalAvailability}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
