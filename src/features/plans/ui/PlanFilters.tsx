
import * as React from "react"
import { usePlansStore } from "../model/plans.store"
import { Button } from "@/components/ui/button"
import { FilterX, Plus } from "lucide-react"

export function PlanFilters() {
  const { filters, setFilter, clearFilters, setActiveModal } = usePlansStore();
  const selectClass = "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <input 
          type="text" 
          placeholder="Buscar por código o nombre..." 
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className={selectClass}
        />
      </div>
      <div className="flex-1 min-w-[120px]">
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={selectClass}>
          <option value="">Estado (Todos)</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>
      <div className="flex-1 min-w-[150px]">
        <select value={filters.compatibleServiceType} onChange={(e) => setFilter('compatibleServiceType', e.target.value)} className={selectClass}>
          <option value="">Tipo Servicio (Todos)</option>
          <option value="simple_queue">Simple Queue</option>
          <option value="pppoe">PPPoE</option>
          <option value="hotspot">Hotspot</option>
        </select>
      </div>
      <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto flex items-center gap-2">
        <FilterX className="h-4 w-4" /> Limpiar
      </Button>
      <Button variant="default" onClick={() => setActiveModal('create_plan')} className="w-full md:w-auto flex items-center gap-2">
        <Plus className="h-4 w-4" /> Nuevo Plan
      </Button>
    </div>
  )
}
