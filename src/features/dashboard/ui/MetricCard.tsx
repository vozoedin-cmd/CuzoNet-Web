import type { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricCardProps {
  description?: string;
  icon: LucideIcon;
  isLoading?: boolean;
  title: string;
  value?: number | string;
}

export function MetricCard({
  description,
  icon: Icon,
  isLoading = false,
  title,
  value,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="mt-1 h-8 w-1/2" />
        ) : (
          <div className="text-2xl font-bold">
            {value === undefined ? 'No disponible' : value}
          </div>
        )}
        {description === undefined ? null : (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
