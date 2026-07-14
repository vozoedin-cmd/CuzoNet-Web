
import * as React from "react"
import { useWorkersStore } from "../model/workers.store"
import { useWorkersHealth, useActiveLeases } from "../hooks/useWorkers"
import { WorkerStatusBadge, WorkerRoleBadge } from "./WorkerBadges"
import { X, Server, Activity, Clock } from "lucide-react"

export function WorkerDetailsDrawer({ companyId }: { companyId: string }) {
  const { selectedWorkerId, selectedOperationId, drawerOpen, setDrawerOpen } = useWorkersStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: healthData } = useWorkersHealth(companyId, { workerId: selectedWorkerId || undefined } as any);
  const { data: leases } = useActiveLeases(companyId, selectedWorkerId);

  // Solamente renderiza si el drawer se abrió para un WORKER (no para una operación)
  if (!drawerOpen || selectedOperationId || !selectedWorkerId) return null;

  const worker = healthData?.find(w => w.workerId === selectedWorkerId);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l bg-background shadow-2xl p-0 flex flex-col animate-in slide-in-from-right-full duration-300">
        
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Node Worker Inspector
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!worker ? (
          <div className="p-6 text-muted-foreground">Buscando Worker...</div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 pb-4">
              <h3 className="text-2xl font-mono font-extrabold mb-2">{worker.workerId}</h3>
              <div className="flex gap-2 mb-4">
                <WorkerRoleBadge role={worker.role} />
                <WorkerStatusBadge status={worker.status} />
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6 pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border">
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Último Heartbeat</span>
                  <p className="font-mono">{new Date(worker.heartbeat).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Último Éxito</span>
                  <p className="font-mono">{worker.lastSuccessAt ? new Date(worker.lastSuccessAt).toLocaleString() : '--'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Procesados</span>
                  <p className="font-bold text-green-500">{worker.processedCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Fallos (Hard) / Retries</span>
                  <p className="font-bold text-red-500">{worker.failedCount} / {worker.retryCount}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm flex items-center gap-2 border-b pb-2"><Activity className="w-4 h-4" /> Leases Activos / Lock Registry</h4>
                <p className="text-xs text-muted-foreground">
                  El worker reserva las operaciones utilizando un esquema de lock distribuido (fencing token).
                </p>
                
                {(!leases || leases.length === 0) ? (
                  <div className="text-xs text-center border p-4 rounded bg-card text-muted-foreground">Sin leases activos. Worker idle.</div>
                ) : (
                  <div className="space-y-2 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                    {leases.map((l, i) => (
                       <div key={l.id + i} className="relative flex items-center justify-between mb-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 z-10">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="w-[calc(100%-3rem)] p-3 rounded-lg border bg-background shadow-sm text-sm ml-2">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold font-mono text-[10px]">{l.operationId}</span>
                              <span className="font-bold uppercase text-[10px] tracking-wider text-primary">{l.status}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(l.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  )
}
