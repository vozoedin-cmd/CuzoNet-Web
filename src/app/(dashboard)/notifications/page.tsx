
import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { NotificationsOverview } from "@/features/notifications"

export default function NotificationsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Centro de Notificaciones" 
        description="Seguimiento de envíos (WhatsApp, Telegram, Email, Webhooks)"
        breadcrumb={[{ label: "Notificaciones" }]}
      />
      <NotificationsOverview />
    </div>
  )
}
