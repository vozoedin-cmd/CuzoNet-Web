
import * as React from "react"
import { useBillingStore } from "../model/billing.store"
import { Button } from "@/components/ui/button"
import { FilterX, Plus, FileText } from "lucide-react"

export function BillingFilters() {
  const { filters, setFilter, clearFilters, setActiveModal } = useBillingStore();
  const selectClass = "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border flex-wrap">
      <div className="flex-1 min-w-[150px]">
        <input 
          type="text" 
          placeholder="Buscar referencia o ID..." 
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className={selectClass}
        />
      </div>
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
        <select value={filters.method} onChange={(e) => setFilter('method', e.target.value)} className={selectClass}>
          <option value="">Método (Todos)</option>
          <option value="cash">Efectivo</option>
          <option value="transfer">Transferencia</option>
          <option value="credit_card">T. Crédito</option>
          <option value="debit_card">T. Débito</option>
          <option value="oxxo">OXXO Pay</option>
          <option value="stripe">Stripe</option>
        </select>
      </div>
      <div className="flex-1 min-w-[120px]">
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={selectClass}>
          <option value="">Estado (Todos)</option>
          <option value="completed">Completado</option>
          <option value="pending">Pendiente</option>
          <option value="failed">Fallido</option>
        </select>
      </div>
      <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto flex items-center gap-2">
        <FilterX className="h-4 w-4" /> Limpiar
      </Button>
      <div className="flex gap-2 w-full md:w-auto">
        <Button variant="secondary" onClick={() => setActiveModal('client_account')} className="flex-1 md:flex-none flex items-center gap-2">
          <FileText className="h-4 w-4" /> Estado Cta.
        </Button>
        <Button variant="default" onClick={() => setActiveModal('register_payment')} className="flex-1 md:flex-none flex items-center gap-2">
          <Plus className="h-4 w-4" /> Registrar Pago
        </Button>
      </div>
    </div>
  )
}
