import { Banknote, CheckCircle2, Receipt, RotateCcw } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import type { PaymentDto } from '../api/billing.service';
import { formatMoney } from './BillingFormatting';

export function BillingStatsGrid({
  payments,
}: {
  payments: readonly PaymentDto[];
}) {
  const currencies = new Set(payments.map((payment) => payment.currencyCode));
  const pageAmount =
    currencies.size === 1
      ? formatMoney(
          payments.reduce((total, payment) => total + payment.amountCents, 0),
          payments[0]?.currencyCode ?? 'GTQ',
        )
      : 'No disponible';

  const stats = [
    {
      icon: Receipt,
      label: 'Pagos en esta página',
      value: String(payments.length),
    },
    {
      icon: CheckCircle2,
      label: 'Registrados en esta página',
      value: String(
        payments.filter((payment) => payment.status === 'recorded').length,
      ),
    },
    {
      icon: RotateCcw,
      label: 'Revertidos en esta página',
      value: String(
        payments.filter((payment) => payment.status === 'reversed').length,
      ),
    },
    {
      icon: Banknote,
      label: 'Monto de esta página',
      value: pageAmount,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <span className="rounded-full p-2 bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[10px] uppercase text-muted-foreground">
                  {stat.label}
                </span>
                <span className="text-lg font-bold">{stat.value}</span>
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
