
"use client"
import * as React from "react"
import { useServicesStore } from "../model/services.store"
import { useServices } from "../hooks/useServices"

import { ServiceFilters } from "./ServiceFilters"
import { ServiceTable } from "./ServiceTable"
import { ServiceCardList } from "./ServiceCardList"
import { ServiceDetailsDrawer } from "./ServiceDetailsDrawer"
import { CreateServiceDialog, RequestProvisioningDialog } from "./ServiceDialogs"
import { ServicesSkeleton, ServicesError, ServicesEmpty } from "./ServicesStates"
import { Activity, LayoutList, LayoutGrid } from "lucide-react"

export function ServicesOverview() {
  const companyId = "mock-company";
  
  const { filters, viewMode, setViewMode } = useServicesStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading, isError, error } = useServices(companyId, filters as any);

  const isDemo = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

  if (isLoading) return <ServicesSkeleton />;
  if (isError) return <ServicesError error={error as Error} />;

  return (
    <div className="space-y-6 relative pb-10">
      {isDemo && (
        <div className="bg-amber-500/20 text-amber-500 border border-amber-500/50 px-3 py-1 text-xs font-bold rounded-md w-max flex items-center gap-2 mb-2 uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <Activity className="h-4 w-4" /> DATOS DEMO
        </div>
      )}

      
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-5/6">
          <ServiceFilters />
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

      <div className="col-span-1">
        {!filters.clientId ? (
          <div className="rounded-xl border p-12 flex flex-col items-center justify-center text-center text-muted-foreground h-[400px] bg-card/50">
            <h3 className="text-lg font-medium mb-1">Ingrese un ID de Cliente</h3>
            <p className="text-sm max-w-sm mx-auto">
              El listado general no está disponible. Utilice el filtro de Cliente para consultar sus servicios asociados.
            </p>
          </div>
        ) : data?.services.length === 0 ? (
          <ServicesEmpty />
        ) : (
          viewMode === 'table' ? 
            <div className="hidden md:block"><ServiceTable services={data?.services || []} /></div> : 
            <ServiceCardList services={data?.services || []} />
        )}
        
        {/* Mobile constraint */}
        {viewMode === 'table' && data?.services.length !== 0 && (
          <div className="block md:hidden">
            <ServiceCardList services={data?.services || []} />
          </div>
        )}
      </div>

      <ServiceDetailsDrawer companyId={companyId} />
      <CreateServiceDialog companyId={companyId} />
      <RequestProvisioningDialog companyId={companyId} />
    </div>
  )
}
