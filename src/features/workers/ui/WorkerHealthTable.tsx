
import * as React from "react"
import { WorkerHealthDto } from "../api/workers.service"
import { WorkerStatusBadge, WorkerRoleBadge } from "./WorkerBadges"
import { useWorkersStore } from "../model/workers.store"

export function WorkerHealthTable({ workers }: { workers: WorkerHealthDto[] }) {
  const { selectWorker } = useWorkersStore();
  const formatTime = (iso?: string) => iso ? new Date(iso).toLocaleTimeString() : '--';

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Worker ID</th>
            <th className="px-4 py-3 font-medium">Rol</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Heartbeat</th>
            <th className="px-4 py-3 font-medium">Processed / Failed</th>
            <th className="px-4 py-3 font-medium">Último Éxito</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {workers.map(w => (
            <tr 
              key={w.workerId} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectWorker(w.workerId)}
            >
              <td className="px-4 py-3 font-mono text-xs font-bold">{w.workerId}</td>
              <td className="px-4 py-3"><WorkerRoleBadge role={w.role} /></td>
              <td className="px-4 py-3"><WorkerStatusBadge status={w.status} /></td>
              <td className="px-4 py-3 text-xs font-mono">{formatTime(w.heartbeat)}</td>
              <td className="px-4 py-3 text-xs">
                <span className="font-bold text-green-500">{w.processedCount}</span> / <span className="text-red-500">{w.failedCount}</span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{formatTime(w.lastSuccessAt)}</td>
            </tr>
          ))}
          {workers.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                No hay workers en línea.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
