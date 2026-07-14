
import { apiClient } from '@/services/api/api-client';

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';
export type AlertStatus = 'open' | 'acknowledged' | 'resolved' | 'closed' | 'suppressed';

export interface AlertDto {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  category: string;
  source: string;
  equipmentId?: string;
  nodeId?: string;
  occurrences: number;
  createdAt: string;
  lastOccurredAt: string;
}

export interface AlertStatsDto {
  open: number;
  critical: number;
  acknowledged: number;
  resolvedToday: number;
}

export interface AlertTimelineEvent {
  id: string;
  action: string;
  timestamp: string;
  message: string;
  actor?: string;
}

export interface AlertDetailsDto extends AlertDto {
  fingerprint: string;
  description: string;
  context?: Record<string, unknown>;
  timeline: AlertTimelineEvent[];
}

export interface GetAlertsParams {
  severity?: string;
  status?: string;
  category?: string;
  source?: string;
  equipmentId?: string;
  nodeId?: string;
  page?: number;
  limit?: number;
}

export interface GetAlertsResponse {
  alerts: AlertDto[];
  stats: AlertStatsDto;
  total: number;
}

const isDemo = () => process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

export const alertingService = {
  getAlerts: async (companyId: string, params: GetAlertsParams): Promise<GetAlertsResponse> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query = new URLSearchParams(params as any).toString();
      return await apiClient.get<GetAlertsResponse>(`/alerts?companyId=${companyId}&${query}`);
    } catch (error) {
      if (isDemo()) {
        const { getDemoAlerts } = await import('../model/demo-alerting.fixture');
        const data = getDemoAlerts();
        let filtered = data.alerts;
        if (params.severity) filtered = filtered.filter(a => a.severity === params.severity);
        if (params.status) filtered = filtered.filter(a => a.status === params.status);
        if (params.category) filtered = filtered.filter(a => a.category.includes(params.category!));
        
        return { alerts: filtered, stats: data.stats, total: filtered.length };
      }
      throw error;
    }
  },

  getAlert: async (companyId: string, alertId: string): Promise<AlertDetailsDto> => {
    try {
      return await apiClient.get<AlertDetailsDto>(`/alerts/${alertId}?companyId=${companyId}`);
    } catch (error) {
      if (isDemo()) {
        const { getDemoAlertDetails } = await import('../model/demo-alerting.fixture');
        return getDemoAlertDetails(alertId);
      }
      throw error;
    }
  },

  acknowledge: async (companyId: string, alertId: string): Promise<void> => {
    try {
      // POST without expecting JSON return body if standard 200/204
      const res = await fetch(`/api/alerts/${alertId}/acknowledge?companyId=${companyId}`, { method: 'POST' });
      if (!res.ok) throw new Error('Error acknowledging alert');
    } catch (error) {
      if (isDemo()) return; // Fake success
      throw error;
    }
  },

  resolve: async (companyId: string, alertId: string): Promise<void> => {
    try {
      const res = await fetch(`/api/alerts/${alertId}/resolve?companyId=${companyId}`, { method: 'POST' });
      if (!res.ok) throw new Error('Error resolving alert');
    } catch (error) {
      if (isDemo()) return;
      throw error;
    }
  }
};
