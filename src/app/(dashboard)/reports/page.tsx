
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { AnalyticsOverview } from "@/features/analytics"

export default function ReportsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Business Intelligence y Reportes"
        description="Métricas ejecutivas, tendencias de red e ingresos"
        breadcrumb={[{ label: "Analytics" }]}
      />
      <AnalyticsOverview />
    </div>
  )
}
