import { FilterX, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useClientsStore } from '../model/clients.store';

const controlClass =
  'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring';

export function ClientFilters({ onFilterChange }: { onFilterChange: () => void }) {
  const filters = useClientsStore((state) => state.filters);
  const setFilter = useClientsStore((state) => state.setFilter);
  const clearFilters = useClientsStore((state) => state.clearFilters);
  const setActiveModal = useClientsStore((state) => state.setActiveModal);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border flex-wrap">
      <div className="flex-1 min-w-[220px]">
        <label className="sr-only" htmlFor="client-search">
          Buscar clientes
        </label>
        <input
          id="client-search"
          type="search"
          placeholder="Buscar por nombre o documento"
          value={filters.search}
          onChange={(event) => {
            onFilterChange();
            setFilter('search', event.target.value);
          }}
          className={controlClass}
        />
      </div>
      <div className="flex-1 min-w-[150px]">
        <label className="sr-only" htmlFor="client-status">
          Estado
        </label>
        <select
          id="client-status"
          value={filters.status}
          onChange={(event) => {
            const value = event.target.value;
            onFilterChange();
            setFilter(
              'status',
              value === 'active' || value === 'archived' ? value : '',
            );
          }}
          className={controlClass}
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="archived">Archivado</option>
        </select>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          onFilterChange();
          clearFilters();
        }}
        className="w-full md:w-auto flex items-center gap-2"
      >
        <FilterX className="h-4 w-4" /> Limpiar
      </Button>
      <Button
        type="button"
        onClick={() => setActiveModal('create')}
        className="w-full md:w-auto flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> Nuevo cliente
      </Button>
    </div>
  );
}
