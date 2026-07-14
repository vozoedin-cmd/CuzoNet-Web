
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../api/notifications.service';

export function useCancelNotification(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => notificationsService.cancel(companyId, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
