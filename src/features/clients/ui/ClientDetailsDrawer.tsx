
import * as React from "react"
import { useClientsStore } from "../model/clients.store"
import { useClient, useClientServices, useClientAccount } from "../hooks/useClients"
import { ClientStatusBadge, ClientTypeBadge } from "./ClientBadges"
import { X, UserSquare2, FileText, Phone, MapPin, ServerCrash, DollarSign, NotebookPen } from "lucide-react"

export function ClientDetailsDrawer({ companyId }: { companyId: string }) {
  const { selectedClientId, drawerOpen, setDrawerOpen, setActiveModal } = useClientsStore();
  const { data, isLoading, isError } = useClient(companyId, selectedClientId);
  const { data: services } = useClientServices(companyId, selectedClientId);
  const { data: account } = useClientAccount(companyId, selectedClientId);
  const [activeTab, setActiveTab] = React.useState('resumen');

  if (!drawerOpen) return null;

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: FileText },
    { id: 'contactos', label: 'Contactos', icon: Phone },
    { id: 'direcciones', label: 'Direcciones', icon: MapPin },
    { id: 'servicios', label: 'Servicios', icon: ServerCrash },
    { id: 'cuenta', label: 'Cta.', icon: DollarSign },
    { id: 'notas', label: 'Notas', icon: NotebookPen },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l bg-background shadow-2xl p-0 flex flex-col animate-in slide-in-from-right-full duration-300">
        
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <UserSquare2 className="h-5 w-5 text-primary" />
            Expediente del Cliente
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading && <div className="p-6 animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-32 bg-muted rounded w-full" />
        </div>}

        {isError && <div className="p-6 text-red-500">Error cargando detalles.</div>}

        {!isLoading && !isError && data && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 pb-0">
              <h3 className="text-2xl font-extrabold mb-1 leading-tight">{data.legalName}</h3>
              <div className="flex gap-2 mb-4">
                <ClientTypeBadge type={data.type} />
                <ClientStatusBadge status={data.status} />
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border">
                  Doc: {data.documentId}
                </span>
              </div>
            </div>

            <div className="px-6 border-b flex gap-4 overflow-x-auto">
              {tabs.map(t => {
                const active = activeTab === t.id;
                const Icon = t.icon;
                return (
                  <button 
                    key={t.id} 
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    <Icon className="h-4 w-4" /> {t.label}
                  </button>
                )
              })}
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {activeTab === 'resumen' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg border">
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Teléfono Principal</span>
                      <p className="font-medium">{data.primaryPhone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Email Principal</span>
                      <p className="font-medium truncate" title={data.primaryEmail}>{data.primaryEmail}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Servicios Activos</span>
                      <p className="font-bold">{data.servicesCount}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Balance Actual</span>
                      <p className={`font-bold ${data.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>$ {data.balance}</p>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg bg-card text-sm space-y-2">
                    <p className="font-semibold border-b pb-1">Ubicación Principal</p>
                    {data.addresses.filter(a => a.isPrimary).map(a => (
                      <p key={a.id} className="text-muted-foreground">{a.street}, {a.city}, {a.state} CP {a.zipCode}</p>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contactos' && (
                <div className="space-y-2">
                  {data.contacts.map(c => (
                    <div key={c.id} className="p-3 border rounded-lg bg-card text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-bold">{c.name}</p>
                        {c.isPrimary && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">Principal</span>}
                      </div>
                      <p className="text-muted-foreground text-xs">{c.phone} | {c.email}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'direcciones' && (
                <div className="space-y-2">
                  {data.addresses.map(a => (
                    <div key={a.id} className="p-3 border rounded-lg bg-card text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-bold">{a.street}</p>
                        {a.isPrimary && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">Principal</span>}
                      </div>
                      <p className="text-muted-foreground text-xs">{a.city}, {a.state} CP {a.zipCode}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'servicios' && (
                <div className="space-y-2">
                  {!services ? <div className="text-sm">Cargando...</div> : services.length === 0 ? <p className="text-muted-foreground text-sm">Sin servicios asignados.</p> :
                    services.map(s => (
                      <div key={s.id} className="p-3 border rounded-lg bg-card flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm">{s.planName}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">ID: {s.id} • {s.status}</p>
                        </div>
                        <p className="font-mono text-sm">$ {s.price}</p>
                      </div>
                    ))
                  }
                </div>
              )}

              {activeTab === 'cuenta' && (
                <div className="space-y-4">
                  {!account ? <div className="text-sm">Cargando...</div> : (
                    <>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-4 border rounded-lg bg-card text-center">
                          <p className="text-muted-foreground text-xs mb-1">Deuda Pendiente</p>
                          <p className={`text-2xl font-bold ${account.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>$ {account.balance} {account.currency}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-card text-center flex flex-col justify-center">
                          <p className="text-muted-foreground text-xs mb-1">Estado</p>
                          <p className="font-bold uppercase tracking-wider">{account.status === 'in_arrears' ? 'MOROSO' : 'AL CORRIENTE'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">Última factura generada: {account.lastInvoiceDate ? new Date(account.lastInvoiceDate).toLocaleDateString() : 'N/A'}</p>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'notas' && (
                <div className="p-3 border rounded-lg bg-muted/30 text-sm whitespace-pre-wrap">
                  {data.notes || 'Sin notas.'}
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-2 bg-muted/10">
              <button className="flex-1 px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted bg-background" onClick={() => setActiveModal('edit')}>Editar Cliente</button>
              <button className="flex-1 px-4 py-2 border border-destructive/20 text-destructive rounded-md text-sm font-medium hover:bg-destructive/10 bg-background" onClick={() => setActiveModal('archive')}>Archivar (Baja)</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
