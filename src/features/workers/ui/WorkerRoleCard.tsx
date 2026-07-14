
import * as React from "react"
import { WorkerHealthDto } from "../api/workers.service"
import { WorkerStatusBadge, WorkerRoleBadge } from "./WorkerBadges"
import { useWorkersStore } from "../model/workers.store"
import { Server } from "lucide-react"

export function WorkerRoleCard({ worker }: { worker: WorkerHealthDto }) {
  const { selectWorker } = useWorkersStore();

  const isDead = worker.status === 'stopped' || worker.status === 'unknown';

  return (
    <div 
      className={`p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors flex flex-col gap-3 relative overflow-hidden ${isDead ? 'opacity-70' : ''}`}
      onClick={() => selectWorker(worker.workerId)}
    >
      <div className="flex items-center justify-between border-b pb-2">
        <WorkerRoleBadge role={worker.role} />
        <WorkerStatusBadge status={worker.status} />
      </div>
      <div>
        <h4 className="font-mono text-xs font-bold flex items-center gap-2"><Server className="w-3 h-3"/> {worker.workerId}</h4>
      </div>
      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border flex flex-col gap-1">
        <div className="flex justify-between">
          <span>Processed:</span>
          <span className="font-mono text-foreground font-bold">{worker.processedCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Failed / Retries:</span>
          <span className="font-mono text-amber-500">{worker.failedCount} / {worker.retryCount}</span>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t">
          <span>Heartbeat:</span>
          <span className="font-mono text-[10px]">{new Date(worker.heartbeat).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}

export function WorkerCardList({ workers }: { workers: WorkerHealthDto[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {workers.map(w => <WorkerRoleCard key={w.workerId} worker={w} />)}
    </div>
  )
}
