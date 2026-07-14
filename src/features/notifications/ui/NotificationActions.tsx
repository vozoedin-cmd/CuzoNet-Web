
import * as React from "react"
import { Button } from "@/components/ui/button"
import { NotificationStatus } from "../api/notifications.service"
import { useCancelNotification } from "../hooks/useNotificationMutations"
import { XCircle } from "lucide-react"

interface NotificationActionsProps {
  companyId: string;
  notificationId: string;
  status: NotificationStatus;
}

export function NotificationActions({ companyId, notificationId, status }: NotificationActionsProps) {
  const cancelMutation = useCancelNotification(companyId);

  const canCancel = status === 'pending' || status === 'processing';

  const handleCancel = () => {
    if (confirm("¿Estás seguro de cancelar esta notificación en tránsito?")) {
      cancelMutation.mutate(notificationId);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="destructive" 
        className="w-full flex items-center gap-2" 
        disabled={!canCancel || cancelMutation.isPending}
        onClick={handleCancel}
      >
        <XCircle className="h-4 w-4" /> 
        {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar Envío'}
      </Button>
    </div>
  )
}
