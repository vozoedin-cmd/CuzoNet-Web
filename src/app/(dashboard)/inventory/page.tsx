
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { InventoryOverview } from "@/features/inventory"

export default function InventoryPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Inventario de Infraestructura" 
        description="Gestión física y lógica de Core, Distribución y CPEs"
        breadcrumb={[{ label: "Inventario" }]}
      />
      <InventoryOverview />
    </div>
  )
}
