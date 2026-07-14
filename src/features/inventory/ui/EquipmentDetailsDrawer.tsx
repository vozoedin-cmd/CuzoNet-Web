
import * as React from "react"
import { useInventoryStore } from "../model/inventory.store"
import { useEquipment } from "../hooks/useEquipment"
import { EquipmentTypeBadge, EquipmentRoleBadge, EquipmentStatusBadge } from "./InventoryBadges"
import { AssignmentHistoryTimeline } from "./AssignmentHistoryTimeline"
import { X, Server, Hash, Network, Activity, Settings2 } from "lucide-react"

export function EquipmentDetailsDrawer({ companyId }: { companyId: string }) {
  const { selectedEquipmentId, drawerOpen, setDrawerOpen, setActiveModal } = useInventoryStore();
  const { data, isLoading, isError } = useEquipment(companyId, selectedEquipmentId);

  if (!drawerOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" 
        onClick={() => setDrawerOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l bg-background shadow-2xl p-6 overflow-y-auto flex flex-col gap-6 animate-in slide-in-from-right-full duration-300">
        
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Ficha de Equipo
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading && <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-32 bg-muted rounded w-full" />
        </div>}

        {isError && <div className="text-red-500">Error cargando detalles.</div>}

        {!isLoading && !isError && data && (
          <>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-extrabold mb-1 leading-tight">{data.manufacturer} {data.model}</h3>
                <div className="flex gap-2 mb-2">
                  <EquipmentTypeBadge type={data.type} />
                  <EquipmentRoleBadge role={data.role} />
                  <EquipmentStatusBadge status={data.status} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg border">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs"><Hash className="h-3 w-3" /> Serial</span>
                  <p className="font-mono text-xs">{data.serialNumber}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs"><Network className="h-3 w-3" /> MAC Base</span>
                  <p className="font-mono text-xs">{data.macAddress}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs"><Settings2 className="h-3 w-3" /> Firmware</span>
                  <p className="font-medium text-xs">{data.firmwareVersion}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs"><Activity className="h-3 w-3" /> Admin/Oper</span>
                  <p className="font-medium text-xs capitalize">{data.adminState} / {data.operState}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Capacidades</h4>
                <div className="flex gap-1 flex-wrap">
                  {data.capabilities.map(cap => (
                    <span key={cap} className="px-2 py-0.5 bg-card border rounded text-xs text-muted-foreground uppercase">{cap}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Ubicación</h4>
                <p className="text-xs text-muted-foreground">{data.location}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Interfaces Físicas</h4>
                  <button onClick={() => setActiveModal('interface')} className="text-xs text-primary hover:underline">Añadir</button>
                </div>
                <div className="space-y-1">
                  {data.interfaces.map(iface => (
                    <div key={iface.id} className="flex items-center justify-between p-2 border rounded bg-card/50 text-xs">
                      <div>
                        <p className="font-bold">{iface.name} <span className="font-normal text-muted-foreground">({iface.type})</span></p>
                        <p className="font-mono text-[10px] text-muted-foreground">{iface.mac}</p>
                      </div>
                      <div className="text-right">
                        <p className={iface.operState === 'up' ? 'text-green-500' : 'text-red-500'}>{iface.operState.toUpperCase()} - {iface.speedMbps}M</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Historial de Asignación</h4>
                <button onClick={() => setActiveModal('assign')} className="text-xs text-primary hover:underline">Re-asignar</button>
              </div>
              <AssignmentHistoryTimeline history={data.assignmentHistory} />
            </div>
            
            <div className="mt-auto pt-6 border-t flex gap-2">
              <button className="flex-1 px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted" onClick={() => setActiveModal('edit')}>Editar</button>
              <button className="flex-1 px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted" onClick={() => setActiveModal('status')}>Cambiar Estado</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
