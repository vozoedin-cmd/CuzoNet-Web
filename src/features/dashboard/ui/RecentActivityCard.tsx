
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, ShieldAlert, Zap, Box } from "lucide-react"

export function RecentActivityCard() {
  // Placeholders
  const activities = [
    { id: 1, type: "payment", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10", title: "Pago Recibido", desc: "Cliente #1024 - $450.00 MXN", time: "10:45 AM" },
    { id: 2, type: "alert", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10", title: "Alerta Crítica", desc: "Caída de nodo principal Norte", time: "10:30 AM" },
    { id: 3, type: "provisioning", icon: Box, color: "text-blue-500", bg: "bg-blue-500/10", title: "Provisionamiento", desc: "ONU registrada con éxito (MAC: A1:B2)", time: "09:15 AM" },
    { id: 4, type: "suspension", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", title: "Suspensión de Servicio", desc: "Corte automático por morosidad (#882)", time: "08:00 AM" },
  ];

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimos eventos en el NOC</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${item.bg}`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {item.time}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
