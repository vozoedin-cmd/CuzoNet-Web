
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useClientsStore } from "../model/clients.store"
import { useClientMutations } from "../hooks/useClients"

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

const clientSchema = z.object({
  type: z.enum(['person', 'company']),
  legalName: z.string().min(2, "Requerido"),
  documentId: z.string().min(5, "Requerido"),
  primaryPhone: z.string().min(7, "Requerido"),
  primaryEmail: z.string().email("Email inválido"),
  notes: z.string().optional()
})

export function ClientFormDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal } = useClientsStore();
  const { createClient } = useClientMutations(companyId);
  
  const isCreate = activeModal === 'create';
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: { type: 'person' }
  });

  const onSubmit = (data: z.infer<typeof clientSchema>) => {
    if (isCreate) {
      createClient.mutate(data, { onSuccess: () => setActiveModal('none') });
    }
  }

  return (
    <SimpleDialog open={isCreate || activeModal === 'edit'} onClose={() => setActiveModal('none')} title={isCreate ? "Nuevo Cliente" : "Editar Cliente"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Tipo</label>
            <select {...register("type")} className={inputClass} disabled={!isCreate}>
              <option value="person">Persona Física</option>
              <option value="company">Empresa / Moral</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Documento / RFC</label>
            <input {...register("documentId")} className={inputClass} />
            {errors.documentId && <p className="text-[10px] text-red-500 mt-1">{errors.documentId.message}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Nombre Completo / Razón Social</label>
          <input {...register("legalName")} className={inputClass} />
          {errors.legalName && <p className="text-[10px] text-red-500 mt-1">{errors.legalName.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Teléfono Principal</label>
            <input {...register("primaryPhone")} className={inputClass} />
            {errors.primaryPhone && <p className="text-[10px] text-red-500 mt-1">{errors.primaryPhone.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium">Email Principal</label>
            <input type="email" {...register("primaryEmail")} className={inputClass} />
            {errors.primaryEmail && <p className="text-[10px] text-red-500 mt-1">{errors.primaryEmail.message}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Notas Iniciales</label>
          <textarea {...register("notes")} className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" />
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button type="submit" disabled={!isValid} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50">Guardar</button>
        </div>
      </form>
    </SimpleDialog>
  )
}

export function ArchiveClientDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal, selectedClientId } = useClientsStore();
  const { archiveClient } = useClientMutations(companyId);

  const onConfirm = () => {
    if (selectedClientId) {
      archiveClient.mutate(selectedClientId, { onSuccess: () => setActiveModal('none') });
    }
  }

  return (
    <SimpleDialog open={activeModal === 'archive'} onClose={() => setActiveModal('none')} title="Archivar Cliente">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Archivar un cliente suspenderá su actividad en el sistema sin eliminar sus datos históricos, facturas o bitácoras. Los servicios asociados deben ser liberados manualmente.
        </p>
        <div className="pt-4 flex justify-end gap-2">
          <button onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm">Confirmar Archivado</button>
        </div>
      </div>
    </SimpleDialog>
  )
}
