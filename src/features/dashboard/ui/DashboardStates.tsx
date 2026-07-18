import { AlertCircle, InboxIcon, RefreshCw } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function formatDashboardUpdatedAt(updatedAt: number): string {
  if (updatedAt <= 0) return 'No disponible';

  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(updatedAt));
}

export function DashboardBlockMeta({
  isFetching,
  updatedAt,
}: {
  isFetching: boolean;
  updatedAt: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1" aria-live="polite">
        {isFetching ? (
          <>
            <RefreshCw className="h-3 w-3 animate-spin" />
            Actualizando…
          </>
        ) : (
          'Sin actualización en curso'
        )}
      </span>
      <span>Última actualización: {formatDashboardUpdatedAt(updatedAt)}</span>
    </div>
  );
}

export function DashboardBlockError({
  error,
  title,
}: {
  error: Error;
  title: string;
}) {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <AlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {error.message}
      </CardContent>
    </Card>
  );
}

export function DashboardBlockEmpty({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <Card>
      <CardContent className="flex min-h-32 flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
        <InboxIcon className="h-8 w-8 opacity-40" />
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardBlockSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="Cargando">
      {Array.from({ length: cards }, (_, index) => (
        <Skeleton className="h-32 rounded-xl" key={index} />
      ))}
    </div>
  );
}
