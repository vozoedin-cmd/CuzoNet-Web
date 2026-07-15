import type { FormEvent } from 'react';
import { FileText, LoaderCircle, X } from 'lucide-react';

import { useClientAccount } from '../hooks/useBilling';
import { useBillingStore } from '../model/billing.store';
import { formatAccountDate, formatMoney } from './BillingFormatting';
import { BillingApiErrorNotice } from './BillingStates';

export function ClientAccountPanel() {
  const activeModal = useBillingStore((state) => state.activeModal);
  const selectedClientId = useBillingStore(
    (state) => state.selectedClientId,
  );
  const setActiveModal = useBillingStore((state) => state.setActiveModal);
  const setSelectedClientId = useBillingStore(
    (state) => state.setSelectedClientId,
  );
  const accountQuery = useClientAccount(selectedClientId);

  if (activeModal !== 'client_account') return null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const clientId = String(form.get('clientId') ?? '').trim();
    setSelectedClientId(clientId.length > 0 ? clientId : null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border shadow-xl rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" /> Cuenta del cliente
          </h3>
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 border-b flex gap-3">
          <input
            name="clientId"
            defaultValue={selectedClientId ?? ''}
            placeholder="UUID del cliente"
            className="flex h-9 flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md"
          >
            Consultar
          </button>
        </form>

        <div className="p-6">
          {selectedClientId === null ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              Selecciona un cliente para consultar su cuenta.
            </p>
          ) : accountQuery.isPending ? (
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
          ) : accountQuery.isError ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-destructive">
              <BillingApiErrorNotice error={accountQuery.error} />
            </div>
          ) : (
            <div className="space-y-4">
              {accountQuery.isFetching && (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  Actualizando cuenta…
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <AccountValue
                  label="Deuda"
                  value={formatMoney(
                    accountQuery.data.debtCents,
                    accountQuery.data.currencyCode,
                  )}
                />
                <AccountValue
                  label="Crédito"
                  value={formatMoney(
                    accountQuery.data.creditCents,
                    accountQuery.data.currencyCode,
                  )}
                />
                <AccountValue
                  label="Vencido"
                  value={formatMoney(
                    accountQuery.data.overdueCents,
                    accountQuery.data.currencyCode,
                  )}
                />
                <AccountValue
                  label="Cantidad de facturas"
                  value={String(accountQuery.data.invoiceCount)}
                />
                <AccountValue
                  label="Próximo vencimiento"
                  value={formatAccountDate(accountQuery.data.nextDueOn)}
                />
                <AccountValue
                  label="Moneda"
                  value={accountQuery.data.currencyCode}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
