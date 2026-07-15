import { AlertCircle, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/services/api/api-client';

export function ClientsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}

export function ApiErrorNotice({ error }: { error: Error }) {
  const apiError = error instanceof ApiError ? error : null;

  return (
    <div className="space-y-1">
      <p>{error.message}</p>
      {apiError && (
        <>
          <p className="text-xs opacity-80">
            Código: {apiError.code}
            {apiError.correlationId
              ? ' · Correlación: ' + apiError.correlationId
              : ''}
          </p>
          {apiError.fields !== undefined && (
            <p className="text-xs opacity-80">
              Campos: {JSON.stringify(apiError.fields)}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function ClientsError({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 flex flex-col items-center justify-center text-center text-destructive h-[400px]">
      <AlertCircle className="h-10 w-10 mb-4" />
      <h3 className="text-lg font-bold mb-1">No fue posible cargar los clientes</h3>
      <ApiErrorNotice error={error} />
      <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}

export function ClientsEmpty() {
  return (
    <div className="rounded-xl border p-12 flex flex-col items-center justify-center text-center text-muted-foreground h-[400px] bg-card/50">
      <Users className="h-12 w-12 mb-4 opacity-20" />
      <h3 className="text-lg font-medium mb-1">No hay clientes</h3>
      <p className="text-sm max-w-sm mx-auto">
        No existen clientes que coincidan con la búsqueda y los filtros actuales.
      </p>
    </div>
  );
}
