
import * as React from "react"
import ReactECharts from "echarts-for-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LatencyData } from "../api/monitoring.service"
import { Clock } from "lucide-react"
import { useTheme } from "next-themes"

export function LatencyChart({ data }: { data: LatencyData }) {
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
      data: ['Ping (ms)', 'Jitter (ms)'],
      textStyle: { color: textColor },
      bottom: 0
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.ping.map(p => p.time),
      axisLine: { lineStyle: { color: gridLineColor } },
      axisLabel: { color: textColor }
    },
    yAxis: {
      type: 'value',
      name: 'ms',
      nameTextStyle: { color: textColor },
      splitLine: { lineStyle: { color: gridLineColor, type: 'dashed' } },
      axisLabel: { color: textColor }
    },
    series: [
      {
        name: 'Ping (ms)',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#f59e0b', width: 2 },
        itemStyle: { color: '#f59e0b' },
        data: data.ping.map(p => p.value)
      },
      {
        name: 'Jitter (ms)',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#a855f7', width: 2 },
        itemStyle: { color: '#a855f7' },
        data: data.jitter.map(p => p.value)
      }
    ]
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Latencia y Jitter
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
