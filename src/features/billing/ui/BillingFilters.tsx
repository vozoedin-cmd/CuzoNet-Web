import { useRef, type FormEvent } from 'react';
import { FileText, FilterX, Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useBillingStore } from '../model/billing.store';

export function BillingFilters() {
  const formRef = useRef<HTMLFormElement>(null);
  const clearFilters = useBillingStore((state) => state.clearFilters);
  const filters = useBillingStore((state) => state.filters);
  const setActiveModal = useBillingStore((state) => state.setActiveModal);
  const setFilters = useBillingStore((state) => state.setFilters);
  const setSelectedClientId = useBillingStore(
    (state) => state.setSelectedClientId,
  );
  const inputClass =
    'flex h-9 min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFilters({
      clientId: String(form.get('clientId') ?? '').trim(),
      from: String(form.get('from') ?? ''),
      to: String(form.get('to') ?? ''),
    });
  };

  const openAccount = () => {
    setSelectedClientId(
      filters.clientId.trim().length > 0 ? filters.clientId : null,
    );
    setActiveModal('client_account');
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="flex flex-col md:flex-row gap-3 items-end bg-card p-4 rounded-xl border flex-wrap"
    >
      <label className="flex flex-col gap-1 flex-[2] w-full">
        <span className="text-xs text-muted-foreground">Client ID</span>
        <input
          name="clientId"
          defaultValue={filters.clientId}
          placeholder="UUID del cliente"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 flex-1 w-full">
        <span className="text-xs text-muted-foreground">Desde</span>
        <input
          name="from"
          type="date"
          defaultValue={filters.from}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 flex-1 w-full">
        <span className="text-xs text-muted-foreground">Hasta</span>
        <input
          name="to"
          type="date"
          defaultValue={filters.to}
          className={inputClass}
        />
      </label>
      <Button type="submit" variant="outline" className="w-full md:w-auto gap-2">
        <Search className="h-4 w-4" /> Aplicar
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          formRef.current?.reset();
          clearFilters();
        }}
        className="w-full md:w-auto gap-2"
      >
        <FilterX className="h-4 w-4" /> Limpiar
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={openAccount}
        className="w-full md:w-auto gap-2"
      >
        <FileText className="h-4 w-4" /> Cuenta cliente
      </Button>
      <Button
        type="button"
        onClick={() => setActiveModal('register_payment')}
        className="w-full md:w-auto gap-2"
      >
        <Plus className="h-4 w-4" /> Registrar pago
      </Button>
    </form>
  );
}
