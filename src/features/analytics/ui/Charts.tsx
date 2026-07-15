
import * as React from "react"
import ReactECharts from "echarts-for-react"
import { ChartDataPoint } from "../api/analytics.service"

export function NotAvailableOverlay({ message = "Métrica no disponible" }: { message?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-[2px] z-10 rounded-xl">
      <div className="bg-background border px-4 py-2 rounded-lg text-sm text-muted-foreground font-medium shadow-sm">
        {message}
      </div>
    </div>
  )
}

export function RevenueTrendChart({ data }: { data?: ChartDataPoint[] | null }) {
  if (!data) {
    return (
      <div className="relative h-[300px] w-full border rounded-xl bg-card">
        <NotAvailableOverlay message="Endpoint de tendencia de ingresos no existe" />
      </div>
    );
  }

  const option = {
    tooltip: { trigger: 'axis', backgroundColor: '#18181b', textStyle: { color: '#fafafa' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: data.map(d => d.date) },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#27272a' } } },
    series: [
      {
        name: 'Ingresos',
        type: 'line',
        smooth: true,
        data: data.map(d => d.value1),
        itemStyle: { color: '#22c55e' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(34, 197, 94, 0.5)' }, { offset: 1, color: 'rgba(34, 197, 94, 0)' }] } }
      }
    ]
  };

  return <div className="border rounded-xl bg-card p-4"><ReactECharts option={option} style={{ height: '300px', width: '100%' }} theme="dark" /></div>;
}

export function ClientGrowthChart({ data }: { data?: ChartDataPoint[] | null }) {
  if (!data) return <div className="relative h-[300px] w-full border rounded-xl bg-card"><NotAvailableOverlay message="Endpoint de crecimiento de clientes no existe" /></div>;
  
  const option = {
    tooltip: { trigger: 'axis', backgroundColor: '#18181b', textStyle: { color: '#fafafa' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: data.map(d => d.date) },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#27272a' } } },
    series: [
      { name: 'Altas', type: 'bar', data: data.map(d => d.value1), itemStyle: { color: '#3b82f6' } },
      { name: 'Archivados', type: 'bar', data: data.map(d => d.value2), itemStyle: { color: '#ef4444' } }
    ]
  };

  return <div className="border rounded-xl bg-card p-4"><ReactECharts option={option} style={{ height: '300px', width: '100%' }} theme="dark" /></div>;
}
