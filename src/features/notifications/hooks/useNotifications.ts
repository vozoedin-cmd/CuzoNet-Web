
import { useQuery } from '@tanstack/react-query';
import { notificationsService, GetNotificationsParams } from '../api/notifications.service';

export function useNotifications(companyId: string, params: GetNotificationsParams) {
  return useQuery({
    queryKey: ['notifications', companyId, params],
    queryFn: () => notificationsService.getNotifications(companyId, params),
    refetchInterval: 20000,
  });
}
