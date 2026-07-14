
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function WorkerStatusCard() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Estado Workers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[90%]" />
        </div>
      </CardContent>
    </Card>
  )
}
