
"use client"
import * as React from "react"
import { useBillingStore } from "../model/billing.store"
import { usePayments } from "../hooks/useBilling"
import { BillingStatsGrid } from "./BillingStatsGrid"
import { BillingFilters } from "./BillingFilters"
import { PaymentsTable } from "./PaymentsTable"
import { PaymentCardList } from "./PaymentCardList"
import { PaymentDetailsDrawer } from "./PaymentDetailsDrawer"
import { RegisterPaymentDialog } from "./BillingDialogs"
import { ClientAccountPanel } from "./ClientAccountPanel"
import { BillingSkeleton, BillingError, BillingEmpty } from "./BillingStates"
import { Activity, LayoutList, LayoutGrid } from "lucide-react"

export function BillingOverview() {
  const companyId = "mock-company";
  
  const { filters, viewMode, setViewMode } = useBillingStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading, isError, error } = usePayments(companyId, filters as any);

  const isDemo = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

  if (isLoading) return <BillingSkeleton />;
  if (isError) return <BillingError error={error as Error} />;

  return (
    <div className="space-y-6 relative pb-10">
      {isDemo && (
        <div className="bg-amber-500/20 text-amber-500 border border-amber-500/50 px-3 py-1 text-xs font-bold rounded-md w-max flex items-center gap-2 mb-2 uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <Activity className="h-4 w-4" /> DATOS DEMO
        </div>
      )}

      <BillingStatsGrid stats={data?.stats} />
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-5/6">
          <BillingFilters />
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
        {data?.payments.length === 0 ? (
          <BillingEmpty />
        ) : (
          viewMode === 'table' ? 
            <div className="hidden md:block"><PaymentsTable payments={data?.payments || []} /></div> : 
            <PaymentCardList payments={data?.payments || []} />
        )}
        
        {/* Mobile fallback */}
        {viewMode === 'table' && data?.payments.length !== 0 && (
          <div className="block md:hidden">
            <PaymentCardList payments={data?.payments || []} />
          </div>
        )}
      </div>

      <PaymentDetailsDrawer companyId={companyId} />
      <RegisterPaymentDialog companyId={companyId} />
      <ClientAccountPanel companyId={companyId} />
    </div>
  )
}
