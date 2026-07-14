
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { BillingSummaryDto } from "../api/dashboard.service"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface BillingSummaryCardProps {
  data?: BillingSummaryDto;
  isLoading: boolean;
}

export function BillingSummaryCard({ data, isLoading }: BillingSummaryCardProps) {
  if (isLoading) return <Skeleton className="h-[200px] w-full rounded-xl" />
  
  const formatCurrency = (cents: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100);

  const collected = data?.collectedThisMonthCents || 0;
  const overdue = data?.overdueThisMonthCents || 0;
  const rate = data?.collectionRatePercentage || 0;
  const unpaidCount = data?.unpaidInvoicesCount || 0;

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Cobranza del Mes
          </CardTitle>
          <CardDescription>Progreso de facturación y morosidad</CardDescription>
        </div>
        <Link href="/billing" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
          Ver reporte <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ingresos Recaudados</p>
              <h2 className="text-3xl font-bold tracking-tight text-green-500/90">{formatCurrency(collected)}</h2>
              <div className="flex items-center gap-1 text-sm text-green-500 mt-1">
                <TrendingUp className="h-4 w-4" />
                <span>+12.5% vs mes anterior</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Tasa de Cobro</span>
                <span className="font-bold">{rate.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${rate}%` }} />
              </div>
            </div>
          </div>
          
          <div className="flex-1 bg-card/50 border rounded-xl p-4 flex flex-col justify-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">Cuentas por Cobrar</p>
            <h3 className="text-2xl font-bold text-red-500/90 mb-1">{formatCurrency(overdue)}</h3>
            <div className="flex items-center gap-1 text-sm text-red-500">
              <TrendingDown className="h-4 w-4" />
              <span>{unpaidCount} facturas pendientes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
