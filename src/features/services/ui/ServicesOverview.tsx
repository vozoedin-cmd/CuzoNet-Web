'use client';

import * as React from 'react';
import { LayoutGrid, LayoutList, LoaderCircle } from 'lucide-react';

import { useClientServices } from '../hooks/useServices';
import { useServicesStore } from '../model/services.store';
import { ServiceCardList } from './ServiceCardList';
import { ServiceDetailsDrawer } from './ServiceDetailsDrawer';
import {
  CreateServiceDialog,
  RequestProvisioningDialog,
} from './ServiceDialogs';
import { ServiceFilters } from './ServiceFilters';
import { ServiceStatsGrid } from './ServiceStatsGrid';
import { ServiceTable } from './ServiceTable';
import {
  ServicesEmpty,
  ServicesError,
  ServicesSkeleton,
} from './ServicesStates';

export function ServicesOverview() {
  const filters = useServicesStore((state) => state.filters);
  const selectedClientId = useServicesStore((state) => state.selectedClientId);
  const setViewMode = useServicesStore((state) => state.setViewMode);
  const viewMode = useServicesStore((state) => state.viewMode);
  const servicesQuery = useClientServices(selectedClientId);

  const services = React.useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return (servicesQuery.data ?? []).filter((service) => {
      if (
        filters.lifecycleStatus !== '' &&
        service.lifecycleStatus !== filters.lifecycleStatus
      ) {
        return false;
      }
      if (
        filters.serviceType !== '' &&
        service.serviceType !== filters.serviceType
      ) {
        return false;
      }
      if (
        filters.billingDay !== '' &&
        service.billingDay !== Number(filters.billingDay)
      ) {
        return false;
      }
      if (
        search.length > 0 &&
        !service.serviceId.toLowerCase().includes(search) &&
        !service.planVersionId.toLowerCase().includes(search)
      ) {
        return false;
      }
      return true;
    });
  }, [filters, servicesQuery.data]);

  return (
    <div className="space-y-6 relative pb-10">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full">
          <ServiceFilters />
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

      {selectedClientId === null ? (
        <div className="rounded-xl border p-12 flex items-center justify-center text-center text-muted-foreground min-h-72 bg-card/50">
          Selecciona un cliente para consultar sus servicios.
        </div>
      ) : servicesQuery.isPending ? (
        <ServicesSkeleton />
      ) : servicesQuery.isError ? (
        <ServicesError
          error={servicesQuery.error}
          onRetry={() => void servicesQuery.refetch()}
        />
      ) : (
        <>
          {servicesQuery.isFetching && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              Actualizando servicios…
            </p>
          )}

          <ServiceStatsGrid services={services} />

          {services.length === 0 ? (
            <ServicesEmpty />
          ) : viewMode === 'table' ? (
            <>
              <div className="hidden md:block">
                <ServiceTable services={services} />
              </div>
              <div className="block md:hidden">
                <ServiceCardList services={services} />
              </div>
            </>
          ) : (
            <ServiceCardList services={services} />
          )}
        </>
      )}

      <ServiceDetailsDrawer />
      <CreateServiceDialog />
      <RequestProvisioningDialog />
    </div>
  );
}
