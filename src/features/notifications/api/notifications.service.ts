
import { apiClient } from '@/services/api/api-client';

export type NotificationStatus = 'pending' | 'processing' | 'sent' | 'partial' | 'failed' | 'cancelled';
export type NotificationChannel = 'whatsapp' | 'telegram' | 'email' | 'webhook';

export interface NotificationDto {
  id: string;
  subject: string;
  templateCode: string;
  channels: NotificationChannel[];
  recipients: string[];
  status: NotificationStatus;
  deliveries: number;
  attempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStatsDto {
  pending: number;
  sent: number;
  partial: number;
  failed: number;
}

export interface DeliveryTimelineEvent {
  id: string;
  action: 'queued' | 'claimed' | 'sent' | 'failed' | 'retried' | 'cancelled';
  timestamp: string;
  details?: string;
}

export interface ChannelDelivery {
  channel: NotificationChannel;
  status: NotificationStatus;
  error?: string;
}

export interface NotificationDetailsDto extends NotificationDto {
  templateVersion: string;
  correlationId: string;
  idempotencyKey: string;
  deliveriesByChannel: ChannelDelivery[];
  timeline: DeliveryTimelineEvent[];
}

export interface NotificationTemplateDto {
  id: string;
  code: string;
  version: string;
  status: 'active' | 'draft' | 'archived';
  supportedChannels: NotificationChannel[];
}

export interface GetNotificationsParams {
  status?: string;
  channel?: string;
  recipient?: string;
  templateCode?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface GetNotificationsResponse {
  notifications: NotificationDto[];
  stats: NotificationStatsDto;
  total: number;
}

const isDemo = () => process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

export const notificationsService = {
  getNotifications: async (companyId: string, params: GetNotificationsParams): Promise<GetNotificationsResponse> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query = new URLSearchParams(params as any).toString();
      return await apiClient.get<GetNotificationsResponse>(`/notificaciones?companyId=${companyId}&${query}`);
    } catch (error) {
      if (isDemo()) {
        const { getDemoNotifications } = await import('../model/demo-notifications.fixture');
        const data = getDemoNotifications();
        let filtered = data.notifications;
        if (params.status) filtered = filtered.filter(n => n.status === params.status);
        if (params.channel) filtered = filtered.filter(n => n.channels.includes(params.channel as NotificationChannel));
        if (params.templateCode) filtered = filtered.filter(n => n.templateCode.includes(params.templateCode!));
        
        return { notifications: filtered, stats: data.stats, total: filtered.length };
      }
      throw error;
    }
  },

  getNotification: async (companyId: string, notificationId: string): Promise<NotificationDetailsDto> => {
    try {
      return await apiClient.get<NotificationDetailsDto>(`/notificaciones/${notificationId}?companyId=${companyId}`);
    } catch (error) {
      if (isDemo()) {
        const { getDemoNotificationDetails } = await import('../model/demo-notifications.fixture');
        return getDemoNotificationDetails(notificationId);
      }
      throw error;
    }
  },

  cancel: async (companyId: string, notificationId: string): Promise<void> => {
    try {
      await apiClient.post<void>(`/notificaciones/${notificationId}/cancelacion?companyId=${companyId}`);
    } catch (error) {
      if (isDemo()) return;
      throw error;
    }
  },

  getTemplates: async (companyId: string): Promise<NotificationTemplateDto[]> => {
    try {
      return await apiClient.get<NotificationTemplateDto[]>(`/plantillas-notificacion?companyId=${companyId}`);
    } catch (error) {
      if (isDemo()) {
        const { getDemoTemplates } = await import('../model/demo-notifications.fixture');
        return getDemoTemplates();
      }
      throw error;
    }
  }
};
