import type { PlanDto } from '../api/plans.service';
import { usePlansStore } from '../model/plans.store';
import { PlanActivityBadge, ServiceTypeBadge } from './PlanBadges';
import { formatKbps, formatPriceCents } from './PlanTable';

export function PlanCardList({ plans }: { plans: readonly PlanDto[] }) {
  const selectPlan = usePlansStore((state) => state.selectPlan);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <button
          type="button"
          key={plan.id}
          className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors flex flex-col gap-3 text-left"
          onClick={() => selectPlan(plan.id)}
        >
          <div className="flex items-center justify-between border-b pb-2 w-full">
            <ServiceTypeBadge type={plan.serviceType} />
            <PlanActivityBadge isActive={plan.isActive} />
          </div>
          <div>
            <h4 className="font-mono text-xs text-primary font-bold">
              {plan.code}
            </h4>
            <p className="text-sm font-bold">{plan.name}</p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border w-full space-y-1">
            <p>
              Precio: {formatPriceCents(plan.currentVersion.priceCents)}
              <br />
              Moneda: No disponible
            </p>
            <p className="font-mono">
              {formatKbps(plan.currentVersion.uploadKbps)} /{' '}
              {formatKbps(plan.currentVersion.downloadKbps)}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            Versión vigente: v{plan.currentVersion.version}
          </span>
        </button>
      ))}
    </div>
  );
}
