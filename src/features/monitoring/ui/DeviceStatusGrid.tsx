
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeviceStatus } from "../api/monitoring.service"
import { Server, Wifi, Network } from "lucide-react"

export function DeviceStatusGrid({ devices }: { devices: DeviceStatus[] }) {
  const getIcon = (type: string) => {
    if (type === 'router') return <Network className="h-4 w-4" />;
    if (type === 'switch') return <Server className="h-4 w-4" />;
    if (type === 'ap') return <Wifi className="h-4 w-4" />;
    return <Server className="h-4 w-4" />;
  };

  const getColor = (status: string) => {
    if (status === 'online') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (status === 'warning') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    if (status === 'offline') return 'bg-red-500/10 text-red-500 border-red-500/20';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Dispositivos Clave</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devices.map(device => (
            <div key={device.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${getColor(device.status)}`}>
                  {getIcon(device.type)}
                </div>
                <div>
                  <p className="text-sm font-medium">{device.name}</p>
                  <p className="text-xs text-muted-foreground">Uptime: {device.uptime}</p>
                </div>
              </div>
              <div className={`h-2 w-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : device.status === 'warning' ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
