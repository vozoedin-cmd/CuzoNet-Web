'use client';

import { useDashboardBillingSummary } from '../hooks/useDashboardBillingSummary';
import { useDashboardNetworkHealth } from '../hooks/useDashboardNetworkHealth';
import { useDashboardOverview } from '../hooks/useDashboardOverview';
import { BillingSummaryCard } from './BillingSummaryCard';
import { KPIGrid } from './KPIGrid';
import { NetworkHealthCard } from './NetworkHealthCard';

export function DashboardOverview() {
  const overview = useDashboardOverview();
  const billing = useDashboardBillingSummary();
  const network = useDashboardNetworkHealth();

  return (
    <div className="space-y-6">
      <KPIGrid
        data={overview.data}
        error={overview.error}
        isFetching={overview.isFetching}
        isLoading={overview.isLoading}
        updatedAt={overview.dataUpdatedAt}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <BillingSummaryCard
          data={billing.data}
          error={billing.error}
          isFetching={billing.isFetching}
          isLoading={billing.isLoading}
          updatedAt={billing.dataUpdatedAt}
        />
        <NetworkHealthCard
          data={network.data}
          error={network.error}
          isFetching={network.isFetching}
          isLoading={network.isLoading}
          updatedAt={network.dataUpdatedAt}
        />
      </div>
    </div>
  );
}
