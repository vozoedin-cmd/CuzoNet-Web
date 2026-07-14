
import * as React from "react"
import { useBillingStore } from "../model/billing.store"
import { useClientAccount, useClientStatement } from "../hooks/useBilling"
import { formatMoney, InvoiceStatusBadge } from "./BillingFormatting"
import { X, FileText, ArrowRightCircle, ArrowDownCircle } from "lucide-react"

export function ClientAccountPanel({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal, filters, setFilter } = useBillingStore();
  
  // Use local state if we want to search a specific client inside the modal without polluting global
  const [localClientId, setLocalClientId] = React.useState(filters.clientId || '');
  const { data: acc, isLoading: accLoading } = useClientAccount(companyId, localClientId);
  const { data: statement, isLoading: stmtLoading } = useClientStatement(companyId, localClientId);

  if (activeModal !== 'client_account') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border shadow-xl rounded-xl w-full max-w-4xl flex flex-col animate-in zoom-in-95 h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center bg-muted/30">
          <h3 className="text-lg font-bold flex items-center gap-2"><FileText className="h-5 w-5" /> Estado de Cuenta Cliente</h3>
          <button onClick={() => setActiveModal('none')} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="p-4 border-b flex gap-4 bg-background">
          <input 
            value={localClientId}
            onChange={(e) => setLocalClientId(e.target.value)}
            placeholder="Ingrese Client ID (ej. cli-001)"
            className="flex h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md" onClick={() => setFilter('clientId', localClientId)}>Buscar Global</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
          {!localClientId ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Ingrese un ID de cliente válido.</div>
          ) : accLoading || stmtLoading ? (
            <div className="flex-1 animate-pulse space-y-4"><div className="h-20 bg-muted rounded"></div><div className="h-64 bg-muted rounded"></div></div>
          ) : !acc ? (
            <div className="flex-1 flex items-center justify-center text-red-500 text-sm">No se encontró el estado de cuenta.</div>
          ) : (
            <>
              <div className="w-full md:w-1/3 space-y-4">
                <div className="p-4 border rounded-xl bg-card">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Estado Financiero</p>
                  <p className={`text-lg font-bold uppercase ${acc.financialStatus === 'in_arrears' ? 'text-red-500' : 'text-green-500'}`}>
                    {acc.financialStatus === 'in_arrears' ? 'MOROSO' : acc.financialStatus === 'up_to_date' ? 'AL CORRIENTE' : acc.financialStatus}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div className="p-3 border rounded-xl bg-red-500/5 text-red-500">
                    <span className="block text-[10px] uppercase font-bold mb-1 opacity-70">Deuda Real</span>
                    <span className="font-bold">{formatMoney(acc.debtCents, acc.currencyCode)}</span>
                  </div>
                  <div className="p-3 border rounded-xl bg-green-500/5 text-green-500">
                    <span className="block text-[10px] uppercase font-bold mb-1 opacity-70">Crédito a favor</span>
                    <span className="font-bold">{formatMoney(acc.creditCents, acc.currencyCode)}</span>
                  </div>
                </div>

                <div className="border rounded-xl bg-card overflow-hidden">
                  <p className="text-xs font-bold bg-muted p-2 border-b">Facturas Abiertas ({acc.openInvoices.length})</p>
                  <div className="p-2 space-y-2 max-h-48 overflow-y-auto">
                    {acc.openInvoices.length === 0 ? <p className="text-xs text-muted-foreground p-2 text-center">No hay facturas pendientes.</p> :
                      acc.openInvoices.map(inv => (
                        <div key={inv.id} className="text-xs border p-2 rounded flex justify-between items-center">
                          <div>
                            <span className="font-mono">{inv.id}</span>
                            <span className="block text-muted-foreground mt-0.5">Vence: {new Date(inv.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-red-500 block">{formatMoney(inv.balanceCents, inv.currencyCode)}</span>
                            <InvoiceStatusBadge status={inv.status} />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3 border rounded-xl bg-card overflow-hidden flex flex-col">
                <p className="text-sm font-bold bg-muted p-3 border-b">Línea de Tiempo Financiera (Timeline)</p>
                <div className="p-4 flex-1 overflow-y-auto space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                  {(!statement || statement.length === 0) ? <p className="text-sm text-muted-foreground text-center mt-10">Sin movimientos financieros.</p> :
                    statement.map((entry, idx) => {
                      const isCharge = entry.type === 'invoice';
                      const Icon = isCharge ? ArrowRightCircle : ArrowDownCircle;
                      const color = isCharge ? 'text-red-500' : 'text-green-500';
                      
                      return (
                        <div key={entry.id + idx} className="relative flex items-center justify-between mb-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 z-10">
                            <Icon className={`w-4 h-4 ${color}`} />
                          </div>
                          <div className="w-[calc(100%-3rem)] p-3 rounded-lg border bg-background shadow-sm text-sm ml-2">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold">{entry.description}</span>
                              <span className={`font-bold ${color}`}>{isCharge ? '+' : '-'}{formatMoney(entry.amountCents, entry.currencyCode)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Ref: <span className="font-mono">{entry.referenceId}</span> • {new Date(entry.date).toLocaleDateString()}</span>
                              <span>Saldo final: {formatMoney(entry.balanceAfterCents, entry.currencyCode)}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
