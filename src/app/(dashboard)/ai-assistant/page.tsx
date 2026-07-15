import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { AiAssistantOverview } from "@/features/ai-assistant"

export default function AiAssistantPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="AI Assistant"
        description="Asistente operativo de red y facturación"
        breadcrumb={[{ label: "AI Assistant" }]}
      />
      <AiAssistantOverview />
    </div>
  )
}