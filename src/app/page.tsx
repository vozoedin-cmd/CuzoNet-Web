
"use client"

import * as React from "react"
import { AlertCircle } from "lucide-react"
import { 
  DashboardHeader, 
  KPIGrid, 
  QuickActions, 
  RecentActivityCard, 
  WorkerStatusCard, 
  useDashboardOverview 
} from "@/features/dashboard"

export default function DashboardPage() {
  // Mock companyId for now
  const companyId = "mock-company";
  const { data, isLoading, isError, error } = useDashboardOverview(companyId);

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      {isError ? (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 flex items-center gap-3 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Error cargando el dashboard: {error instanceof Error ? error.message : "Error desconocido"}</p>
        </div>
      ) : null}

      {!isLoading && !isError && !data ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          <p>No hay datos disponibles en este momento.</p>
        </div>
      ) : null}

      <KPIGrid data={data} isLoading={isLoading} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RecentActivityCard />
        <WorkerStatusCard />
        <QuickActions />
      </div>
    </div>
  )
}
