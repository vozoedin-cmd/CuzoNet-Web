
"use client"

import * as React from "react"
import { useNotificationsStore } from "../model/notifications.store"
import { useNotifications } from "../hooks/useNotifications"
import { NotificationStatsGrid } from "./NotificationStatsGrid"
import { NotificationFilters } from "./NotificationFilters"
import { NotificationTable } from "./NotificationTable"
import { NotificationCardList } from "./NotificationCardList"
import { NotificationDetailsDrawer } from "./NotificationDetailsDrawer"
import { TemplateListCard } from "./TemplateListCard"
import { NotificationsSkeleton, NotificationsError, NotificationsEmpty } from "./NotificationsStates"
import { Activity, LayoutList, LayoutGrid } from "lucide-react"

export function NotificationsOverview() {
  const companyId = "mock-company";
  
  const { filters, viewMode, setViewMode } = useNotificationsStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading, isError, error } = useNotifications(companyId, filters as any);

  const isDemo = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

  if (isLoading) return <NotificationsSkeleton />;
  if (isError) return <NotificationsError error={error as Error} />;

  return (
    <div className="space-y-6 relative pb-10">
      {isDemo && (
        <div className="bg-amber-500/20 text-amber-500 border border-amber-500/50 px-3 py-1 text-xs font-bold rounded-md w-max flex items-center gap-2 mb-2 uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <Activity className="h-4 w-4" /> DATOS DEMO
        </div>
      )}

      <NotificationStatsGrid stats={data?.stats} />
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-5/6">
          <NotificationFilters />
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:col-span-3">
          {data?.notifications.length === 0 ? (
            <NotificationsEmpty />
          ) : (
            viewMode === 'table' ? 
              <div className="hidden md:block"><NotificationTable notifications={data?.notifications || []} /></div> : 
              <NotificationCardList notifications={data?.notifications || []} />
          )}
          
          {/* Mobile constraint */}
          {viewMode === 'table' && data?.notifications.length !== 0 && (
            <div className="block md:hidden">
              <NotificationCardList notifications={data?.notifications || []} />
            </div>
          )}
        </div>
        <div className="col-span-1 lg:col-span-1">
          <TemplateListCard companyId={companyId} />
        </div>
      </div>

      <NotificationDetailsDrawer companyId={companyId} />
    </div>
  )
}
