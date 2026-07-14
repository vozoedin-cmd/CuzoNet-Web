
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"

export function DashboardHeader() {
  return (
    <PageHeader 
      title="Dashboard" 
      description="Vista general del estado de la red y operaciones"
      breadcrumb={[{ label: "Dashboard" }]}
    />
  )
}
