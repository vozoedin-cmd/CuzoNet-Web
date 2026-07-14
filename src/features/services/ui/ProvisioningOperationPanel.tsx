
import * as React from "react"
import { useProvisioningOperation } from "../hooks/useServices"
import { Activity, RefreshCcw, AlertTriangle, CheckCircle2 } from "lucide-react"

export function ProvisioningOperationPanel({ companyId, operationId }: { companyId: string, operationId: string }) {
  const { data, isLoading, isError, refetch, isFetching } = useProvisioningOperation(companyId, operationId);

  if (isLoading) return <div className="animate-pulse h-20 bg-muted rounded-lg" />;
  if (isError || !data) return <div className="text-red-500 text-sm">Error cargando operación.</div>;

  return (
    <div className="border rounded-lg p-4 bg-card relative overflow-hidden">
      {data.status === 'running' && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />}
      {data.status === 'succeeded' && <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />}
      {data.status === 'failed' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />}

      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-sm flex items-center gap-2">
            Operación Técnica
            {data.status === 'running' && <Activity className="h-4 w-4 text-blue-500 animate-spin" />}
            {data.status === 'succeeded' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            {data.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </h4>
          <p className="text-[10px] text-muted-foreground font-mono mt-1">OP: {data.id}</p>
        </div>
        <button onClick={() => refetch()} disabled={isFetching} className="p-1 rounded bg-muted hover:bg-muted/80 disabled:opacity-50">
          <RefreshCcw className={`h-3 w-3 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mt-4">
        <div>
          <span className="text-muted-foreground">Estado: </span>
          <span className="font-bold uppercase">{data.status}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Intentos: </span>
          <span className="font-bold">{data.attemptCount} / {data.maxAttempts}</span>
        </div>
      </div>

      {data.lastError && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded font-mono break-all">
          {data.lastError}
        </div>
      )}
    </div>
  )
}
