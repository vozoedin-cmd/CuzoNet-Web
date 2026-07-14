
import * as React from "react"
import { useWorkersStore } from "../model/workers.store"
import { usePendingOperations, useFailedOperations } from "../hooks/useWorkers"
import { OperationStatusBadge, sanitizeError, maskToken } from "./WorkerBadges"
import { X, SearchCode, ShieldAlert } from "lucide-react"

export function OperationDetailsDrawer({ companyId }: { companyId: string }) {
  const { selectedOperationId, drawerOpen, setDrawerOpen } = useWorkersStore();
  
  const { data: pendingOps } = usePendingOperations(companyId);
  const { data: failedOps } = useFailedOperations(companyId);

  if (!drawerOpen || !selectedOperationId) return null;

  // Find op in either array
  const pOp = pendingOps?.find(o => o.operationId === selectedOperationId);
  const fOp = failedOps?.find(o => o.operationId === selectedOperationId);
  
  const isFailed = !!fOp;
  const opId = pOp?.operationId || fOp?.operationId;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l bg-background shadow-2xl p-0 flex flex-col animate-in slide-in-from-right-full duration-300">
        
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <SearchCode className="h-5 w-5 text-primary" />
            Traza de Operación
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!opId ? (
          <div className="p-6 text-muted-foreground">Cargando traza...</div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 pb-4 border-b bg-muted/10">
              <h3 className="text-sm font-mono font-bold mb-2 break-all">{opId}</h3>
              <div className="flex gap-2 mb-2">
                <OperationStatusBadge status={pOp?.status || fOp?.status || 'queued'} />
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              
              {isFailed && fOp && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3 text-red-600">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Fallo de Ejecución (Código: {fOp.errorCode})</h4>
                    <p className="text-xs mt-1 font-mono bg-background p-2 rounded border border-red-500/20 break-words">
                      {sanitizeError(fOp.lastError)}
                    </p>
                    {fOp.manualReview && (
                      <p className="text-xs mt-2 font-bold uppercase tracking-wider">
                        Requiere intervención manual. Las acciones correctivas deben tomarse desde el módulo de origen (Services/Notifications).
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border">
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Intentos</span>
                  <p className="font-bold">{pOp?.attemptCount || fOp?.attempts || 0} / {pOp?.maxAttempts || '--'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Tipo de Tarea</span>
                  <p className="font-bold uppercase">{pOp?.type || 'UNKNOWN'}</p>
                </div>
                <div className="col-span-2 border-t pt-2 mt-2">
                  <span className="text-muted-foreground text-xs block mb-1">Worker Responsable (Claimed By)</span>
                  <p className="font-mono text-xs">{pOp?.claimedBy || '--'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Lease Until</span>
                  <p className="font-mono text-xs">{pOp?.leaseUntil ? new Date(pOp.leaseUntil).toLocaleTimeString() : '--'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block mb-1">Fencing Token</span>
                  <p className="font-mono text-xs opacity-50">{maskToken(opId)}</p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  )
}
