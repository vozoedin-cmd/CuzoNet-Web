
"use client"

import * as React from "react"
import { useAlertingStore } from "../model/alerting.store"
import { useAlerts } from "../hooks/useAlerts"
import { AlertStatsGrid } from "./AlertStatsGrid"
import { AlertFilters } from "./AlertFilters"
import { AlertTable } from "./AlertTable"
import { AlertCardList } from "./AlertCardList"
import { AlertDetailsDrawer } from "./AlertDetailsDrawer"
import { AlertingSkeleton, AlertingError, AlertingEmpty } from "./AlertingStates"
import { Activity, LayoutList, LayoutGrid } from "lucide-react"

export function AlertingOverview() {
  const companyId = "mock-company";
  
  const { filters, viewMode, setViewMode } = useAlertingStore();
  const { data, isLoading, isError, error } = useAlerts(companyId, filters);

  const isDemo = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

  if (isLoading) return <AlertingSkeleton />;
  if (isError) return <AlertingError error={error as Error} />;

  return (
    <div className="space-y-6 relative pb-10">
      {isDemo && (
        <div className="bg-amber-500/20 text-amber-500 border border-amber-500/50 px-3 py-1 text-xs font-bold rounded-md w-max flex items-center gap-2 mb-2 uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <Activity className="h-4 w-4" /> DATOS DEMO
        </div>
      )}

      <AlertStatsGrid stats={data?.stats} />
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-3/4">
          <AlertFilters />
        </div>
        <div className="flex items-center gap-2 border bg-card p-1 rounded-lg">
          <button 
            className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-muted' : 'hover:bg-muted/50'}`}
            onClick={() => setViewMode('table')}
            title="Vista Tabla"
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button 
            className={`p-2 rounded-md transition-colors ${viewMode === 'cards' ? 'bg-muted' : 'hover:bg-muted/50'}`}
            onClick={() => setViewMode('cards')}
            title="Vista Tarjetas"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {data?.alerts.length === 0 ? (
        <AlertingEmpty />
      ) : (
        viewMode === 'table' ? 
          <div className="hidden md:block"><AlertTable alerts={data?.alerts || []} /></div> : 
          <AlertCardList alerts={data?.alerts || []} />
      )}
      
      {/* Forzar vista móvil en pantallas pequeñas */}
      {viewMode === 'table' && data?.alerts.length !== 0 && (
        <div className="block md:hidden">
          <AlertCardList alerts={data?.alerts || []} />
        </div>
      )}

      <AlertDetailsDrawer companyId={companyId} />
    </div>
  )
}
