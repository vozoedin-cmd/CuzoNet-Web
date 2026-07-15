import * as React from 'react';
import {
  DollarSign,
  FileText,
  MapPin,
  Phone,
  ServerCrash,
  UserSquare2,
  X,
} from 'lucide-react';

import type { ClientContactType } from '../api/clients.service';
import {
  useClient,
  useClientAccount,
  useClientServices,
} from '../hooks/useClients';
import { useClientsStore } from '../model/clients.store';
import { ClientStatusBadge, ClientTypeBadge } from './ClientBadges';
import { ApiErrorNotice } from './ClientsStates';

type DrawerTab = 'summary' | 'contacts' | 'addresses' | 'services' | 'account';

function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

function primaryContact(
  contacts: readonly { type: ClientContactType; value: string; isPrimary: boolean }[],
  type: ClientContactType,
): string {
  return (
    contacts.find((contact) => contact.type === type && contact.isPrimary)?.value ??
    contacts.find((contact) => contact.type === type)?.value ??
    'No registrado'
  );
}

export function ClientDetailsDrawer() {
  const selectedClientId = useClientsStore((state) => state.selectedClientId);
  const drawerOpen = useClientsStore((state) => state.drawerOpen);
  const setDrawerOpen = useClientsStore((state) => state.setDrawerOpen);
  const setActiveModal = useClientsStore((state) => state.setActiveModal);
  const clientQuery = useClient(selectedClientId);
  const servicesQuery = useClientServices(selectedClientId);
  const accountQuery = useClientAccount(selectedClientId);
  const [activeTab, setActiveTab] = React.useState<DrawerTab>('summary');

  if (!drawerOpen) return null;

  const tabs = [
    { id: 'summary' as const, label: 'Resumen', icon: FileText },
    { id: 'contacts' as const, label: 'Contactos', icon: Phone },
    { id: 'addresses' as const, label: 'Direcciones', icon: MapPin },
    { id: 'services' as const, label: 'Servicios', icon: ServerCrash },
    { id: 'account' as const, label: 'Cuenta', icon: DollarSign },
  ];

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar detalle"
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        onClick={() => setDrawerOpen(false)}
      />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l bg-background shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <UserSquare2 className="h-5 w-5 text-primary" />
            Expediente del cliente
          </h2>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {clientQuery.isPending && (
          <div className="p-6 animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-32 bg-muted rounded w-full" />
          </div>
        )}

        {clientQuery.isError && (
          <div className="p-6 text-destructive">
            <ApiErrorNotice error={clientQuery.error} />
          </div>
        )}

        {clientQuery.data && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-2xl font-extrabold mb-1 leading-tight">
                {clientQuery.data.legalName}
              </h3>
              <div className="flex gap-2 mb-4 flex-wrap">
                <ClientTypeBadge type={clientQuery.data.clientType} />
                <ClientStatusBadge status={clientQuery.data.status} />
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border">
                  {clientQuery.data.documentType}: {clientQuery.data.documentNumber}
                </span>
              </div>
            </div>

            <div className="px-6 border-b flex gap-4 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={
                      'flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ' +
                      (activeTab === tab.id
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground')
                    }
                  >
                    <Icon className="h-4 w-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg border">
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">
                        Teléfono principal
                      </span>
                      <p className="font-medium">
                        {primaryContact(clientQuery.data.contacts, 'phone')}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">
                        Email principal
                      </span>
                      <p className="font-medium break-all">
                        {primaryContact(clientQuery.data.contacts, 'email')}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">
                        Creado
                      </span>
                      <p>{new Date(clientQuery.data.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">
                        Última actualización
                      </span>
                      <p>
                        {clientQuery.data.updatedAt
                          ? new Date(clientQuery.data.updatedAt).toLocaleString()
                          : 'Sin cambios'}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg bg-card text-sm">
                    <p className="font-semibold mb-2">Dirección de servicio</p>
                    <p className="text-muted-foreground">
                      {clientQuery.data.addresses.find(
                        (address) => address.isServiceAddress,
                      )?.addressLine ?? 'No registrada'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className="space-y-2">
                  {clientQuery.data.contacts.length === 0 && (
                    <p className="text-muted-foreground text-sm">Sin contactos.</p>
                  )}
                  {clientQuery.data.contacts.map((contact, index) => (
                    <div
                      key={contact.type + '-' + contact.value + '-' + index}
                      className="p-3 border rounded-lg bg-card text-sm"
                    >
                      <div className="flex justify-between gap-3">
                        <p className="font-bold capitalize">{contact.type}</p>
                        {contact.isPrimary && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                            Principal
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground break-all">{contact.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-2">
                  {clientQuery.data.addresses.length === 0 && (
                    <p className="text-muted-foreground text-sm">Sin direcciones.</p>
                  )}
                  {clientQuery.data.addresses.map((address, index) => (
                    <div
                      key={address.addressLine + '-' + index}
                      className="p-3 border rounded-lg bg-card text-sm"
                    >
                      <div className="flex justify-between gap-3">
                        <p className="font-bold">{address.label ?? 'Dirección'}</p>
                        {address.isServiceAddress && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                            Servicio
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground">{address.addressLine}</p>
                      {address.latitude !== undefined &&
                        address.longitude !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            {address.latitude}, {address.longitude}
                          </p>
                        )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-2">
                  {servicesQuery.isPending && <p className="text-sm">Cargando…</p>}
                  {servicesQuery.isError && (
                    <div className="text-destructive">
                      <ApiErrorNotice error={servicesQuery.error} />
                    </div>
                  )}
                  {servicesQuery.data?.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      Sin servicios asignados.
                    </p>
                  )}
                  {servicesQuery.data?.map((service) => (
                    <div key={service.id} className="p-3 border rounded-lg bg-card">
                      <div className="flex justify-between gap-3">
                        <p className="font-bold text-sm">{service.serviceType}</p>
                        <span className="text-xs uppercase text-muted-foreground">
                          {service.lifecycleStatus}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Día de cobro: {service.billingDay} · Plan: {service.planVersionId}
                      </p>
                      {service.startedOn && (
                        <p className="text-xs text-muted-foreground">
                          Inicio: {new Date(service.startedOn).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'account' && (
                <div className="space-y-4">
                  {accountQuery.isPending && <p className="text-sm">Cargando…</p>}
                  {accountQuery.isError && (
                    <div className="text-destructive">
                      <ApiErrorNotice error={accountQuery.error} />
                    </div>
                  )}
                  {accountQuery.data && (
                    <>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-muted-foreground">Deuda</p>
                          <p className="font-bold">
                            {formatMoney(
                              accountQuery.data.debtCents,
                              accountQuery.data.currencyCode,
                            )}
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-muted-foreground">Vencido</p>
                          <p className="font-bold text-destructive">
                            {formatMoney(
                              accountQuery.data.overdueCents,
                              accountQuery.data.currencyCode,
                            )}
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-muted-foreground">Crédito</p>
                          <p className="font-bold">
                            {formatMoney(
                              accountQuery.data.creditCents,
                              accountQuery.data.currencyCode,
                            )}
                          </p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <p className="text-xs text-muted-foreground">Facturas</p>
                          <p className="font-bold">{accountQuery.data.invoiceCount}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Próximo vencimiento:{' '}
                        {accountQuery.data.nextDueOn
                          ? new Date(accountQuery.data.nextDueOn).toLocaleDateString()
                          : 'No programado'}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-2 bg-muted/10">
              <button
                type="button"
                className="flex-1 px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted bg-background"
                onClick={() => setActiveModal('edit')}
              >
                Editar cliente
              </button>
              {clientQuery.data.status === 'active' && (
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-destructive/20 text-destructive rounded-md text-sm font-medium hover:bg-destructive/10 bg-background"
                  onClick={() => setActiveModal('archive')}
                >
                  Archivar cliente
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
