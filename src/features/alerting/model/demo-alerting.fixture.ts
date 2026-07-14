
import { AlertDto, AlertDetailsDto, AlertStatsDto } from '../api/alerting.service';

export const getDemoAlerts = (): { alerts: AlertDto[], stats: AlertStatsDto } => {
  const alerts: AlertDto[] = [
    {
      id: 'alrt-001',
      title: 'BGP Session Down',
      severity: 'critical',
      status: 'open',
      category: 'network',
      source: 'monitoring',
      equipmentId: 'eq-router-01',
      nodeId: 'n-core-norte',
      occurrences: 3,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      lastOccurredAt: new Date(Date.now() - 120000).toISOString(),
    },
    {
      id: 'alrt-002',
      title: 'High CPU Usage',
      severity: 'warning',
      status: 'acknowledged',
      category: 'system',
      source: 'monitoring',
      equipmentId: 'eq-server-05',
      occurrences: 15,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      lastOccurredAt: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: 'alrt-003',
      title: 'Power Supply Failure',
      severity: 'emergency',
      status: 'open',
      category: 'hardware',
      source: 'inventory',
      equipmentId: 'eq-olt-02',
      nodeId: 'n-olt-centro',
      occurrences: 1,
      createdAt: new Date(Date.now() - 150000).toISOString(),
      lastOccurredAt: new Date(Date.now() - 150000).toISOString(),
    },
    {
      id: 'alrt-004',
      title: 'Backup Failed',
      severity: 'info',
      status: 'resolved',
      category: 'automation',
      source: 'workers',
      occurrences: 1,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      lastOccurredAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const stats: AlertStatsDto = {
    open: 2,
    critical: 1,
    acknowledged: 1,
    resolvedToday: 5,
  };

  return { alerts, stats };
};

export const getDemoAlertDetails = (id: string): AlertDetailsDto => {
  const base = getDemoAlerts().alerts.find(a => a.id === id) || getDemoAlerts().alerts[0];
  
  return {
    ...base,
    fingerprint: 'fp-' + Math.random().toString(36).substr(2, 9),
    description: 'Descripción detallada del incidente generada automáticamente por el sistema de monitoreo. Se detectaron anomalías en los umbrales predefinidos.',
    context: {
      clientImpact: 150,
      region: 'Norte',
      affectedServices: ['Internet Dedicado', 'FTTH']
    },
    timeline: [
      { id: 't1', action: 'created', timestamp: base.createdAt, message: 'Alerta detectada por el sistema' },
      { id: 't2', action: 'occurred', timestamp: base.lastOccurredAt, message: 'Nueva ocurrencia del mismo fingerprint' }
    ]
  };
};
