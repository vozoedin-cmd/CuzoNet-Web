
import * as React from "react"
import { useClientsStore } from "../model/clients.store"
import { Button } from "@/components/ui/button"
import { FilterX, Plus } from "lucide-react"

export function ClientFilters() {
  const { filters, setFilter, clearFilters, setActiveModal } = useClientsStore();
  const selectClass = "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <input 
          type="text" 
          placeholder="Buscar por Nombre o Doc..." 
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className={selectClass}
        />
      </div>
      <div className="flex-1 min-w-[120px]">
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={selectClass}>
          <option value="">Estado (Todos)</option>
          <option value="active">Activo</option>
          <option value="delinquent">Moroso</option>
          <option value="archived">Archivado</option>
        </select>
      </div>
      <div className="flex-1 min-w-[120px]">
        <select value={filters.type} onChange={(e) => setFilter('type', e.target.value)} className={selectClass}>
          <option value="">Tipo (Todos)</option>
          <option value="person">Persona</option>
          <option value="company">Empresa</option>
        </select>
      </div>
      <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto flex items-center gap-2">
        <FilterX className="h-4 w-4" /> Limpiar
      </Button>
      <Button variant="default" onClick={() => setActiveModal('create')} className="w-full md:w-auto flex items-center gap-2">
        <Plus className="h-4 w-4" /> Nuevo Cliente
      </Button>
    </div>
  )
}
