
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { ClientsOverview } from "@/features/clients"

export default function ClientsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Gestión de Clientes" 
        description="Administración de padrón, contactos y estado de cuenta"
        breadcrumb={[{ label: "Clientes" }]}
      />
      <ClientsOverview />
    </div>
  )
}
