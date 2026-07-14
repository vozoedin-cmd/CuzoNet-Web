
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { MonitoringOverview } from "@/features/monitoring"

export default function MonitoringPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Monitoreo de Rendimiento" 
        description="Telemetría en tiempo real y estadísticas de infraestructura"
        breadcrumb={[{ label: "Monitoreo" }]}
      />
      <MonitoringOverview />
    </div>
  )
}
