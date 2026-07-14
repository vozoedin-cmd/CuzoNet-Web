
import { useQuery } from '@tanstack/react-query';
import { notificationsService } from '../api/notifications.service';

export function useNotificationTemplates(companyId: string) {
  return useQuery({
    queryKey: ['notification-templates', companyId],
    queryFn: () => notificationsService.getTemplates(companyId),
  });
}
