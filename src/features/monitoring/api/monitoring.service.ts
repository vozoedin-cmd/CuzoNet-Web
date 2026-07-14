
import { apiClient } from '@/services/api/api-client';

export interface MonitoringMetricsDto {
  cpuUsagePercentage: number;
  ramUsagePercentage: number;
  diskUsagePercentage: number;
  temperatureCelsius: number;
  voltage: number;
}

export interface ChartPoint {
  time: string;
  value: number;
}

export interface ThroughputData {
  rx: ChartPoint[];
  tx: ChartPoint[];
}

export interface LatencyData {
  ping: ChartPoint[];
  jitter: ChartPoint[];
  packetLoss: ChartPoint[];
}

export interface DeviceStatus {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'ap';
  status: 'online' | 'warning' | 'offline';
  uptime: string;
}

export interface TopologyHealthDto {
  activeEquipments: number;
  degradedEquipments: number;
  offlineEquipments: number;
  globalAvailability: number;
}

export interface MonitoringEvent {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

export interface MonitoringDashboardDto {
  metrics: MonitoringMetricsDto;
  throughput: ThroughputData;
  latency: LatencyData;
  devices: DeviceStatus[];
  health: TopologyHealthDto;
  events: MonitoringEvent[];
}

export const monitoringService = {
  getDashboard: async (companyId: string) => {
    try {
      return await apiClient.get<MonitoringDashboardDto>('/monitoring/dashboard?companyId=' + companyId);
    } catch (error) {
      if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === "true") {
        console.warn('Usando FIXTURE de desarrollo para monitoreo', error);
        // Retrasamos la importación para que no sea incluida forzosamente en el bundle si no se usa
        const { getDemoFixture } = await import('../model/demo-monitoring.fixture');
        return getDemoFixture();
      }
      throw error;
    }
  }
};
