
import * as React from "react"
import { NotificationDto } from "../api/notifications.service"
import { NotificationStatusBadge, NotificationChannelBadge } from "./NotificationBadges"
import { useNotificationsStore } from "../model/notifications.store"

export function NotificationCardList({ notifications }: { notifications: NotificationDto[] }) {
  const { selectNotification } = useNotificationsStore();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notifications.map(notif => (
        <div 
          key={notif.id} 
          className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors flex flex-col gap-3"
          onClick={() => selectNotification(notif.id)}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <NotificationStatusBadge status={notif.status} />
            <span className="text-[10px] text-muted-foreground">{formatDate(notif.createdAt)}</span>
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">{notif.subject}</h4>
            <p className="text-xs text-muted-foreground mt-1">{notif.templateCode}</p>
          </div>
          <div className="flex gap-1 flex-wrap">
            {notif.channels.map(ch => <NotificationChannelBadge key={ch} channel={ch} />)}
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded truncate border">
            {notif.recipients.join(', ')}
          </div>
        </div>
      ))}
      {notifications.length === 0 && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 text-muted-foreground border rounded-xl border-dashed">
          No hay notificaciones
        </div>
      )}
    </div>
  )
}
