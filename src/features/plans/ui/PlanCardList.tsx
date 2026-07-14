
import * as React from "react"
import { PlanDto } from "../api/plans.service"
import { PlanStatusBadge, ServiceTypeBadge, PlanVersionStatusBadge } from "./PlanBadges"
import { usePlansStore } from "../model/plans.store"
import { formatMoney, formatKbps } from "./PlanTable"

export function PlanCardList({ plans }: { plans: PlanDto[] }) {
  const { selectPlan } = usePlansStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {plans.map(p => (
        <div 
          key={p.id} 
          className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors flex flex-col gap-3 relative overflow-hidden"
          onClick={() => selectPlan(p.id)}
        >
          {p.status === 'inactive' && <div className="absolute inset-0 bg-background/50 z-10 pointer-events-none" />}
          
          <div className="flex items-center justify-between border-b pb-2 relative z-20">
            <ServiceTypeBadge type={p.compatibleServiceType} />
            <PlanStatusBadge status={p.status} />
          </div>
          <div className="relative z-20">
            <h4 className="font-mono text-xs leading-tight text-primary font-bold">{p.code}</h4>
            <p className="text-sm font-bold truncate">{p.name}</p>
          </div>
          
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border flex flex-col gap-1 relative z-20">
            <div className="flex justify-between">
              <span>Precio Actual:</span>
              <span className="font-bold text-foreground">
                {p.currentVersion ? formatMoney(p.currentVersion.priceCents, p.currentVersion.currencyCode) : '--'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Velocidad:</span>
              <span className="font-mono">
                {p.currentVersion ? `${formatKbps(p.currentVersion.uploadKbps)}/${formatKbps(p.currentVersion.downloadKbps)}` : '--'}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground flex justify-between items-center relative z-20">
            <span>{p.versionsCount} versiones</span>
            {p.currentVersion && <PlanVersionStatusBadge status={p.currentVersion.status} />}
          </div>
        </div>
      ))}
      {plans.length === 0 && (
        <div className="col-span-1 sm:grid-cols-2 lg:col-span-3 text-center py-8 text-muted-foreground border rounded-xl border-dashed">
          No hay planes comerciales
        </div>
      )}
    </div>
  )
}
