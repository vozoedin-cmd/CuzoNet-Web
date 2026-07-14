
import * as React from "react"
import { AssignmentHistory } from "../api/inventory.service"

export function AssignmentHistoryTimeline({ history }: { history: AssignmentHistory[] }) {
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }

  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
      {history.map((evt) => (
        <div key={evt.id} className="relative flex items-center justify-normal group is-active">
          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-background bg-muted shadow shrink-0" />
          <div className="w-full ml-4 p-3 rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs uppercase">{evt.targetType}: {evt.targetId}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Asignado: {formatDate(evt.assignedAt)}</p>
            {evt.releasedAt ? (
              <p className="text-xs text-muted-foreground">Liberado: {formatDate(evt.releasedAt)}</p>
            ) : (
              <p className="text-xs text-green-500 font-semibold mt-1">Vigente</p>
            )}
            <p className="text-[10px] text-muted-foreground mt-2 italic border-t pt-1">{evt.reason}</p>
          </div>
        </div>
      ))}
      {history.length === 0 && <div className="ml-8 text-xs text-muted-foreground">Sin historial de asignaciones.</div>}
    </div>
  )
}
