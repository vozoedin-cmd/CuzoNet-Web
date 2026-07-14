
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { WorkersOverview } from "@/features/workers"

export default function WorkersPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Gestor de Nodos e Infraestructura"
        description="Monitorización de workers asíncronos y colas distribuidas"
        breadcrumb={[{ label: "Workers" }]}
      />
      <WorkersOverview />
    </div>
  )
}
