
import { useQuery } from '@tanstack/react-query';
import { notificationsService } from '../api/notifications.service';

export function useNotification(companyId: string, notificationId: string | null) {
  return useQuery({
    queryKey: ['notifications', 'detail', companyId, notificationId],
    queryFn: () => notificationsService.getNotification(companyId, notificationId!),
    enabled: !!notificationId,
  });
}
