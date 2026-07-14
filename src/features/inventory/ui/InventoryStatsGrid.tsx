
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { InventoryStatsDto } from "../api/inventory.service"
import { Server, ShieldCheck, AlertTriangle, UserCheck } from "lucide-react"

export function InventoryStatsGrid({ stats }: { stats?: InventoryStatsDto }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Server className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Equipos</p>
            <h3 className="text-2xl font-bold">{stats?.total ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full">
            <ShieldCheck className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Activos NOC</p>
            <h3 className="text-2xl font-bold">{stats?.active ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-full">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Disponibles/Stock</p>
            <h3 className="text-2xl font-bold">{stats?.available ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <UserCheck className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Asignados (CPE)</p>
            <h3 className="text-2xl font-bold">{stats?.assigned ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
