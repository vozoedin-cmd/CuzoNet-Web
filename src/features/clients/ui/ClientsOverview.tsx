'use client';

import * as React from 'react';
import { LayoutGrid, LayoutList, LoaderCircle } from 'lucide-react';

import { useClients } from '../hooks/useClients';
import { useClientsStore } from '../model/clients.store';
import { ClientCardList } from './ClientCardList';
import { ClientDetailsDrawer } from './ClientDetailsDrawer';
import { ArchiveClientDialog, ClientFormDialog } from './ClientDialogs';
import { ClientFilters } from './ClientFilters';
import { ClientTable } from './ClientTable';
import { ClientsEmpty, ClientsError, ClientsSkeleton } from './ClientsStates';

const DEFAULT_PAGE_SIZE = 25;

export function ClientsOverview() {
  const filters = useClientsStore((state) => state.filters);
  const viewMode = useClientsStore((state) => state.viewMode);
  const setViewMode = useClientsStore((state) => state.setViewMode);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [debouncedSearch, setDebouncedSearch] = React.useState(filters.search);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(filters.search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const clientsQuery = useClients({
    page,
    pageSize,
    ...(debouncedSearch.length > 0 ? { search: debouncedSearch } : {}),
    ...(filters.status !== '' ? { status: filters.status } : {}),
  });

  if (clientsQuery.isPending) {
    return <ClientsSkeleton />;
  }

  if (clientsQuery.isError) {
    return (
      <ClientsError
        error={clientsQuery.error}
        onRetry={() => void clientsQuery.refetch()}
      />
    );
  }

  const response = clientsQuery.data;
  const totalPages = Math.max(1, Math.ceil(response.total / response.pageSize));

  return (
    <div className="space-y-6 relative pb-10">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full">
          <ClientFilters onFilterChange={() => setPage(1)} />
        </div>
        <div className="flex items-center gap-2 border bg-card p-1 rounded-lg">
          <button
            type="button"
            className={
              'p-2 rounded-md transition-colors ' +
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
              'p-2 rounded-md transition-colors ' +
              (viewMode === 'cards' ? 'bg-muted' : 'hover:bg-muted/50')
            }
            onClick={() => setViewMode('cards')}
            title="Vista de tarjetas"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {clientsQuery.isFetching && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Actualizando clientes…
        </div>
      )}

      {response.data.length === 0 ? (
        <ClientsEmpty />
      ) : (
        <>
          {viewMode === 'table' ? (
            <>
              <div className="hidden md:block">
                <ClientTable clients={response.data} />
              </div>
              <div className="block md:hidden">
                <ClientCardList clients={response.data} />
              </div>
            </>
          ) : (
            <ClientCardList clients={response.data} />
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border rounded-xl bg-card p-3 text-sm">
            <p className="text-muted-foreground">
              {response.total} cliente{response.total === 1 ? '' : 's'} · Página{' '}
              {response.page} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="clients-page-size" className="text-muted-foreground">
                Por página
              </label>
              <select
                id="clients-page-size"
                className="h-9 rounded-md border bg-background px-2"
                value={pageSize}
                onChange={(event) => {
                  setPage(1);
                  setPageSize(Number(event.target.value));
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <button
                type="button"
                className="h-9 rounded-md border px-3 disabled:opacity-40"
                disabled={response.page <= 1 || clientsQuery.isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Anterior
              </button>
              <button
                type="button"
                className="h-9 rounded-md border px-3 disabled:opacity-40"
                disabled={response.page >= totalPages || clientsQuery.isFetching}
                onClick={() => setPage((current) => current + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}

      <ClientDetailsDrawer />
      <ClientFormDialog />
      <ArchiveClientDialog />
    </div>
  );
}
