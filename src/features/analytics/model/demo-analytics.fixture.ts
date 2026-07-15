
import { DashboardOverviewDto, BillingSummaryDto, NetworkHealthDto, ChartDataPoint } from '../api/analytics.service';

export const demoOverview: DashboardOverviewDto = {
  totalActiveClients: 1450,
  totalActiveServices: 1520,
  monthlyExpectedRevenueCents: 52000000,
  activeCriticalAlerts: 3,
  downNetworkNodes: 1,
};

export const demoBillingSummary: BillingSummaryDto = {
  collectedThisMonthCents: 45000000,
  overdueThisMonthCents: 7000000,
  unpaidInvoicesCount: 120,
  collectionRatePercentage: 86.5,
};

export const demoNetworkHealth: NetworkHealthDto = {
  totalEquipments: 85,
  equipmentsDown: 2,
  equipmentsWarning: 5,
  criticalLinks: [
    { id: 'link-1', name: 'Core - Torre Norte', usagePercentage: 92 },
    { id: 'link-2', name: 'Torre Norte - PTP Sur', usagePercentage: 88 }
  ]
};

// Generadores
const generateSeries = (days: number, base1: number, base2: number): ChartDataPoint[] => {
  const result: ChartDataPoint[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    result.push({
      date: d.toISOString().split('T')[0],
      value1: Math.floor(base1 + Math.random() * (base1 * 0.2)),
      value2: Math.floor(base2 + Math.random() * (base2 * 0.2)),
      value3: Math.floor((base1 + base2) * 0.1 * Math.random())
    });
  }
  return result;
}

export const getDemoRevenueTrend = (range: string): ChartDataPoint[] => generateSeries(range === '7d' ? 7 : 30, 15000, 2000);
export const getDemoClientGrowth = (range: string): ChartDataPoint[] => generateSeries(range === '7d' ? 7 : 30, 5, 2);
export const getDemoNetworkAvailability = (range: string): ChartDataPoint[] => {
  const days = range === '7d' ? 7 : 30;
  return Array.from({length: days}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - i));
    return {
      date: d.toISOString().split('T')[0],
      value1: 99 + Math.random(), // 99-100%
      value2: Math.random() * 2 // 0-2% degraded
    };
  });
};
export const getDemoAlertTrend = (range: string): ChartDataPoint[] => generateSeries(range === '7d' ? 7 : 30, 10, 5);

export const demoServiceDistribution = [
  { name: 'Simple Queue (RouterOS)', value: 850 },
  { name: 'PPPoE', value: 600 },
  { name: 'Hotspot', value: 70 },
];
