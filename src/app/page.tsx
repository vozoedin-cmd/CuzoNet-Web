
"use client"

import * as React from "react"
import { 
  DashboardHeader, 
  KPIGrid, 
  QuickActions, 
  RecentActivityCard, 
  WorkerStatusCard, 
  useDashboardOverview,
  useBillingSummary,
  useNetworkHealth,
  NetworkHealthCard,
  AlertsSummaryCard,
  BillingSummaryCard,
  DashboardSkeleton,
  DashboardErrorState,
  DashboardEmptyState
} from "@/features/dashboard"

export default function DashboardPage() {
  const companyId = "mock-company";
  
  const { data: overview, isLoading: loadingOverview, error: errorOverview } = useDashboardOverview(companyId);
  const { data: billing, isLoading: loadingBilling, error: errorBilling } = useBillingSummary(companyId);
  const { data: network, isLoading: loadingNetwork, error: errorNetwork } = useNetworkHealth(companyId);

  const isLoading = loadingOverview || loadingBilling || loadingNetwork;
  const isError = errorOverview || errorBilling || errorNetwork;
  const errorObj = errorOverview || errorBilling || errorNetwork;

  if (isLoading) return <div className="space-y-6"><DashboardHeader /><DashboardSkeleton /></div>;
  if (isError) return <div className="space-y-6"><DashboardHeader /><DashboardErrorState error={errorObj as Error} /></div>;
  if (!overview && !billing && !network) return <div className="space-y-6"><DashboardHeader /><DashboardEmptyState /></div>;

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader />
      
      <KPIGrid data={overview} isLoading={false} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <NetworkHealthCard data={network} isLoading={false} />
        <BillingSummaryCard data={billing} isLoading={false} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AlertsSummaryCard overview={overview} isLoading={false} />
        <RecentActivityCard />
        <div className="col-span-1 flex flex-col gap-4">
          <WorkerStatusCard />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
