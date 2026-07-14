
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, MemoryStick, HardDrive, Thermometer, Zap } from "lucide-react"

interface MetricCardProps {
  type: 'cpu' | 'ram' | 'disk' | 'temp' | 'voltage';
  value: number;
}

export function MetricCard({ type, value }: MetricCardProps) {
  const configs = {
    cpu: { title: "CPU", icon: Cpu, unit: "%", max: 100 },
    ram: { title: "RAM", icon: MemoryStick, unit: "%", max: 100 },
    disk: { title: "Disco", icon: HardDrive, unit: "%", max: 100 },
    temp: { title: "Temp", icon: Thermometer, unit: "°C", max: 90 },
    voltage: { title: "Voltaje", icon: Zap, unit: "V", max: 24 },
  };

  const config = configs[type];
  const Icon = config.icon;
  const percentage = Math.min((value / config.max) * 100, 100);

  let colorClass = "bg-green-500";
  if (percentage > 70) colorClass = "bg-amber-500";
  if (percentage > 90) colorClass = "bg-red-500";

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{config.title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}{config.unit}</div>
        <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 ${colorClass}`} style={{ width: `${percentage}%` }} />
        </div>
      </CardContent>
    </Card>
  )
}
