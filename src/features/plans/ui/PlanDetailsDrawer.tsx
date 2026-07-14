
import * as React from "react"
import { usePlansStore } from "../model/plans.store"
import { usePlan } from "../hooks/usePlans"
import { PlanStatusBadge, ServiceTypeBadge, PlanVersionStatusBadge } from "./PlanBadges"
import { formatMoney, formatKbps } from "./PlanTable"
import { PlanVersionTimeline } from "./PlanVersionTimeline"
import { X, Package, FileText, Settings, History, Layers } from "lucide-react"

export function PlanDetailsDrawer({ companyId }: { companyId: string }) {
  const { selectedPlanId, drawerOpen, setDrawerOpen, setActiveModal } = usePlansStore();
  const { data, isLoading, isError } = usePlan(companyId, selectedPlanId);
  const [activeTab, setActiveTab] = React.useState('resumen');

  if (!drawerOpen) return null;

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: Package },
    { id: 'comercial', label: 'Perfil Comercial', icon: FileText },
    { id: 'tecnico', label: 'Perfil Técnico', icon: Settings },
    { id: 'versiones', label: 'Historial Versiones', icon: History },
  ];

  const cv = data?.versions.find(v => v.id === data.currentVersionId) || data?.versions[data.versions.length - 1];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l bg-background shadow-2xl p-0 flex flex-col animate-in slide-in-from-right-full duration-300">
        
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Detalle de Plan
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading && <div className="p-6 animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-32 bg-muted rounded w-full" />
        </div>}

        {isError && <div className="p-6 text-red-500">Error cargando plan.</div>}

        {!isLoading && !isError && data && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-2xl font-extrabold mb-1 leading-tight">{data.name}</h3>
              <div className="flex gap-2 mb-4">
                <ServiceTypeBadge type={data.compatibleServiceType} />
                <PlanStatusBadge status={data.status} />
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border font-mono">
                  {data.code}
                </span>
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
                      <span className="text-muted-foreground text-xs block mb-1">Versión Vigente</span>
                      <p className="font-bold flex items-center gap-2">
                        v{cv?.versionNumber ?? '--'} 
                        {cv && <PlanVersionStatusBadge status={cv.status} />}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Precio</span>
                      <p className="font-bold text-green-500">{cv ? formatMoney(cv.priceCents, cv.currencyCode) : '--'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Velocidad Configurada</span>
                      <p className="font-mono">{cv ? `${formatKbps(cv.uploadKbps)} / ${formatKbps(cv.downloadKbps)}` : '--'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Estado Comercial</span>
                      <p className="font-bold uppercase tracking-wider">{data.status}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-card mt-4">
                    <h4 className="font-bold text-sm mb-2">Acciones Rápidas</h4>
                    <div className="flex gap-2">
                      <button onClick={() => setActiveModal('create_version')} className="px-4 py-2 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90">
                        Crear Nueva Versión (Draft)
                      </button>
                      <button onClick={() => setActiveModal('change_status')} className="px-4 py-2 border text-xs rounded hover:bg-muted">
                        Cambiar Estado ({data.status === 'active' ? 'Inactivar' : 'Activar'})
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comercial' && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <h4 className="font-bold text-sm border-b pb-2 mb-3">Detalle Financiero (v{cv?.versionNumber})</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs">Precio Base</span>
                        <span className="font-bold">{cv ? formatMoney(cv.priceCents, cv.currencyCode) : '--'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Moneda</span>
                        <span className="font-mono">{cv?.currencyCode || '--'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Validez Desde</span>
                        <span>{cv?.validFrom ? new Date(cv.validFrom).toLocaleDateString() : '--'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Validez Hasta</span>
                        <span>{cv?.validUntil ? new Date(cv.validUntil).toLocaleDateString() : 'Indefinido'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tecnico' && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <h4 className="font-bold text-sm border-b pb-2 mb-3">Parámetros de Red (v{cv?.versionNumber})</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs">Max Limit Upload</span>
                        <span className="font-mono">{cv ? formatKbps(cv.uploadKbps) : '--'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Max Limit Download</span>
                        <span className="font-mono">{cv ? formatKbps(cv.downloadKbps) : '--'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Burst Upload</span>
                        <span className="font-mono">{cv?.burstUploadKbps ? formatKbps(cv.burstUploadKbps) : 'No configurado'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Burst Download</span>
                        <span className="font-mono">{cv?.burstDownloadKbps ? formatKbps(cv.burstDownloadKbps) : 'No configurado'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Priority</span>
                        <span className="font-mono">{cv?.priority || 8}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'versiones' && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground mb-4">
                    Las versiones publicadas son inmutables. Para cambiar el precio o velocidades, debes crear una nueva versión en borrador (draft) y publicarla. Los contratos existentes no se verán afectados automáticamente.
                  </p>
                  <PlanVersionTimeline versions={data.versions} />
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </>
  )
}
