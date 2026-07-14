
import * as React from "react"
import { AlertDto } from "../api/alerting.service"
import { AlertSeverityBadge, AlertStatusBadge } from "./AlertBadges"
import { useAlertingStore } from "../model/alerting.store"

export function AlertCardList({ alerts }: { alerts: AlertDto[] }) {
  const { selectAlert } = useAlertingStore();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {alerts.map(alert => (
        <div 
          key={alert.id} 
          className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors space-y-3"
          onClick={() => selectAlert(alert.id)}
        >
          <div className="flex items-center justify-between">
            <AlertSeverityBadge severity={alert.severity} />
            <AlertStatusBadge status={alert.status} />
          </div>
          <div>
            <h4 className="font-bold">{alert.title}</h4>
            <p className="text-xs text-muted-foreground">{alert.category} • {alert.source}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
            <span>{alert.nodeId || alert.equipmentId || 'Sistema'}</span>
            <span>{formatDate(alert.lastOccurredAt)}</span>
          </div>
        </div>
      ))}
      {alerts.length === 0 && (
        <div className="col-span-1 sm:col-span-2 text-center py-8 text-muted-foreground border rounded-xl border-dashed">
          No hay alertas
        </div>
      )}
    </div>
  )
}
