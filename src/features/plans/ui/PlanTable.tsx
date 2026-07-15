import type { PlanDto } from '../api/plans.service';
import { usePlansStore } from '../model/plans.store';
import { PlanActivityBadge, ServiceTypeBadge } from './PlanBadges';

const numberFormatter = new Intl.NumberFormat('es-GT', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const speedFormatter = new Intl.NumberFormat('es-GT', {
  maximumFractionDigits: 2,
});

export function formatPriceCents(cents: number): string {
  return numberFormatter.format(cents / 100);
}

export function formatKbps(kbps: number): string {
  return speedFormatter.format(kbps / 1000) + ' Mbps';
}

export function PlanTable({ plans }: { plans: readonly PlanDto[] }) {
  const selectPlan = usePlansStore((state) => state.selectPlan);

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Código / Nombre</th>
            <th className="px-4 py-3 font-medium">Tipo</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Precio vigente</th>
            <th className="px-4 py-3 font-medium">Subida / Bajada</th>
            <th className="px-4 py-3 font-medium">Versión vigente</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {plans.map((plan) => (
            <tr
              key={plan.id}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectPlan(plan.id)}
            >
              <td className="px-4 py-3">
                <p className="font-mono text-xs font-bold text-primary">
                  {plan.code}
                </p>
                <p className="font-semibold text-sm">{plan.name}</p>
              </td>
              <td className="px-4 py-3">
                <ServiceTypeBadge type={plan.serviceType} />
              </td>
              <td className="px-4 py-3">
                <PlanActivityBadge isActive={plan.isActive} />
              </td>
              <td className="px-4 py-3 text-xs">
                <p className="font-bold">
                  {formatPriceCents(plan.currentVersion.priceCents)}
                </p>
                <p className="text-muted-foreground">
                  Moneda: No disponible
                </p>
              </td>
              <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                {formatKbps(plan.currentVersion.uploadKbps)} /{' '}
                {formatKbps(plan.currentVersion.downloadKbps)}
              </td>
              <td className="px-4 py-3 text-xs">
                v{plan.currentVersion.version}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
