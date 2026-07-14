
import * as React from "react"
import { useAlertingStore } from "../model/alerting.store"
import { Button } from "@/components/ui/button"
import { FilterX } from "lucide-react"

export function AlertFilters() {
  const { filters, setFilter, clearFilters } = useAlertingStore();

  const handleSelect = (key: 'severity' | 'status' | 'category', e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(key, e.target.value);
  }

  const selectClass = "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border">
      <div className="flex-1 w-full">
        <select value={filters.severity} onChange={(e) => handleSelect('severity', e)} className={selectClass}>
          <option value="">Todas las Severidades</option>
          <option value="emergency">Emergency</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <select value={filters.status} onChange={(e) => handleSelect('status', e)} className={selectClass}>
          <option value="">Todos los Estados</option>
          <option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div className="flex-1 w-full">
        <input 
          type="text" 
          placeholder="Buscar categoría..." 
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
          className={selectClass}
        />
      </div>
      <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto flex items-center gap-2">
        <FilterX className="h-4 w-4" /> Limpiar
      </Button>
    </div>
  )
}
