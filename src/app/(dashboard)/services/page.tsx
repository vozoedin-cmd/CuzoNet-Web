
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { ServicesOverview } from "@/features/services"

export default function ServicesPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Gestión de Servicios"
        description="Contratos, suscripciones y aprovisionamiento técnico"
        breadcrumb={[{ label: "Servicios" }]}
      />
      <ServicesOverview />
    </div>
  )
}
