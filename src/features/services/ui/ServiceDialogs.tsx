
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useServicesStore } from "../model/services.store"
import { useServiceMutations } from "../hooks/useServices"

function SimpleDialog({ open, onClose, title, children }: { open: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border shadow-xl rounded-xl w-full max-w-xl p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">X</button>
      </div>
    </div>
  )
}

const inputClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

const createSchema = z.object({
  clientId: z.string().min(2, "Requerido"),
  planVersionId: z.string().min(2, "Requerido"),
  type: z.enum(['simple_queue', 'pppoe', 'hotspot']),
  billingDay: z.number().min(1).max(28)
})

export function CreateServiceDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal } = useServicesStore();
  const { createService } = useServiceMutations(companyId);
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: { type: 'pppoe', billingDay: 1 }
  });

  const onSubmit = (data: z.infer<typeof createSchema>) => {
    createService.mutate({ clientId: data.clientId, data }, { onSuccess: () => setActiveModal('none') });
  }

  return (
    <SimpleDialog open={activeModal === 'create'} onClose={() => setActiveModal('none')} title="Nuevo Contrato de Servicio">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md text-xs text-blue-500 mb-4">
          <strong>Importante:</strong> Esto crea el contrato lógico en estado <em>pending</em>. No aprovisiona hardware.
        </div>
        <div>
          <label className="text-xs font-medium">ID del Cliente</label>
          <input {...register("clientId")} className={inputClass} placeholder="Ej. cli-123" />
          {errors.clientId && <p className="text-[10px] text-red-500 mt-1">{errors.clientId.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Plan</label>
            <input {...register("planVersionId")} className={inputClass} placeholder="Ej. pv-100" />
            {errors.planVersionId && <p className="text-[10px] text-red-500 mt-1">{errors.planVersionId.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium">Tipo</label>
            <select {...register("type")} className={inputClass}>
              <option value="pppoe">PPPoE</option>
              <option value="simple_queue">Simple Queue</option>
              <option value="hotspot">Hotspot</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Día de Facturación</label>
          <input type="number" {...register("billingDay", { valueAsNumber: true })} className={inputClass} />
          {errors.billingDay && <p className="text-[10px] text-red-500 mt-1">{errors.billingDay.message}</p>}
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button type="submit" disabled={!isValid} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50">Crear Contrato</button>
        </div>
      </form>
    </SimpleDialog>
  )
}

export function RequestProvisioningDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal, selectedServiceId } = useServicesStore();
  const { requestOperation } = useServiceMutations(companyId);
  
  const [routerId, setRouterId] = React.useState('');

  const onConfirm = () => {
    if (selectedServiceId && routerId) {
      requestOperation.mutate({ serviceId: selectedServiceId, data: { type: 'provision', routerId } }, { onSuccess: () => setActiveModal('none') });
    }
  }

  return (
    <SimpleDialog open={activeModal === 'provision'} onClose={() => setActiveModal('none')} title="Aprovisionamiento Técnico">
      <div className="space-y-4">
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md text-xs text-amber-500">
          <strong>Aviso Técnico:</strong> Esta acción crea una operación en cola hacia un Worker remoto; no activa el servicio de forma inmediata.
        </div>
        <div>
          <label className="text-xs font-medium">Router / NAS ID Destino</label>
          <input value={routerId} onChange={(e) => setRouterId(e.target.value)} className={inputClass} placeholder="Ej. eq-001" />
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <button onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button onClick={onConfirm} disabled={!routerId} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50">Encolar Tarea</button>
        </div>
      </div>
    </SimpleDialog>
  )
}
