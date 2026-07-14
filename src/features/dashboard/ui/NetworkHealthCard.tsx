
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, ServerCrash, AlertTriangle, CheckCircle2 } from "lucide-react"
import { NetworkHealthDto } from "../api/dashboard.service"
import { Skeleton } from "@/components/ui/skeleton"

interface NetworkHealthCardProps {
  data?: NetworkHealthDto;
  isLoading: boolean;
}

export function NetworkHealthCard({ data, isLoading }: NetworkHealthCardProps) {
  if (isLoading) return <Skeleton className="h-[200px] w-full rounded-xl" />
  if (!data) return null;

  const total = data.totalEquipments || 1;
  const down = data.equipmentsDown;
  const warning = data.equipmentsWarning;
  const active = total - down - warning;
  const availability = (((total - down) / total) * 100).toFixed(2);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Salud de la Red
        </CardTitle>
        <CardDescription>Disponibilidad global y estado de equipos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Disponibilidad (SLA)</p>
              <h2 className="text-3xl font-bold tracking-tight">{availability}%</h2>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{active}</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>{warning}</span>
              </div>
              <div className="flex items-center gap-1">
                <ServerCrash className="h-4 w-4 text-red-500" />
                <span>{down}</span>
              </div>
            </div>
          </div>
          <div className="h-2 w-full flex overflow-hidden rounded-full bg-muted">
            <div className="bg-green-500 transition-all duration-500" style={{ width: `${(active / total) * 100}%` }} />
            <div className="bg-amber-500 transition-all duration-500" style={{ width: `${(warning / total) * 100}%` }} />
            <div className="bg-red-500 transition-all duration-500" style={{ width: `${(down / total) * 100}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">
            {total} equipos monitoreados en total.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
