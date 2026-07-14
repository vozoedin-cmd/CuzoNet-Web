
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ClientStatsDto } from "../api/clients.service"
import { Users, UserCheck, UserMinus, FileWarning } from "lucide-react"

export function ClientStatsGrid({ stats }: { stats?: ClientStatsDto }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
            <h3 className="text-2xl font-bold">{stats?.total ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full">
            <UserCheck className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Activos</p>
            <h3 className="text-2xl font-bold">{stats?.active ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Con Servicios</p>
            <h3 className="text-2xl font-bold">{stats?.withServices ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full">
            <FileWarning className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Morosos</p>
            <h3 className="text-2xl font-bold">{stats?.delinquent ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
