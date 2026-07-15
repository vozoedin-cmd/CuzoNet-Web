import * as React from 'react';
import { Info, Network, TerminalSquare, X } from 'lucide-react';

import { useService } from '../hooks/useServices';
import { useServicesStore } from '../model/services.store';
import { ProvisioningOperationPanel } from './ProvisioningOperationPanel';
import {
  ServiceLifecycleStatusBadge,
  ServiceTypeBadge,
} from './ServiceBadges';
import { ApiErrorNotice } from './ServicesStates';

type DrawerTab = 'summary' | 'provisioning';

export function ServiceDetailsDrawer() {
  const activeOperationId = useServicesStore(
    (state) => state.activeOperationId,
  );
  const drawerOpen = useServicesStore((state) => state.drawerOpen);
  const selectedServiceId = useServicesStore(
    (state) => state.selectedServiceId,
  );
  const setActiveModal = useServicesStore((state) => state.setActiveModal);
  const setDrawerOpen = useServicesStore((state) => state.setDrawerOpen);
  const serviceQuery = useService(selectedServiceId);
  const [activeTab, setActiveTab] = React.useState<DrawerTab>('summary');


  if (!drawerOpen) return null;

  const tabs = [
    { id: 'summary' as const, label: 'Resumen', icon: Info },
    {
      id: 'provisioning' as const,
      label: 'Provisioning',
      icon: TerminalSquare,
    },
  ];

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
            <Network className="h-5 w-5 text-primary" />
            Contrato de servicio
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

        {serviceQuery.isPending && (
          <div className="p-6 animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-32 bg-muted rounded w-full" />
          </div>
        )}

        {serviceQuery.isError && (
          <div className="m-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
            <ApiErrorNotice error={serviceQuery.error} />
          </div>
        )}

        {serviceQuery.data && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-lg font-mono mb-2 break-all">
                {serviceQuery.data.serviceId}
              </h3>
              <div className="flex gap-2 mb-4">
                <ServiceTypeBadge type={serviceQuery.data.serviceType} />
                <ServiceLifecycleStatusBadge
                  status={serviceQuery.data.lifecycleStatus}
                />
              </div>
            </div>

            <div className="px-6 border-b flex gap-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={
                      'flex items-center gap-2 py-3 border-b-2 text-sm font-medium ' +
                      (activeTab === tab.id
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground')
                    }
                  >
                    <Icon className="h-4 w-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {activeTab === 'summary' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border">
                  <div>
                    <span className="text-muted-foreground text-xs block">
                      Cliente ID
                    </span>
                    <p className="font-mono break-all">
                      {serviceQuery.data.clientId}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">
                      Plan version ID
                    </span>
                    <p className="font-mono break-all">
                      {serviceQuery.data.planVersionId}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">
                      Día de facturación
                    </span>
                    <p>Día {serviceQuery.data.billingDay}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block">
                      Inicio
                    </span>
                    <p>{serviceQuery.data.startedOn ?? 'No disponible'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground text-xs block">
                      Estado técnico
                    </span>
                    <p>
                      {activeOperationId === null
                        ? 'Sin operación técnica'
                        : 'Operación técnica activa disponible en Provisioning'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'provisioning' && (
                <div className="space-y-4">
                  {activeOperationId === null ? (
                    <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
                      Sin operación técnica
                    </div>
                  ) : (
                    <ProvisioningOperationPanel
                      operationId={activeOperationId}
                    />
                  )}

                  {serviceQuery.data.lifecycleStatus === 'pending' && (
                    <button
                      type="button"
                      onClick={() => setActiveModal('provision')}
                      className="w-full py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90"
                    >
                      Solicitar aprovisionamiento inicial
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
