
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { AlertingOverview } from "@/features/alerting"

export default function AlertingPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Gestión de Alertas" 
        description="Centro de incidentes, resoluciones y telemetría crítica"
        breadcrumb={[{ label: "Alertas" }]}
      />
      <AlertingOverview />
    </div>
  )
}
