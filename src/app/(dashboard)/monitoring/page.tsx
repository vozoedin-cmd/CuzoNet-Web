import { PageHeader } from "@/components/layout/PageHeader"

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoreo"
        description="Telemetría y series de tiempo"
        breadcrumb={[{ label: "Monitoreo" }]}
      />
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm h-64 flex items-center justify-center">
        <p className="text-muted-foreground">Placeholder para el módulo Monitoreo</p>
      </div>
    </div>
  )
}