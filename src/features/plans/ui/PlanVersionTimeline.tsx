
import * as React from "react"
import { PlanVersionDto } from "../api/plans.service"
import { PlanVersionStatusBadge } from "./PlanBadges"
import { formatMoney, formatKbps } from "./PlanTable"
import { FileEdit, CheckCircle2 } from "lucide-react"

export function PlanVersionTimeline({ versions }: { versions: PlanVersionDto[] }) {
  const sorted = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
      {sorted.map(v => (
        <div key={v.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            {v.status === 'published' ? <CheckCircle2 className="w-4 h-4 text-blue-500" /> : <FileEdit className="w-4 h-4 text-amber-500" />}
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm">v{v.versionNumber}</h4>
              <PlanVersionStatusBadge status={v.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block">Precio</span>
                <span className="font-bold">{formatMoney(v.priceCents, v.currencyCode)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Velocidad</span>
                <span className="font-mono">{formatKbps(v.uploadKbps)} / {formatKbps(v.downloadKbps)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Creada</span>
                <span>{new Date(v.createdAt).toLocaleDateString()}</span>
              </div>
              {v.publishedAt && (
                <div>
                  <span className="text-muted-foreground block">Publicada</span>
                  <span>{new Date(v.publishedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
