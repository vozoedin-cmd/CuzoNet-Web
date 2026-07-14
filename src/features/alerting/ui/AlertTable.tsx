
import * as React from "react"
import { AlertDto } from "../api/alerting.service"
import { AlertSeverityBadge, AlertStatusBadge } from "./AlertBadges"
import { useAlertingStore } from "../model/alerting.store"

export function AlertTable({ alerts }: { alerts: AlertDto[] }) {
  const { selectAlert } = useAlertingStore();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Severidad</th>
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Origen / Nodo</th>
            <th className="px-4 py-3 font-medium text-center">Ocurrencias</th>
            <th className="px-4 py-3 font-medium">Última Vez</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {alerts.map(alert => (
            <tr 
              key={alert.id} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectAlert(alert.id)}
            >
              <td className="px-4 py-3"><AlertSeverityBadge severity={alert.severity} /></td>
              <td className="px-4 py-3">
                <p className="font-semibold">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.category}</p>
              </td>
              <td className="px-4 py-3"><AlertStatusBadge status={alert.status} /></td>
              <td className="px-4 py-3">
                <p>{alert.source}</p>
                <p className="text-xs text-muted-foreground">{alert.nodeId || alert.equipmentId || '--'}</p>
              </td>
              <td className="px-4 py-3 text-center font-medium">{alert.occurrences}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(alert.lastOccurredAt)}</td>
            </tr>
          ))}
          {alerts.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                No se encontraron alertas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
