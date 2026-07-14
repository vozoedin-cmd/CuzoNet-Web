
import * as React from "react"
import { useNotificationsStore } from "../model/notifications.store"
import { Button } from "@/components/ui/button"
import { FilterX } from "lucide-react"

export function NotificationFilters() {
  const { filters, setFilter, clearFilters } = useNotificationsStore();

  const selectClass = "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border flex-wrap">
      <div className="flex-1 min-w-[150px]">
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={selectClass}>
          <option value="">Cualquier Estado</option>
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="partial">Partial</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div className="flex-1 min-w-[150px]">
        <select value={filters.channel} onChange={(e) => setFilter('channel', e.target.value)} className={selectClass}>
          <option value="">Canal</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="telegram">Telegram</option>
          <option value="email">Email</option>
          <option value="webhook">Webhook</option>
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <input 
          type="text" 
          placeholder="Template o Asunto..." 
          value={filters.templateCode}
          onChange={(e) => setFilter('templateCode', e.target.value)}
          className={selectClass}
        />
      </div>
      <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto flex items-center gap-2">
        <FilterX className="h-4 w-4" /> Limpiar
      </Button>
    </div>
  )
}
