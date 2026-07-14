
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { usePlansStore } from "../model/plans.store"
import { usePlanMutations, usePlan } from "../hooks/usePlans"

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

const createPlanSchema = z.object({
  code: z.string().min(2, "Requerido"),
  name: z.string().min(2, "Requerido"),
  compatibleServiceType: z.enum(['simple_queue', 'pppoe', 'hotspot'])
})

export function CreatePlanDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal } = usePlansStore();
  const { createPlan } = usePlanMutations(companyId);
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<z.infer<typeof createPlanSchema>>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: { compatibleServiceType: 'pppoe' }
  });

  const onSubmit = (data: z.infer<typeof createPlanSchema>) => {
    createPlan.mutate(data, { onSuccess: () => setActiveModal('none') });
  }

  return (
    <SimpleDialog open={activeModal === 'create_plan'} onClose={() => setActiveModal('none')} title="Crear Plan Comercial (Identidad)">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md text-xs text-blue-500 mb-4">
          Esto creará la cáscara del plan en estado <em>inactive</em>. Posteriormente deberás crear y publicar una versión con precios y velocidades.
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Código Único</label>
            <input {...register("code")} className={inputClass} placeholder="Ej. FIBRA-100" />
            {errors.code && <p className="text-[10px] text-red-500 mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium">Compatibilidad</label>
            <select {...register("compatibleServiceType")} className={inputClass}>
              <option value="pppoe">PPPoE</option>
              <option value="simple_queue">Simple Queue</option>
              <option value="hotspot">Hotspot</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Nombre Comercial</label>
          <input {...register("name")} className={inputClass} placeholder="Ej. Fibra Óptica 100 Mbps" />
          {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        
        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button type="submit" disabled={!isValid} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50">Crear Plan</button>
        </div>
      </form>
    </SimpleDialog>
  )
}

const createVersionSchema = z.object({
  priceCents: z.number().min(0),
  currencyCode: z.string().length(3),
  uploadKbps: z.number().min(128),
  downloadKbps: z.number().min(128),
  validFrom: z.string().min(1, "Requerido")
})

export function CreatePlanVersionDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal, selectedPlanId } = usePlansStore();
  const { createPlanVersion } = usePlanMutations(companyId);
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<z.infer<typeof createVersionSchema>>({
    resolver: zodResolver(createVersionSchema),
    defaultValues: { currencyCode: 'MXN', validFrom: new Date().toISOString().split('T')[0] }
  });

  const onSubmit = (data: z.infer<typeof createVersionSchema>) => {
    if (!selectedPlanId) return;
    createPlanVersion.mutate({ planId: selectedPlanId, data: { ...data, validFrom: new Date(data.validFrom).toISOString() } }, { onSuccess: () => setActiveModal('none') });
  }

  return (
    <SimpleDialog open={activeModal === 'create_version'} onClose={() => setActiveModal('none')} title="Nueva Versión (Draft)">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Precio Base (en centavos)</label>
            <input type="number" {...register("priceCents", { valueAsNumber: true })} className={inputClass} placeholder="Ej. 49900 = $499.00" />
            {errors.priceCents && <p className="text-[10px] text-red-500 mt-1">{errors.priceCents.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium">Moneda (ISO 4217)</label>
            <input {...register("currencyCode")} className={inputClass} placeholder="MXN, USD" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Subida Max (Kbps)</label>
            <input type="number" {...register("uploadKbps", { valueAsNumber: true })} className={inputClass} />
            {errors.uploadKbps && <p className="text-[10px] text-red-500 mt-1">{errors.uploadKbps.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium">Bajada Max (Kbps)</label>
            <input type="number" {...register("downloadKbps", { valueAsNumber: true })} className={inputClass} />
            {errors.downloadKbps && <p className="text-[10px] text-red-500 mt-1">{errors.downloadKbps.message}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Válido Desde</label>
          <input type="date" {...register("validFrom")} className={inputClass} />
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button type="submit" disabled={!isValid} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50">Crear Borrador</button>
        </div>
      </form>
    </SimpleDialog>
  )
}

export function ChangePlanStatusDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal, selectedPlanId } = usePlansStore();
  const { data } = usePlan(companyId, selectedPlanId);
  const { changePlanStatus } = usePlanMutations(companyId);

  const isInactive = data?.status === 'inactive';

  const onConfirm = () => {
    if (selectedPlanId && data) {
      changePlanStatus.mutate({ planId: selectedPlanId, status: isInactive ? 'active' : 'inactive' }, { onSuccess: () => setActiveModal('none') });
    }
  }

  return (
    <SimpleDialog open={activeModal === 'change_status'} onClose={() => setActiveModal('none')} title="Cambiar Estado Comercial">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Estás a punto de <strong>{isInactive ? 'Activar' : 'Inactivar'}</strong> el plan &quot;{data?.name}&quot;.
        </p>
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md text-xs text-amber-500">
          Esta acción solo afecta las nuevas ventas y asignaciones. Los contratos de servicios históricos asociados a este plan permanecerán intactos y sus reglas de velocidad seguirán operando con normalidad.
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <button onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Confirmar Acción</button>
        </div>
      </div>
    </SimpleDialog>
  )
}
