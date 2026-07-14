
import * as React from "react"
import ReactECharts from "echarts-for-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThroughputData } from "../api/monitoring.service"
import { Activity } from "lucide-react"
import { useTheme } from "next-themes"

export function ThroughputChart({ data }: { data: ThroughputData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (typeof window !== 'undefined' && document.documentElement.classList.contains('dark'));
  
  const textColor = isDark ? '#a1a1aa' : '#52525b';
  const gridLineColor = isDark ? '#27272a' : '#e4e4e7';

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: isDark ? '#27272a' : '#e4e4e7',
      textStyle: { color: isDark ? '#f4f4f5' : '#18181b' }
    },
    legend: {
      data: ['Rx (Download)', 'Tx (Upload)'],
      textStyle: { color: textColor },
      bottom: 0
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.rx.map(p => p.time),
      axisLine: { lineStyle: { color: gridLineColor } },
      axisLabel: { color: textColor }
    },
    yAxis: {
      type: 'value',
      name: 'Mbps',
      nameTextStyle: { color: textColor },
      splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
      axisLabel: { color: textColor }
    },
    series: [
      {
        name: 'Rx (Download)',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(34,197,94,0.5)' }, { offset: 1, color: 'rgba(34,197,94,0.01)' }]
          }
        },
        lineStyle: { color: '#22c55e', width: 2 },
        itemStyle: { color: '#22c55e' },
        data: data.rx.map(p => p.value)
      },
      {
        name: 'Tx (Upload)',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(59,130,246,0.5)' }, { offset: 1, color: 'rgba(59,130,246,0.01)' }]
          }
        },
        lineStyle: { color: '#3b82f6', width: 2 },
        itemStyle: { color: '#3b82f6' },
        data: data.tx.map(p => p.value)
      }
    ]
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Tráfico Global (Throughput)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} theme={isDark ? 'dark' : 'light'} />
        </div>
      </CardContent>
    </Card>
  )
}
