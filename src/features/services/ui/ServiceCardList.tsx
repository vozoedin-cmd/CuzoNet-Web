
import * as React from "react"
import { ServiceDto } from "../api/services.service"
import { ServiceLifecycleStatusBadge, ServiceTypeBadge } from "./ServiceBadges"
import { useServicesStore } from "../model/services.store"

export function ServiceCardList({ services }: { services: ServiceDto[] }) {
  const { selectService } = useServicesStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map(srv => (
        <div 
          key={srv.id} 
          className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors flex flex-col gap-3"
          onClick={() => selectService(srv.id)}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <ServiceTypeBadge type={srv.type} />
            <ServiceLifecycleStatusBadge status={srv.lifecycleStatus} />
          </div>
          <div>
            <h4 className="font-mono text-sm leading-tight text-muted-foreground">{srv.id}</h4>
            <p className="text-sm font-bold uppercase">{srv.planVersionId}</p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border flex justify-between">
            <span>Cliente: {srv.clientId}</span>
            <span className="font-bold">Fact. Día {srv.billingDay}</span>
          </div>
          <div className="text-[10px] text-muted-foreground">Tech: {srv.technicalStatus || 'Sin información técnica'}</div>
        </div>
      ))}
      {services.length === 0 && (
        <div className="col-span-1 sm:grid-cols-2 lg:col-span-3 text-center py-8 text-muted-foreground border rounded-xl border-dashed">
          No hay servicios
        </div>
      )}
    </div>
  )
}
