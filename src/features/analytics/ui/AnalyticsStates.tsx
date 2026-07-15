
import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><Skeleton className="h-8 w-48" /><Skeleton className="h-8 w-32" /></div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Skeleton className="h-[300px] w-full rounded-xl" /><Skeleton className="h-[300px] w-full rounded-xl" /></div>
    </div>
  )
}

export function AnalyticsError({ error }: { error: Error }) {
  return (
    <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 flex flex-col items-center justify-center text-center text-destructive h-[400px]">
      <AlertCircle className="h-10 w-10 mb-4" />
      <h3 className="text-lg font-bold mb-1">Módulo Analítico Inalcanzable</h3>
      <p className="text-sm opacity-90 max-w-md">{error.message}</p>
    </div>
  )
}
