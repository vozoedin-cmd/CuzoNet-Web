import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  RefreshCcw,
} from 'lucide-react';

import { isTerminalOperationStatus } from '../api/services.service';
import { useProvisioningOperation } from '../hooks/useServices';
import { OperationStatusBadge } from './ServiceBadges';
import { ServiceOperationTimeline } from './ServiceOperationTimeline';
import { ApiErrorNotice } from './ServicesStates';

export function ProvisioningOperationPanel({
  operationId,
}: {
  operationId: string;
}) {
  const operationQuery = useProvisioningOperation(operationId);

  if (operationQuery.isPending) {
    return <div className="animate-pulse h-32 bg-muted rounded-lg" />;
  }

  if (operationQuery.isError && operationQuery.data === undefined) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
        <p className="font-semibold mb-2">Falló el polling de la operación.</p>
        <ApiErrorNotice error={operationQuery.error} />
        <button
          type="button"
          className="mt-3 rounded border px-3 py-1.5 text-xs"
          onClick={() => void operationQuery.refetch()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const operation = operationQuery.data;
  if (operation === undefined) return null;

  const isTerminal = isTerminalOperationStatus(operation.status);

  return (
    <div className="border rounded-lg p-4 bg-card space-y-4">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h4 className="font-bold text-sm flex items-center gap-2">
            Operación técnica
            {operation.status === 'running' && (
              <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
            )}
            {operation.status === 'succeeded' && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            {operation.status === 'failed' && (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
          </h4>
          <p className="text-[10px] text-muted-foreground font-mono mt-1">
            {operation.id}
          </p>
        </div>
        <button
          type="button"
          aria-label="Actualizar operación"
          onClick={() => void operationQuery.refetch()}
          disabled={operationQuery.isFetching}
          className="p-1.5 rounded bg-muted hover:bg-muted/80 disabled:opacity-50"
        >
          <RefreshCcw
            className={
              'h-3.5 w-3.5 ' +
              (operationQuery.isFetching ? 'animate-spin' : '')
            }
          />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Estado: </span>
          <OperationStatusBadge status={operation.status} />
        </div>
        <div>
          <span className="text-muted-foreground">Intentos: </span>
          <span className="font-bold">{operation.attemptCount}</span>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">Servicio: </span>
          <span className="font-mono">{operation.serviceId}</span>
        </div>
      </div>

      {!isTerminal && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Polling activo cada 5 segundos.
        </p>
      )}
      {isTerminal && (
        <p className="text-xs text-muted-foreground">
          Estado terminal alcanzado. Polling detenido.
        </p>
      )}

      {operationQuery.isError && (
        <div className="rounded border border-destructive/30 bg-destructive/10 p-2 text-destructive">
          <p className="font-semibold text-xs">Falló la última actualización.</p>
          <ApiErrorNotice error={operationQuery.error} />
        </div>
      )}

      {operation.lastError !== null && (
        <div className="rounded border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive font-mono break-all">
          {operation.lastError}
        </div>
      )}

      <ServiceOperationTimeline operation={operation} />
    </div>
  );
}
