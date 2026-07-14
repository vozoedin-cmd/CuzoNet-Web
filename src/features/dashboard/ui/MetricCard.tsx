
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { type LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string;
  value?: string | number;
  icon: LucideIcon;
  description?: string;
  isLoading?: boolean;
}

export function MetricCard({ title, value, icon: Icon, description, isLoading }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-1/2 mt-1" />
        ) : (
          <div className="text-2xl font-bold">{value !== undefined ? value : '--'}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
