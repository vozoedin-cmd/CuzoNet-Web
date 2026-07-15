import { FilterX, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useServicesStore } from '../model/services.store';

export function ServiceFilters() {
  const filters = useServicesStore((state) => state.filters);
  const selectedClientId = useServicesStore((state) => state.selectedClientId);
  const clearFilters = useServicesStore((state) => state.clearFilters);
  const setActiveModal = useServicesStore((state) => state.setActiveModal);
  const setFilter = useServicesStore((state) => state.setFilter);
  const setSelectedClientId = useServicesStore(
    (state) => state.setSelectedClientId,
  );
  const inputClass =
    'flex h-9 min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center bg-card p-4 rounded-xl border flex-wrap">
      <input
        aria-label="Client ID"
        type="text"
        placeholder="Client ID"
        value={selectedClientId ?? ''}
        onChange={(event) =>
          setSelectedClientId(
            event.target.value.trim().length === 0 ? null : event.target.value,
          )
        }
        className={inputClass + ' flex-[2]'}
      />
      <input
        aria-label="Buscar servicios"
        type="search"
        placeholder="Buscar por servicio o plan"
        value={filters.search}
        onChange={(event) => setFilter('search', event.target.value)}
        className={inputClass + ' flex-[2]'}
      />
      <select
        aria-label="Estado contractual"
        value={filters.lifecycleStatus}
        onChange={(event) =>
          setFilter(
            'lifecycleStatus',
            event.target.value as typeof filters.lifecycleStatus,
          )
        }
        className={inputClass + ' flex-1'}
      >
        <option value="">Todos los estados</option>
        <option value="pending">Pendiente</option>
        <option value="active">Activo</option>
        <option value="suspended">Suspendido</option>
        <option value="cancelled">Cancelado</option>
        <option value="archived">Archivado</option>
      </select>
      <select
        aria-label="Tipo de servicio"
        value={filters.serviceType}
        onChange={(event) =>
          setFilter('serviceType', event.target.value as typeof filters.serviceType)
        }
        className={inputClass + ' flex-1'}
      >
        <option value="">Todos los tipos</option>
        <option value="simple_queue">Simple Queue</option>
        <option value="pppoe">PPPoE</option>
        <option value="hotspot">Hotspot</option>
      </select>
      <input
        aria-label="Día de facturación"
        type="number"
        min={1}
        max={28}
        placeholder="Día"
        value={filters.billingDay}
        onChange={(event) => setFilter('billingDay', event.target.value)}
        className={inputClass + ' w-full md:w-20'}
      />
      <Button
        type="button"
        variant="outline"
        onClick={clearFilters}
        className="w-full md:w-auto gap-2"
      >
        <FilterX className="h-4 w-4" /> Limpiar filtros
      </Button>
      <Button
        type="button"
        onClick={() => setActiveModal('create')}
        disabled={selectedClientId === null}
        className="w-full md:w-auto gap-2"
      >
        <Plus className="h-4 w-4" /> Nuevo servicio
      </Button>
    </div>
  );
}
