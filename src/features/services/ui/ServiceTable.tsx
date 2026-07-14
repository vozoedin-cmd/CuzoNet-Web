
import * as React from "react"
import { ServiceDto } from "../api/services.service"
import { ServiceLifecycleStatusBadge, ServiceTypeBadge } from "./ServiceBadges"
import { useServicesStore } from "../model/services.store"

export function ServiceTable({ services }: { services: ServiceDto[] }) {
  const { selectService } = useServicesStore();

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString();
  }

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Servicio ID / Cliente</th>
            <th className="px-4 py-3 font-medium">Tipo / Plan</th>
            <th className="px-4 py-3 font-medium">Estado Contrato</th>
            <th className="px-4 py-3 font-medium">Día Fact.</th>
            <th className="px-4 py-3 font-medium">Estado Técnico</th>
            <th className="px-4 py-3 font-medium">Creado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {services.map(srv => (
            <tr 
              key={srv.id} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectService(srv.id)}
            >
              <td className="px-4 py-3">
                <p className="font-mono text-xs">{srv.id}</p>
                <p className="font-semibold text-xs text-muted-foreground">{srv.clientId}</p>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 mb-1"><ServiceTypeBadge type={srv.type} /></div>
                <p className="text-xs">{srv.planVersionId}</p>
              </td>
              <td className="px-4 py-3">
                <ServiceLifecycleStatusBadge status={srv.lifecycleStatus} />
              </td>
              <td className="px-4 py-3 text-xs font-semibold">
                Día {srv.billingDay}
              </td>
              <td className="px-4 py-3 text-xs">
                <span className="text-muted-foreground italic">{srv.technicalStatus || 'Sin información técnica'}</span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(srv.createdAt)}</td>
            </tr>
          ))}
          {services.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                No se encontraron servicios.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
