
import * as React from "react"
import { useNotificationTemplates } from "../hooks/useNotificationTemplates"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileCode2 } from "lucide-react"
import { NotificationChannelBadge } from "./NotificationBadges"
import { Skeleton } from "@/components/ui/skeleton"

export function TemplateListCard({ companyId }: { companyId: string }) {
  const { data, isLoading, isError } = useNotificationTemplates(companyId);

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode2 className="h-5 w-5 text-primary" />
          Plantillas Registradas
        </CardTitle>
        <CardDescription>Catálogo disponible para workers</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>}
        {isError && <div className="text-red-500 text-sm">Error cargando plantillas.</div>}
        {!isLoading && !isError && data && (
          <div className="space-y-3">
            {data.map(tpl => (
              <div key={tpl.id} className="p-3 border rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm">{tpl.code}</h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${tpl.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                    {tpl.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">v{tpl.version}</span>
                  <div className="flex gap-1">
                    {tpl.supportedChannels.map(ch => <NotificationChannelBadge key={ch} channel={ch} />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
