import { Layers, X } from 'lucide-react';

import type { PlanDto } from '../api/plans.service';
import { usePlansStore } from '../model/plans.store';
import { PlanActivityBadge, ServiceTypeBadge } from './PlanBadges';
import { formatKbps, formatPriceCents } from './PlanTable';

export function PlanDetailsDrawer({ plan }: { plan: PlanDto | undefined }) {
  const drawerOpen = usePlansStore((state) => state.drawerOpen);
  const setActiveModal = usePlansStore((state) => state.setActiveModal);
  const setDrawerOpen = usePlansStore((state) => state.setDrawerOpen);

  if (!drawerOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar detalle"
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
      />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l bg-background shadow-2xl flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Detalle del plan
          </h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-2 hover:bg-muted rounded-full"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {plan === undefined ? (
          <div className="p-6 text-sm text-muted-foreground">
            El plan seleccionado ya no está disponible en la lista.
          </div>
        ) : (
          <div className="p-6 flex-1 overflow-y-auto space-y-5">
            <div>
              <h3 className="text-2xl font-extrabold mb-1">{plan.name}</h3>
              <div className="flex gap-2 flex-wrap">
                <ServiceTypeBadge type={plan.serviceType} />
                <PlanActivityBadge isActive={plan.isActive} />
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border font-mono">
                  {plan.code}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border">
              <div>
                <span className="text-muted-foreground text-xs block">
                  Plan ID
                </span>
                <p className="font-mono break-all">{plan.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">
                  Versión vigente
                </span>
                <p className="font-bold">v{plan.currentVersion.version}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">
                  Version ID
                </span>
                <p className="font-mono break-all">
                  {plan.currentVersion.id}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">
                  Precio
                </span>
                <p className="font-bold">
                  {formatPriceCents(plan.currentVersion.priceCents)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">
                  Moneda
                </span>
                <p>No disponible</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">
                  Vigencia
                </span>
                <p>No disponible</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">
                  Subida
                </span>
                <p className="font-mono">
                  {formatKbps(plan.currentVersion.uploadKbps)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">
                  Bajada
                </span>
                <p className="font-mono">
                  {formatKbps(plan.currentVersion.downloadKbps)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('revise')}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Revisar plan
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
