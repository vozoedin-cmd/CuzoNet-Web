
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BillingStatsDto } from "../api/billing.service"
import { formatMoney } from "./BillingFormatting"
import { DollarSign, Wallet, AlertTriangle, CheckCircle2 } from "lucide-react"

export function BillingStatsGrid({ stats }: { stats?: BillingStatsDto }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full">
            <DollarSign className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ingresos (Hoy / Mes)</p>
            <h3 className="text-xl font-bold">{stats ? formatMoney(stats.todayRevenueCents, 'MXN') : '--'}</h3>
            <p className="text-xs text-muted-foreground">{stats ? formatMoney(stats.monthRevenueCents, 'MXN') : '--'}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full">
            <Wallet className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Deuda Pendiente</p>
            <h3 className="text-xl font-bold">{stats ? formatMoney(stats.pendingBalanceCents, 'MXN') : '--'}</h3>
            <p className="text-xs text-muted-foreground">{stats?.delinquentClientsCount ?? '--'} clientes en mora</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-full relative">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            {(stats?.unallocatedPaymentsCount || 0) > 0 && (
               <span className="absolute -top-1 -right-1 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
               </span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pagos Sin Asignar</p>
            <h3 className="text-xl font-bold">{stats?.unallocatedPaymentsCount ?? '--'}</h3>
            <p className="text-xs text-muted-foreground">Requieren conciliación</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <CheckCircle2 className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tasa de Cobro (Mes)</p>
            <h3 className="text-xl font-bold">{stats ? `${stats.collectionRatePercent}%` : '--'}</h3>
            <p className="text-xs text-muted-foreground">Efectividad global</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
