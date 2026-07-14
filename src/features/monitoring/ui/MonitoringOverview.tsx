
"use client"

import * as React from "react"
import { Activity } from "lucide-react"
import { useMonitoring } from "../hooks/useMonitoring"
import { MetricCard } from "./MetricCard"
import { ThroughputChart } from "./ThroughputChart"
import { LatencyChart } from "./LatencyChart"
import { DeviceStatusGrid } from "./DeviceStatusGrid"
import { TopologyHealthSummary } from "./TopologyHealthSummary"
import { MonitoringTimeline } from "./MonitoringTimeline"
import { MonitoringSkeleton, MonitoringError, MonitoringEmpty } from "./MonitoringStates"

export function MonitoringOverview() {
  const companyId = "mock-company";
  const { data, isLoading, isError, error } = useMonitoring(companyId);

  if (isLoading) return <MonitoringSkeleton />;
  if (isError) return <MonitoringError error={error as Error} />;
  if (!data) return <MonitoringEmpty />;

  const isDemo = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

  return (
    <div className="space-y-6 relative">
      {isDemo && (
        <div className="bg-amber-500/20 text-amber-500 border border-amber-500/50 px-3 py-1 text-xs font-bold rounded-md w-max flex items-center gap-2 mb-2 uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <Activity className="h-4 w-4" /> DATOS DEMO
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard type="cpu" value={data.metrics.cpuUsagePercentage} />
        <MetricCard type="ram" value={data.metrics.ramUsagePercentage} />
        <MetricCard type="disk" value={data.metrics.diskUsagePercentage} />
        <MetricCard type="temp" value={data.metrics.temperatureCelsius} />
        <MetricCard type="voltage" value={data.metrics.voltage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ThroughputChart data={data.throughput} />
        <LatencyChart data={data.latency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DeviceStatusGrid devices={data.devices} />
        <div className="flex flex-col gap-4">
          <TopologyHealthSummary health={data.health} />
          {/* Espacio para futuros micro-widgets */}
        </div>
        <MonitoringTimeline events={data.events} />
      </div>
    </div>
  )
}
