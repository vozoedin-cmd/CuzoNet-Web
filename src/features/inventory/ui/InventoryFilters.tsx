
import * as React from "react"
import { useInventoryStore } from "../model/inventory.store"
import { Button } from "@/components/ui/button"
import { FilterX, Plus } from "lucide-react"

export function InventoryFilters() {
  const { filters, setFilter, clearFilters, setActiveModal } = useInventoryStore();

  const selectClass = "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border flex-wrap">
      <div className="flex-1 min-w-[120px]">
        <select value={filters.type} onChange={(e) => setFilter('type', e.target.value)} className={selectClass}>
          <option value="">Tipo (Todos)</option>
          <option value="router">Router</option>
          <option value="switch">Switch</option>
          <option value="access_point">Access Point</option>
          <option value="ptp_radio">PTP Radio</option>
          <option value="battery">Batería</option>
          <option value="solar_panel">Panel Solar</option>
          <option value="generic_equipment">Genérico</option>
          <option value="cpe">CPE</option>
        </select>
      </div>
      <div className="flex-1 min-w-[120px]">
        <select value={filters.role} onChange={(e) => setFilter('role', e.target.value)} className={selectClass}>
          <option value="">Rol (Todos)</option>
          <option value="core">Core</option>
          <option value="distribution">Distribution</option>
          <option value="access">Access</option>
        </select>
      </div>
      <div className="flex-1 min-w-[120px]">
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={selectClass}>
          <option value="">Estado (Todos)</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="assigned">Asignado</option>
          <option value="retired">Retirado</option>
        </select>
      </div>
      <div className="flex-1 min-w-[150px]">
        <input 
          type="text" 
          placeholder="Fabricante o Modelo..." 
          value={filters.manufacturer}
          onChange={(e) => setFilter('manufacturer', e.target.value)}
          className={selectClass}
        />
      </div>
      <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto flex items-center gap-2">
        <FilterX className="h-4 w-4" /> Limpiar
      </Button>
      <Button variant="default" onClick={() => setActiveModal('create')} className="w-full md:w-auto flex items-center gap-2">
        <Plus className="h-4 w-4" /> Registrar Equipo
      </Button>
    </div>
  )
}
