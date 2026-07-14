
import * as React from "react"
import { NotificationDto } from "../api/notifications.service"
import { NotificationStatusBadge, NotificationChannelBadge } from "./NotificationBadges"
import { useNotificationsStore } from "../model/notifications.store"

export function NotificationTable({ notifications }: { notifications: NotificationDto[] }) {
  const { selectNotification } = useNotificationsStore();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Asunto / Template</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Canales</th>
            <th className="px-4 py-3 font-medium">Destinatarios</th>
            <th className="px-4 py-3 font-medium text-center">Entregas/Intentos</th>
            <th className="px-4 py-3 font-medium">Creada</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {notifications.map(notif => (
            <tr 
              key={notif.id} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectNotification(notif.id)}
            >
              <td className="px-4 py-3">
                <p className="font-semibold">{notif.subject}</p>
                <p className="text-xs text-muted-foreground">{notif.templateCode}</p>
              </td>
              <td className="px-4 py-3"><NotificationStatusBadge status={notif.status} /></td>
              <td className="px-4 py-3">
                <div className="flex gap-1 flex-wrap">
                  {notif.channels.map(ch => <NotificationChannelBadge key={ch} channel={ch} />)}
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="text-xs text-muted-foreground">{notif.recipients.join(', ')}</p>
              </td>
              <td className="px-4 py-3 text-center font-medium">
                {notif.deliveries}/{notif.attempts}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(notif.createdAt)}</td>
            </tr>
          ))}
          {notifications.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                No se encontraron notificaciones.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
