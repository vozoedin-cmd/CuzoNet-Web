import type { OperationDto } from '../api/services.service';
import { OperationStatusBadge } from './ServiceBadges';

function formatDate(value: string | null): string {
  return value === null ? 'No disponible' : new Date(value).toLocaleString();
}

export function ServiceOperationTimeline({
  operation,
}: {
  operation: OperationDto;
}) {
  return (
    <ol className="space-y-3 border-l pl-4 text-xs">
      <li>
        <p className="font-semibold">Operación creada</p>
        <p className="text-muted-foreground">{formatDate(operation.createdAt)}</p>
      </li>
      <li>
        <p className="font-semibold">Estado técnico real</p>
        <OperationStatusBadge status={operation.status} />
      </li>
      <li>
        <p className="font-semibold">Finalización</p>
        <p className="text-muted-foreground">
          {formatDate(operation.completedAt)}
        </p>
      </li>
    </ol>
  );
}
