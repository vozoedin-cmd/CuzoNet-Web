
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { NotificationStatsDto } from "../api/notifications.service"
import { Clock, Send, AlertTriangle, AlertCircle } from "lucide-react"

export function NotificationStatsGrid({ stats }: { stats?: NotificationStatsDto }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-full">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
            <h3 className="text-2xl font-bold">{stats?.pending ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full">
            <Send className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Enviadas</p>
            <h3 className="text-2xl font-bold">{stats?.sent ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <AlertTriangle className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Parciales</p>
            <h3 className="text-2xl font-bold">{stats?.partial ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Fallidas</p>
            <h3 className="text-2xl font-bold">{stats?.failed ?? '--'}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
