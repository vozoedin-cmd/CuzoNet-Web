
import * as React from "react"
import { useAlertingStore } from "../model/alerting.store"
import { useAlert } from "../hooks/useAlert"
import { AlertSeverityBadge, AlertStatusBadge } from "./AlertBadges"
import { AlertTimeline } from "./AlertTimeline"
import { AlertActions } from "./AlertActions"
import { X, Fingerprint, MapPin, Hash, ShieldAlert } from "lucide-react"

export function AlertDetailsDrawer({ companyId }: { companyId: string }) {
  const { selectedAlertId, drawerOpen, setDrawerOpen } = useAlertingStore();
  const { data, isLoading, isError } = useAlert(companyId, selectedAlertId);

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
            Detalle de Alerta
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
                <h3 className="text-2xl font-extrabold mb-2">{data.title}</h3>
                <div className="flex gap-2">
                  <AlertSeverityBadge severity={data.severity} />
                  <AlertStatusBadge status={data.status} />
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg border">
                {data.description}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Hash className="h-3 w-3" /> Categoría</span>
                  <p className="font-medium capitalize">{data.category}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Fingerprint className="h-3 w-3" /> Fingerprint</span>
                  <p className="font-mono text-xs">{data.fingerprint}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Origen</span>
                  <p className="font-medium">{data.source}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Ocurrencias</span>
                  <p className="font-medium">{data.occurrences}</p>
                </div>
              </div>

              {data.context && (
                <div className="p-4 border rounded-xl bg-card">
                  <h4 className="font-semibold mb-2 text-sm">Contexto del Evento</h4>
                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                    {JSON.stringify(data.context, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Línea de Tiempo</h4>
              <AlertTimeline timeline={data.timeline} />
            </div>

            <div className="mt-auto pt-6">
              <AlertActions companyId={companyId} alertId={data.id} status={data.status} />
            </div>
          </>
        )}
      </div>
    </>
  )
}
