
import * as React from "react"
import { useServicesStore } from "../model/services.store"
import { useService } from "../hooks/useServices"
import { ServiceLifecycleStatusBadge, ServiceTypeBadge } from "./ServiceBadges"
import { ProvisioningOperationPanel } from "./ProvisioningOperationPanel"
import { X, Network, TerminalSquare, Info, History } from "lucide-react"

export function ServiceDetailsDrawer({ companyId }: { companyId: string }) {
  const { selectedServiceId, drawerOpen, setDrawerOpen, setActiveModal } = useServicesStore();
  const { data, isLoading, isError } = useService(companyId, selectedServiceId);
  const [activeTab, setActiveTab] = React.useState('resumen');

  if (!drawerOpen) return null;

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: Info },
    { id: 'provisioning', label: 'Provisioning', icon: TerminalSquare },
    { id: 'historial', label: 'Historial Técnico', icon: History },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l bg-background shadow-2xl p-0 flex flex-col animate-in slide-in-from-right-full duration-300">
        
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Contrato de Servicio
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading && <div className="p-6 animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-32 bg-muted rounded w-full" />
        </div>}

        {isError && <div className="p-6 text-red-500">Error cargando servicio.</div>}

        {!isLoading && !isError && data && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-xl font-mono mb-2 leading-tight">{data.id}</h3>
              <div className="flex gap-2 mb-4">
                <ServiceTypeBadge type={data.type} />
                <ServiceLifecycleStatusBadge status={data.lifecycleStatus} />
              </div>
            </div>

            <div className="px-6 border-b flex gap-4 overflow-x-auto">
              {tabs.map(t => {
                const active = activeTab === t.id;
                const Icon = t.icon;
                return (
                  <button 
                    key={t.id} 
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    <Icon className="h-4 w-4" /> {t.label}
                  </button>
                )
              })}
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {activeTab === 'resumen' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg border">
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Cliente ID</span>
                      <p className="font-mono">{data.clientId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Plan Contratado</span>
                      <p className="font-bold">{data.planVersionId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Día de Facturación</span>
                      <p className="font-bold">Día {data.billingDay}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Estado Técnico</span>
                      <p className="font-bold text-muted-foreground italic">{data.technicalStatus || 'Sin información técnica'}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'provisioning' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    El aprovisionamiento es el acto técnico de impactar las reglas en la infraestructura (MikroTik/OLT).
                  </p>
                  {data.lastOperationId ? (
                    <ProvisioningOperationPanel companyId={companyId} operationId={data.lastOperationId} />
                  ) : (
                    <div className="p-4 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
                      No hay operaciones recientes.
                    </div>
                  )}
                  {data.lifecycleStatus === 'pending' && (
                    <button onClick={() => setActiveModal('provision')} className="w-full py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 mt-4">
                      Solicitar Aprovisionamiento Inicial
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'historial' && (
                <div className="space-y-4">
                  {data.recentOperations.map(op => (
                    <div key={op.id} className="p-3 border rounded-lg bg-card text-xs">
                      <div className="flex justify-between items-center mb-1 border-b pb-1">
                        <span className="font-bold uppercase">{op.type}</span>
                        <span className={`font-mono px-2 rounded ${op.status === 'succeeded' ? 'bg-green-500/20 text-green-500' : 'bg-muted'}`}>{op.status}</span>
                      </div>
                      <p className="text-muted-foreground mt-2">Cola: {new Date(op.queuedAt).toLocaleString()}</p>
                      {op.lastError && <p className="text-red-500 font-mono mt-1 mt-2 bg-red-500/10 p-1 rounded break-all">{op.lastError}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-2 bg-muted/10">
              <button className="flex-1 px-4 py-2 border rounded-md text-sm font-medium bg-background text-muted-foreground cursor-not-allowed">Editar Servicio (Próximamente)</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
