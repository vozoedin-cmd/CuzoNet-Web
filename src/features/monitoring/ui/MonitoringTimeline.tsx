
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MonitoringEvent } from "../api/monitoring.service"
import { Info, AlertTriangle, AlertOctagon } from "lucide-react"

export function MonitoringTimeline({ events }: { events: MonitoringEvent[] }) {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Timeline de Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((evt) => (
            <div key={evt.id} className="flex items-start gap-3">
              <div className="mt-0.5">
                {evt.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                {evt.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                {evt.type === 'error' && <AlertOctagon className="h-4 w-4 text-red-500" />}
              </div>
              <div>
                <p className="text-sm font-medium leading-tight">{evt.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{evt.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
