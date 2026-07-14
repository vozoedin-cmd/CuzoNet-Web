
import * as React from "react"
import { PlanDto } from "../api/plans.service"
import { PlanStatusBadge, ServiceTypeBadge, PlanVersionStatusBadge } from "./PlanBadges"
import { usePlansStore } from "../model/plans.store"

export function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(cents / 100);
}

export function formatKbps(kbps: number) {
  if (kbps >= 1024) return `${(kbps / 1024).toFixed(0)} Mbps`;
  return `${kbps} Kbps`;
}

export function PlanTable({ plans }: { plans: PlanDto[] }) {
  const { selectPlan } = usePlansStore();

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Código / Nombre</th>
            <th className="px-4 py-3 font-medium">Compatibilidad</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Precio (Vigente)</th>
            <th className="px-4 py-3 font-medium">Subida / Bajada</th>
            <th className="px-4 py-3 font-medium">Versiones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {plans.map(p => (
            <tr 
              key={p.id} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectPlan(p.id)}
            >
              <td className="px-4 py-3">
                <p className="font-mono text-xs font-bold text-primary">{p.code}</p>
                <p className="font-semibold text-sm">{p.name}</p>
              </td>
              <td className="px-4 py-3">
                <ServiceTypeBadge type={p.compatibleServiceType} />
              </td>
              <td className="px-4 py-3">
                <PlanStatusBadge status={p.status} />
              </td>
              <td className="px-4 py-3 text-xs font-bold">
                {p.currentVersion ? formatMoney(p.currentVersion.priceCents, p.currentVersion.currencyCode) : '--'}
              </td>
              <td className="px-4 py-3 text-xs">
                {p.currentVersion ? (
                  <span className="font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {formatKbps(p.currentVersion.uploadKbps)} / {formatKbps(p.currentVersion.downloadKbps)}
                  </span>
                ) : '--'}
              </td>
              <td className="px-4 py-3 text-xs">
                <div className="flex flex-col gap-1">
                  <span>{p.versionsCount} versiones</span>
                  {p.currentVersion && <PlanVersionStatusBadge status={p.currentVersion.status} />}
                </div>
              </td>
            </tr>
          ))}
          {plans.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                No se encontraron planes comerciales.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
