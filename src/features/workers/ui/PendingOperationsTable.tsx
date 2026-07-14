
import * as React from "react"
import { PendingOperationDto, FailedOperationDto } from "../api/workers.service"
import { OperationStatusBadge, sanitizeError } from "./WorkerBadges"
import { useWorkersStore } from "../model/workers.store"

export function PendingOperationsTable({ ops }: { ops: PendingOperationDto[] }) {
  const { selectOperation } = useWorkersStore();
  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <div className="bg-muted p-2 border-b text-sm font-bold flex justify-between items-center">
        <span>Cola de Operaciones Pendientes</span>
        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">{ops.length}</span>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-2 font-medium">Op ID</th>
            <th className="px-4 py-2 font-medium">Tipo</th>
            <th className="px-4 py-2 font-medium">Estado</th>
            <th className="px-4 py-2 font-medium">Claimed By</th>
            <th className="px-4 py-2 font-medium">Attempts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {ops.map(o => (
            <tr key={o.operationId} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => selectOperation(o.operationId)}>
              <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground">{o.operationId}</td>
              <td className="px-4 py-2 text-xs font-bold uppercase">{o.type}</td>
              <td className="px-4 py-2"><OperationStatusBadge status={o.status} /></td>
              <td className="px-4 py-2 font-mono text-xs">{o.claimedBy || '--'}</td>
              <td className="px-4 py-2 text-xs">{o.attemptCount} / {o.maxAttempts}</td>
            </tr>
          ))}
          {ops.length === 0 && <tr><td colSpan={5} className="px-4 py-4 text-center text-xs text-muted-foreground">Cola vacía.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

export function FailedOperationsTable({ ops }: { ops: FailedOperationDto[] }) {
  const { selectOperation } = useWorkersStore();
  return (
    <div className="w-full overflow-auto rounded-xl border border-red-500/20 bg-card">
      <div className="bg-red-500/10 p-2 border-b border-red-500/20 text-sm font-bold text-red-500 flex justify-between items-center">
        <span>Operaciones Fallidas (Requieren Atención)</span>
        <span className="bg-red-500/20 px-2 py-0.5 rounded-full text-xs">{ops.length}</span>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-2 font-medium">Op ID</th>
            <th className="px-4 py-2 font-medium">Error Code</th>
            <th className="px-4 py-2 font-medium">Último Mensaje</th>
            <th className="px-4 py-2 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {ops.map(o => (
            <tr key={o.operationId} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => selectOperation(o.operationId)}>
              <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground">{o.operationId}</td>
              <td className="px-4 py-2 font-mono text-xs font-bold text-red-500">{o.errorCode}</td>
              <td className="px-4 py-2 text-[10px] text-muted-foreground truncate max-w-[200px]" title={sanitizeError(o.lastError)}>{sanitizeError(o.lastError)}</td>
              <td className="px-4 py-2"><OperationStatusBadge status={o.status} /></td>
            </tr>
          ))}
          {ops.length === 0 && <tr><td colSpan={4} className="px-4 py-4 text-center text-xs text-green-500">No hay operaciones fallidas.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
