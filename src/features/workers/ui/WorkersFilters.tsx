
import * as React from "react"
import { useWorkersStore } from "../model/workers.store"
import { Button } from "@/components/ui/button"
import { FilterX } from "lucide-react"

export function WorkersFilters() {
  const { filters, setFilter, clearFilters } = useWorkersStore();
  const selectClass = "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <input 
          type="text" 
          placeholder="Buscar por Worker ID..." 
          value={filters.workerId}
          onChange={(e) => setFilter('workerId', e.target.value)}
          className={selectClass}
        />
      </div>
      <div className="flex-1 min-w-[150px]">
        <select value={filters.role} onChange={(e) => setFilter('role', e.target.value)} className={selectClass}>
          <option value="">Todos los Roles</option>
          <option value="outbox">Outbox Relay</option>
          <option value="provisioning">Provisioning</option>
          <option value="automation">Automation</option>
          <option value="notifications">Notifications</option>
        </select>
      </div>
      <div className="flex-1 min-w-[150px]">
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={selectClass}>
          <option value="">Estado Health</option>
          <option value="healthy">Healthy</option>
          <option value="degraded">Degraded</option>
          <option value="stopped">Stopped</option>
        </select>
      </div>
      <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto flex items-center gap-2">
        <FilterX className="h-4 w-4" /> Limpiar
      </Button>
    </div>
  )
}
