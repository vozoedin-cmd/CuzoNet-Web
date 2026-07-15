
import * as React from "react"
import { useAnalyticsStore } from "../model/analytics.store"
import { Calendar } from "lucide-react"

export function DateRangeSelector() {
  const { timeRange, setTimeRange } = useAnalyticsStore();
  
  return (
    <div className="flex items-center gap-2 bg-card p-1 rounded-lg border">
      <Calendar className="h-4 w-4 ml-2 text-muted-foreground hidden sm:block" />
      <select 
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value as 'today' | '7d' | '30d' | '90d' | 'ytd')}
        className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer p-1.5"
      >
        <option value="today">Hoy</option>
        <option value="7d">Últimos 7 días</option>
        <option value="30d">Últimos 30 días</option>
        <option value="90d">Últimos 90 días</option>
        <option value="ytd">Año Actual</option>
      </select>
    </div>
  )
}
