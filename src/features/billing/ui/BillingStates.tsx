import { AlertCircle, Receipt } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/services/api/api-client';

export function BillingApiErrorNotice({ error }: { error: unknown }) {
  if (!(error instanceof ApiError)) {
    return <p>{error instanceof Error ? error.message : 'Error inesperado.'}</p>;
  }

  return (
    <div className="space-y-1 text-sm">
      <p className="font-semibold">{error.message}</p>
      <p>
        Código: <span className="font-mono">{error.code}</span>
      </p>
      <p>
        Correlation ID:{' '}
        <span className="font-mono">{error.correlationId ?? 'No disponible'}</span>
      </p>
      <p>
        Campos:{' '}
        <span className="font-mono break-all">
          {error.fields === undefined
            ? 'No disponible'
            : JSON.stringify(error.fields)}
        </span>
      </p>
    </div>
  );
}

export function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

export function BillingError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 flex flex-col items-center justify-center text-center text-destructive min-h-72">
      <AlertCircle className="h-10 w-10 mb-4" />
      <h3 className="text-lg font-bold mb-2">Error al cargar pagos</h3>
      <BillingApiErrorNotice error={error} />
      <button
        type="button"
        className="mt-4 rounded-md border border-destructive/30 px-3 py-2 text-sm"
        onClick={onRetry}
      >
        Reintentar
      </button>
    </div>
  );
}

export function BillingEmpty() {
  return (
    <div className="rounded-xl border p-12 flex flex-col items-center justify-center text-center text-muted-foreground min-h-72 bg-card/50">
      <Receipt className="h-12 w-12 mb-4 opacity-20" />
      <h3 className="text-lg font-medium mb-1">Sin registros de pago</h3>
      <p className="text-sm max-w-sm">
        No se encontraron pagos para los filtros actuales.
      </p>
    </div>
  );
}
