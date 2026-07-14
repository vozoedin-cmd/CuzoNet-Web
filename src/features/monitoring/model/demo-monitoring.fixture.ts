
import { MonitoringDashboardDto, ChartPoint } from '../api/monitoring.service';

const generateTimeseries = (count: number, base: number, variance: number) => {
  const data: ChartPoint[] = [];
  const now = new Date();
  for (let i = count; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60000);
    data.push({
      time: `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}`,
      value: Math.max(0, base + (Math.random() * variance * 2 - variance))
    });
  }
  return data;
};

export const getDemoFixture = (): MonitoringDashboardDto => ({
  metrics: {
    cpuUsagePercentage: 42,
    ramUsagePercentage: 68,
    diskUsagePercentage: 25,
    temperatureCelsius: 45,
    voltage: 12.1
  },
  throughput: {
    rx: generateTimeseries(60, 500, 150),
    tx: generateTimeseries(60, 200, 80)
  },
  latency: {
    ping: generateTimeseries(60, 25, 5),
    jitter: generateTimeseries(60, 2, 1),
    packetLoss: generateTimeseries(60, 0, 0.5).map(p => ({ time: p.time, value: Math.max(0, Math.floor(p.value)) }))
  },
  devices: [
    { id: '1', name: 'Core Norte', type: 'router', status: 'online', uptime: '45d 12h' },
    { id: '2', name: 'Core Sur', type: 'router', status: 'online', uptime: '12d 4h' },
    { id: '3', name: 'Dist. Este', type: 'switch', status: 'warning', uptime: '2d 1h' },
    { id: '4', name: 'AP Central', type: 'ap', status: 'offline', uptime: '0d 0h' },
  ],
  health: {
    activeEquipments: 145,
    degradedEquipments: 12,
    offlineEquipments: 3,
    globalAvailability: 99.1
  },
  events: [
    { id: 'e1', type: 'error', message: 'Caída de tensión en Nodo 4', timestamp: 'Hace 5 min' },
    { id: 'e2', type: 'warning', message: 'Latencia alta en Enlace BGP', timestamp: 'Hace 12 min' },
    { id: 'e3', type: 'info', message: 'Respaldo automático completado', timestamp: 'Hace 45 min' },
  ]
});
