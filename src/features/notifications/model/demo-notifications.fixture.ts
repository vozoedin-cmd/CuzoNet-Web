
import { NotificationDto, NotificationDetailsDto, NotificationStatsDto, NotificationTemplateDto } from '../api/notifications.service';

const maskString = (str: string) => {
  if (str.includes('@')) {
    const [name, domain] = str.split('@');
    return `${name.substring(0, 2)}***@${domain}`;
  }
  if (str.match(/^\+?[0-9]{10,14}$/)) {
    return str.substring(0, 4) + '****' + str.substring(str.length - 2);
  }
  return str.substring(0, 3) + '...';
}

export const getDemoNotifications = (): { notifications: NotificationDto[], stats: NotificationStatsDto } => {
  const notifications: NotificationDto[] = [
    {
      id: 'notf-001',
      subject: 'Alerta Crítica: Caída de Enlace',
      templateCode: 'ALERT_CRITICAL',
      channels: ['whatsapp', 'email'],
      recipients: [maskString('+523312345678'), maskString('admin@cuzonet.com')],
      status: 'failed',
      deliveries: 0,
      attempts: 3,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3500000).toISOString(),
    },
    {
      id: 'notf-002',
      subject: 'Recordatorio de Pago',
      templateCode: 'BILLING_REMINDER',
      channels: ['email'],
      recipients: [maskString('cliente@gmail.com')],
      status: 'sent',
      deliveries: 1,
      attempts: 1,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86390000).toISOString(),
    },
    {
      id: 'notf-003',
      subject: 'Ticket de Soporte Actualizado',
      templateCode: 'SUPPORT_TICKET_UPDATE',
      channels: ['telegram'],
      recipients: [maskString('@usuario_tele')],
      status: 'pending',
      deliveries: 0,
      attempts: 0,
      createdAt: new Date(Date.now() - 150000).toISOString(),
      updatedAt: new Date(Date.now() - 150000).toISOString(),
    },
    {
      id: 'notf-004',
      subject: 'Sincronización OLT',
      templateCode: 'SYSTEM_WEBHOOK',
      channels: ['webhook'],
      recipients: ['https://ext-sys.local/webhook'],
      status: 'partial',
      deliveries: 1,
      attempts: 2,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7100000).toISOString(),
    },
  ];

  const stats: NotificationStatsDto = {
    pending: 12,
    sent: 1450,
    partial: 3,
    failed: 5,
  };

  return { notifications, stats };
};

export const getDemoNotificationDetails = (id: string): NotificationDetailsDto => {
  const base = getDemoNotifications().notifications.find(a => a.id === id) || getDemoNotifications().notifications[0];
  
  return {
    ...base,
    templateVersion: '1.2.0',
    correlationId: 'corr-' + Math.random().toString(36).substr(2, 9),
    idempotencyKey: 'idemp-****-****-' + Math.random().toString(36).substr(2, 4),
    deliveriesByChannel: base.channels.map(ch => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      channel: ch as any,
      status: base.status === 'sent' ? 'sent' : base.status === 'partial' ? (Math.random() > 0.5 ? 'sent' : 'failed') : base.status,
      error: base.status === 'failed' ? '[SANITIZED] Error de timeout en proveedor externo' : undefined
    })),
    timeline: [
      { id: 't1', action: 'queued' as const, timestamp: base.createdAt, details: 'Encolado para procesamiento' },
      { id: 't2', action: 'claimed' as const, timestamp: base.createdAt, details: 'Worker asignado' },
      ...(base.status === 'failed' ? [{ id: 't3', action: 'failed' as const, timestamp: base.updatedAt, details: 'Fallo al entregar (Reintentos: 3)' }] : []),
      ...(base.status === 'sent' ? [{ id: 't4', action: 'sent' as const, timestamp: base.updatedAt, details: 'Entregado a todos los proveedores' }] : []),
    ]
  };
};

export const getDemoTemplates = (): NotificationTemplateDto[] => [
  { id: 'tpl-1', code: 'ALERT_CRITICAL', version: '1.2.0', status: 'active', supportedChannels: ['email', 'whatsapp', 'telegram'] },
  { id: 'tpl-2', code: 'BILLING_REMINDER', version: '2.0.1', status: 'active', supportedChannels: ['email', 'whatsapp'] },
  { id: 'tpl-3', code: 'SYSTEM_WEBHOOK', version: '1.0.0', status: 'active', supportedChannels: ['webhook'] },
  { id: 'tpl-4', code: 'PROMO_CAMPAIGN', version: '1.0.0', status: 'draft', supportedChannels: ['email'] },
];
