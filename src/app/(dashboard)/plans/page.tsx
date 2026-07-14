
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { PlansOverview } from "@/features/plans"

export default function PlansPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Catálogo de Planes Comerciales"
        description="Gestión de identidades, versiones y perfiles técnicos de red"
        breadcrumb={[{ label: "Planes" }]}
      />
      <PlansOverview />
    </div>
  )
}
