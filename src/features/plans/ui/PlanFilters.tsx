import { FilterX, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { usePlansStore } from '../model/plans.store';

export function PlanFilters() {
  const clearFilters = usePlansStore((state) => state.clearFilters);
  const filters = usePlansStore((state) => state.filters);
  const setActiveModal = usePlansStore((state) => state.setActiveModal);
  const setFilter = usePlansStore((state) => state.setFilter);
  const inputClass =
    'flex h-9 min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center bg-card p-4 rounded-xl border flex-wrap">
      <input
        aria-label="Buscar planes"
        type="search"
        placeholder="Buscar por código o nombre"
        value={filters.search}
        onChange={(event) => setFilter('search', event.target.value)}
        className={inputClass + ' flex-[2]'}
      />
      <select
        aria-label="Estado del plan"
        value={filters.isActive}
        onChange={(event) =>
          setFilter('isActive', event.target.value as typeof filters.isActive)
        }
        className={inputClass + ' flex-1'}
      >
        <option value="">Todos los estados</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
      </select>
      <select
        aria-label="Tipo de servicio"
        value={filters.serviceType}
        onChange={(event) =>
          setFilter(
            'serviceType',
            event.target.value as typeof filters.serviceType,
          )
        }
        className={inputClass + ' flex-1'}
      >
        <option value="">Todos los tipos</option>
        <option value="simple_queue">Simple Queue</option>
        <option value="pppoe">PPPoE</option>
        <option value="hotspot">Hotspot</option>
      </select>
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
        className="w-full md:w-auto gap-2"
      >
        <Plus className="h-4 w-4" /> Nuevo plan
      </Button>
    </div>
  );
}
