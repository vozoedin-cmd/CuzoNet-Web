
"use client"
import * as React from "react"
import { useWorkersStore } from "../model/workers.store"
import { useWorkersHealth, useWorkerStatistics, usePendingOperations, useFailedOperations } from "../hooks/useWorkers"
import { WorkerStatsGrid } from "./WorkerStatsGrid"
import { WorkersFilters } from "./WorkersFilters"
import { WorkerCardList } from "./WorkerRoleCard"
import { WorkerHealthTable } from "./WorkerHealthTable"
import { PendingOperationsTable, FailedOperationsTable } from "./PendingOperationsTable"
import { WorkerDetailsDrawer } from "./WorkerDetailsDrawer"
import { OperationDetailsDrawer } from "./OperationDetailsDrawer"
import { WorkersSkeleton, WorkersError, WorkersEmpty } from "./WorkersStates"
import { Activity, LayoutList, LayoutGrid } from "lucide-react"

export function WorkersOverview() {
  const companyId = "mock-company";
  
  const { filters, viewMode, setViewMode } = useWorkersStore();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: healthData, isLoading: hLoading, isError: hErr, error: hError } = useWorkersHealth(companyId, filters as any);
  const { data: statsData } = useWorkerStatistics(companyId);
  const { data: pendingOps } = usePendingOperations(companyId);
  const { data: failedOps } = useFailedOperations(companyId);

  const isDemo = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

  if (hLoading) return <WorkersSkeleton />;
  if (hErr) return <WorkersError error={hError as Error} />;

  return (
    <div className="space-y-6 relative pb-10">
      {isDemo && (
        <div className="bg-amber-500/20 text-amber-500 border border-amber-500/50 px-3 py-1 text-xs font-bold rounded-md w-max flex items-center gap-2 mb-2 uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <Activity className="h-4 w-4" /> DATOS DEMO
        </div>
      )}

      <WorkerStatsGrid stats={statsData || undefined} />
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-5/6">
          <WorkersFilters />
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

      <div className="w-full">
        {(!healthData || healthData.length === 0) ? (
          <WorkersEmpty />
        ) : (
          viewMode === 'table' ? 
            <div className="hidden md:block"><WorkerHealthTable workers={healthData} /></div> : 
            <WorkerCardList workers={healthData} />
        )}
        
        {/* Mobile fallback */}
        {viewMode === 'table' && healthData && healthData.length !== 0 && (
          <div className="block md:hidden">
            <WorkerCardList workers={healthData} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <PendingOperationsTable ops={pendingOps || []} />
        </div>
        <div>
          <FailedOperationsTable ops={failedOps || []} />
        </div>
      </div>

      <WorkerDetailsDrawer companyId={companyId} />
      <OperationDetailsDrawer companyId={companyId} />
    </div>
  )
}
