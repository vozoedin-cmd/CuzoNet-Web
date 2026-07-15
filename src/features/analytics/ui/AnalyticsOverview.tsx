
"use client"
import * as React from "react"
import { useExecutiveSummary, useRevenueAnalytics, useClientAnalytics } from "../hooks/useAnalytics"
import { DateRangeSelector } from "./DateRangeSelector"
import { ExecutiveKPIGrid } from "./ExecutiveKPIGrid"
import { RevenueTrendChart, ClientGrowthChart } from "./Charts"
import { ReportExportPanel } from "./ReportExportPanel"
import { AnalyticsSkeleton, AnalyticsError } from "./AnalyticsStates"
import { Activity } from "lucide-react"

export function AnalyticsOverview() {
  const companyId = "mock-company";
  
  const { data: overview, isLoading: oLoad, error: oErr } = useExecutiveSummary(companyId);
  const { data: revenue, isLoading: rLoad, error: rErr } = useRevenueAnalytics(companyId);
  const { data: clientsTrend } = useClientAnalytics(companyId);
  
  const isDemo = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

  if (oLoad || rLoad) return <AnalyticsSkeleton />;
  if (oErr || rErr) return <AnalyticsError error={(oErr || rErr) as Error} />;

  return (
    <div className="space-y-6 pb-10">
      {isDemo && (
        <div className="bg-amber-500/20 text-amber-500 border border-amber-500/50 px-3 py-1 text-xs font-bold rounded-md w-max flex items-center gap-2 mb-2 uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <Activity className="h-4 w-4" /> DATOS DEMO
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <h2 className="text-2xl font-bold tracking-tight">Executive Dashboard</h2>
        <DateRangeSelector />
      </div>

      <ExecutiveKPIGrid overview={overview} billing={revenue?.summary || undefined} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-4 flex items-center gap-2">Evolución de Ingresos</h3>
          <RevenueTrendChart data={revenue?.trend} />
        </div>
        <div>
          <h3 className="font-bold mb-4 flex items-center gap-2">Crecimiento de Cartera</h3>
          <ClientGrowthChart data={clientsTrend} />
        </div>
      </div>

      <ReportExportPanel />
    </div>
  )
}
