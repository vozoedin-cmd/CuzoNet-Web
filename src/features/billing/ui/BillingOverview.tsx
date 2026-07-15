'use client';

import { LayoutGrid, LayoutList, LoaderCircle } from 'lucide-react';

import { usePayments } from '../hooks/useBilling';
import { useBillingStore } from '../model/billing.store';
import { BillingFilters } from './BillingFilters';
import { RegisterPaymentDialog } from './BillingDialogs';
import { BillingStatsGrid } from './BillingStatsGrid';
import { BillingEmpty, BillingError, BillingSkeleton } from './BillingStates';
import { ClientAccountPanel } from './ClientAccountPanel';
import { PaymentCardList } from './PaymentCardList';
import { PaymentDetailsDrawer } from './PaymentDetailsDrawer';
import { PaymentsTable } from './PaymentsTable';

export function BillingOverview() {
  const filters = useBillingStore((state) => state.filters);
  const page = useBillingStore((state) => state.page);
  const pageSize = useBillingStore((state) => state.pageSize);
  const selectedPaymentId = useBillingStore(
    (state) => state.selectedPaymentId,
  );
  const setPage = useBillingStore((state) => state.setPage);
  const setPageSize = useBillingStore((state) => state.setPageSize);
  const setViewMode = useBillingStore((state) => state.setViewMode);
  const viewMode = useBillingStore((state) => state.viewMode);

  const paymentsQuery = usePayments({
    page,
    pageSize,
    ...(filters.clientId.length === 0 ? {} : { clientId: filters.clientId }),
    ...(filters.from.length === 0 ? {} : { from: filters.from }),
    ...(filters.to.length === 0 ? {} : { to: filters.to }),
  });

  if (paymentsQuery.isPending) return <BillingSkeleton />;

  if (paymentsQuery.isError) {
    return (
      <BillingError
        error={paymentsQuery.error}
        onRetry={() => void paymentsQuery.refetch()}
      />
    );
  }

  const response = paymentsQuery.data;
  const selectedPayment = response.data.find(
    (payment) => payment.id === selectedPaymentId,
  );
  const totalPages = Math.max(1, Math.ceil(response.total / response.pageSize));

  return (
    <div className="space-y-6 relative pb-10">
      <BillingStatsGrid payments={response.data} />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full">
          <BillingFilters />
        </div>
        <div className="flex items-center gap-2 border bg-card p-1 rounded-lg">
          <button
            type="button"
            className={
              'p-2 rounded-md ' +
              (viewMode === 'table' ? 'bg-muted' : 'hover:bg-muted/50')
            }
            onClick={() => setViewMode('table')}
            title="Vista de tabla"
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={
              'p-2 rounded-md ' +
              (viewMode === 'cards' ? 'bg-muted' : 'hover:bg-muted/50')
            }
            onClick={() => setViewMode('cards')}
            title="Vista de tarjetas"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {paymentsQuery.isFetching && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Actualizando pagos…
        </p>
      )}

      {response.data.length === 0 ? (
        <BillingEmpty />
      ) : viewMode === 'table' ? (
        <>
          <div className="hidden md:block">
            <PaymentsTable payments={response.data} />
          </div>
          <div className="block md:hidden">
            <PaymentCardList payments={response.data} />
          </div>
        </>
      ) : (
        <PaymentCardList payments={response.data} />
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border rounded-xl bg-card p-3 text-sm">
        <p className="text-muted-foreground">
          {response.total} pago{response.total === 1 ? '' : 's'} · Página{' '}
          {response.page} de {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="billing-page-size" className="text-muted-foreground">
            Por página
          </label>
          <select
            id="billing-page-size"
            className="h-9 rounded-md border bg-background px-2"
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <button
            type="button"
            className="h-9 rounded-md border px-3 disabled:opacity-40"
            disabled={page <= 1 || paymentsQuery.isFetching}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            Anterior
          </button>
          <button
            type="button"
            className="h-9 rounded-md border px-3 disabled:opacity-40"
            disabled={page >= totalPages || paymentsQuery.isFetching}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      <PaymentDetailsDrawer payment={selectedPayment} />
      <RegisterPaymentDialog
        key={filters.clientId || 'no-client'}
        defaultClientId={filters.clientId}
      />
      <ClientAccountPanel />
    </div>
  );
}
