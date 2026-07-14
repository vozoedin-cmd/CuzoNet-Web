
import * as React from "react"
import { useServicesStore } from "../model/services.store"
import { Button } from "@/components/ui/button"
import { FilterX, Plus } from "lucide-react"

export function ServiceFilters() {
  const { filters, setFilter, clearFilters, setActiveModal } = useServicesStore();
  const selectClass = "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border flex-wrap">
      <div className="flex-1 min-w-[150px]">
        <input 
          type="text" 
          placeholder="Client ID..." 
          value={filters.clientId}
          onChange={(e) => setFilter('clientId', e.target.value)}
          className={selectClass}
        />
      </div>
      <div className="flex-1 min-w-[120px]">
        <select value={filters.lifecycleStatus} onChange={(e) => setFilter('lifecycleStatus', e.target.value)} className={selectClass}>
          <option value="">Estado (Todos)</option>
          <option value="pending">Pendiente</option>
          <option value="active">Activo</option>
          <option value="suspended">Suspendido</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>
      <div className="flex-1 min-w-[120px]">
        <select value={filters.serviceType} onChange={(e) => setFilter('serviceType', e.target.value)} className={selectClass}>
          <option value="">Tipo (Todos)</option>
          <option value="simple_queue">Simple Queue</option>
          <option value="pppoe">PPPoE</option>
          <option value="hotspot">Hotspot</option>
        </select>
      </div>
      <div className="flex-1 min-w-[120px]">
        <select value={filters.billingDay} onChange={(e) => setFilter('billingDay', e.target.value)} className={selectClass}>
          <option value="">Día Fact. (Todos)</option>
          <option value="1">1 del mes</option>
          <option value="5">5 del mes</option>
          <option value="15">15 del mes</option>
        </select>
      </div>
      <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto flex items-center gap-2">
        <FilterX className="h-4 w-4" /> Limpiar
      </Button>
      <Button variant="default" onClick={() => setActiveModal('create')} className="w-full md:w-auto flex items-center gap-2">
        <Plus className="h-4 w-4" /> Nuevo Servicio
      </Button>
    </div>
  )
}
