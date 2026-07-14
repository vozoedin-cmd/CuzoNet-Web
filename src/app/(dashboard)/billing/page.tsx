
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { BillingOverview } from "@/features/billing"

export default function BillingPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Facturación y Cobranza"
        description="Gestión financiera, pagos y estados de cuenta"
        breadcrumb={[{ label: "Billing" }]}
      />
      <BillingOverview />
    </div>
  )
}
