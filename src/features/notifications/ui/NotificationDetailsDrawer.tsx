
import * as React from "react"
import { useNotificationsStore } from "../model/notifications.store"
import { useNotification } from "../hooks/useNotification"
import { NotificationStatusBadge, NotificationChannelBadge } from "./NotificationBadges"
import { DeliveryTimeline } from "./DeliveryTimeline"
import { NotificationActions } from "./NotificationActions"
import { X, Fingerprint, FileText, Hash, ShieldAlert } from "lucide-react"

export function NotificationDetailsDrawer({ companyId }: { companyId: string }) {
  const { selectedNotificationId, drawerOpen, setDrawerOpen } = useNotificationsStore();
  const { data, isLoading, isError } = useNotification(companyId, selectedNotificationId);

  if (!drawerOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" 
        onClick={() => setDrawerOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l bg-background shadow-2xl p-6 overflow-y-auto flex flex-col gap-6 animate-in slide-in-from-right-full duration-300">
        
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Rastreo de Envío
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading && <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-32 bg-muted rounded w-full" />
        </div>}

        {isError && <div className="text-red-500">Error cargando detalles.</div>}

        {!isLoading && !isError && data && (
          <>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-extrabold mb-2 leading-tight">{data.subject}</h3>
                <div className="flex gap-2">
                  <NotificationStatusBadge status={data.status} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg border">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs"><FileText className="h-3 w-3" /> Plantilla</span>
                  <p className="font-medium text-xs truncate">{data.templateCode} v{data.templateVersion}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs"><Fingerprint className="h-3 w-3" /> Correlation ID</span>
                  <p className="font-mono text-[10px]">{data.correlationId}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs"><Hash className="h-3 w-3" /> Idempotency Key</span>
                  <p className="font-mono text-[10px]">{data.idempotencyKey}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Destinatarios</h4>
                <div className="bg-card border rounded-lg p-3 text-xs text-muted-foreground break-all">
                  {data.recipients.join(', ')}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Estado por Canal</h4>
                <div className="space-y-2">
                  {data.deliveriesByChannel.map((del, i) => (
                    <div key={i} className="flex flex-col gap-1 p-2 border rounded bg-card/50">
                      <div className="flex items-center justify-between">
                        <NotificationChannelBadge channel={del.channel} />
                        <NotificationStatusBadge status={del.status} />
                      </div>
                      {del.error && (
                        <p className="text-[10px] text-red-500 font-mono mt-1 p-1 bg-red-500/10 rounded">{del.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Línea de Tiempo (Worker)</h4>
              <DeliveryTimeline timeline={data.timeline} />
            </div>

            <div className="mt-auto pt-6">
              <NotificationActions companyId={companyId} notificationId={data.id} status={data.status} />
            </div>
          </>
        )}
      </div>
    </>
  )
}
