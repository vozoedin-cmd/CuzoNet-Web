import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type {
  ClientAddress,
  ClientContact,
  ClientDto,
  CreateClientRequest,
  UpdateClientRequest,
} from '../api/clients.service';
import { useClient, useClientMutations } from '../hooks/useClients';
import { useClientsStore } from '../model/clients.store';
import { ApiErrorNotice } from './ClientsStates';

interface SimpleDialogProps {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
}

function SimpleDialog({ open, onClose, title, children }: SimpleDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative bg-card border shadow-xl rounded-xl w-full max-w-2xl p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
}

const inputClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60';

const clientSchema = z.object({
  clientType: z.enum(['person', 'company']),
  legalName: z.string().trim().min(2, 'Ingresa al menos 2 caracteres').max(180),
  documentType: z.string().trim().min(1, 'El tipo de documento es requerido').max(32),
  documentNumber: z.string().trim().min(3, 'Ingresa al menos 3 caracteres').max(64),
  primaryPhone: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || /^\+[1-9]\d{7,14}$/.test(value),
      'Usa formato E.164, por ejemplo +50255555555',
    ),
  primaryEmail: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || z.string().email().safeParse(value).success,
      'Ingresa un email válido',
    ),
  addressLabel: z.string().trim().max(80),
  addressLine: z.string().trim().max(300),
  note: z.string().trim().max(2000),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const emptyValues: ClientFormValues = {
  clientType: 'person',
  legalName: '',
  documentType: '',
  documentNumber: '',
  primaryPhone: '',
  primaryEmail: '',
  addressLabel: '',
  addressLine: '',
  note: '',
};

function findContact(client: ClientDto, type: 'phone' | 'email'): string {
  return (
    client.contacts.find((contact) => contact.type === type && contact.isPrimary)?.value ??
    client.contacts.find((contact) => contact.type === type)?.value ??
    ''
  );
}

function valuesFromClient(client: ClientDto): ClientFormValues {
  const serviceAddress = client.addresses.find(
    (address) => address.isServiceAddress,
  );

  return {
    clientType: client.clientType,
    legalName: client.legalName,
    documentType: client.documentType,
    documentNumber: client.documentNumber,
    primaryPhone: findContact(client, 'phone'),
    primaryEmail: findContact(client, 'email'),
    addressLabel: serviceAddress?.label ?? '',
    addressLine: serviceAddress?.addressLine ?? '',
    note: '',
  };
}

function contactsFromValues(values: ClientFormValues): ClientContact[] {
  const contacts: ClientContact[] = [];
  if (values.primaryPhone.length > 0) {
    contacts.push({ type: 'phone', value: values.primaryPhone, isPrimary: true });
  }
  if (values.primaryEmail.length > 0) {
    contacts.push({ type: 'email', value: values.primaryEmail, isPrimary: true });
  }
  return contacts;
}

function addressesFromValues(values: ClientFormValues): ClientAddress[] {
  if (values.addressLine.length === 0) return [];

  return [
    {
      addressLine: values.addressLine,
      isServiceAddress: true,
      ...(values.addressLabel.length > 0 ? { label: values.addressLabel } : {}),
    },
  ];
}

function buildUpdateRequest(
  client: ClientDto,
  values: ClientFormValues,
): UpdateClientRequest {
  const untouchedContacts = client.contacts.filter(
    (contact) =>
      !(
        contact.isPrimary &&
        (contact.type === 'phone' || contact.type === 'email')
      ),
  );
  const untouchedAddresses = client.addresses.filter(
    (address) => !address.isServiceAddress,
  );

  return {
    legalName: values.legalName,
    contacts: [...untouchedContacts, ...contactsFromValues(values)],
    addresses: [...untouchedAddresses, ...addressesFromValues(values)],
  };
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-destructive mt-1">{message}</p> : null;
}

export function ClientFormDialog() {
  const activeModal = useClientsStore((state) => state.activeModal);
  const selectedClientId = useClientsStore((state) => state.selectedClientId);
  const setActiveModal = useClientsStore((state) => state.setActiveModal);
  const selectClient = useClientsStore((state) => state.selectClient);
  const isCreate = activeModal === 'create';
  const isEdit = activeModal === 'edit';
  const clientQuery = useClient(isEdit ? selectedClientId : null);
  const { createClient, updateClient } = useClientMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: emptyValues,
  });

  React.useEffect(() => {
    if (isCreate) {
      reset(emptyValues);
    } else if (isEdit && clientQuery.data) {
      reset(valuesFromClient(clientQuery.data));
    }
  }, [clientQuery.data, isCreate, isEdit, reset]);

  const close = () => {
    if (createClient.isPending || updateClient.isPending) return;
    createClient.reset();
    updateClient.reset();
    setActiveModal('none');
  };

  const onSubmit = (values: ClientFormValues) => {
    if (isCreate) {
      const request: CreateClientRequest = {
        clientType: values.clientType,
        legalName: values.legalName,
        documentType: values.documentType,
        documentNumber: values.documentNumber,
        ...(contactsFromValues(values).length > 0
          ? { contacts: contactsFromValues(values) }
          : {}),
        ...(addressesFromValues(values).length > 0
          ? { addresses: addressesFromValues(values) }
          : {}),
        ...(values.note.length > 0 ? { note: values.note } : {}),
      };

      createClient.mutate(
        { data: request },
        {
          onSuccess: (client) => {
            setActiveModal('none');
            selectClient(client.id);
          },
        },
      );
      return;
    }

    if (isEdit && clientQuery.data) {
      updateClient.mutate(
        {
          id: clientQuery.data.id,
          data: buildUpdateRequest(clientQuery.data, values),
        },
        { onSuccess: () => setActiveModal('none') },
      );
    }
  };

  const mutation = isCreate ? createClient : updateClient;

  return (
    <SimpleDialog
      open={isCreate || isEdit}
      onClose={close}
      title={isCreate ? 'Nuevo cliente' : 'Editar cliente'}
    >
      {isEdit && clientQuery.isPending ? (
        <p className="text-sm text-muted-foreground">Cargando cliente…</p>
      ) : isEdit && clientQuery.isError ? (
        <div className="text-destructive">
          <ApiErrorNotice error={clientQuery.error} />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium" htmlFor="client-type">
                Tipo
              </label>
              <select
                id="client-type"
                {...register('clientType')}
                className={inputClass}
                disabled={isEdit}
              >
                <option value="person">Persona</option>
                <option value="company">Empresa</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium" htmlFor="client-name">
                Nombre legal
              </label>
              <input id="client-name" {...register('legalName')} className={inputClass} />
              <FieldError message={errors.legalName?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium" htmlFor="document-type">
                Tipo de documento
              </label>
              <input
                id="document-type"
                {...register('documentType')}
                className={inputClass}
                disabled={isEdit}
              />
              <FieldError message={errors.documentType?.message} />
            </div>
            <div>
              <label className="text-xs font-medium" htmlFor="document-number">
                Número de documento
              </label>
              <input
                id="document-number"
                {...register('documentNumber')}
                className={inputClass}
                disabled={isEdit}
              />
              <FieldError message={errors.documentNumber?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium" htmlFor="primary-phone">
                Teléfono principal
              </label>
              <input
                id="primary-phone"
                placeholder="+50255555555"
                {...register('primaryPhone')}
                className={inputClass}
              />
              <FieldError message={errors.primaryPhone?.message} />
            </div>
            <div>
              <label className="text-xs font-medium" htmlFor="primary-email">
                Email principal
              </label>
              <input
                id="primary-email"
                type="email"
                {...register('primaryEmail')}
                className={inputClass}
              />
              <FieldError message={errors.primaryEmail?.message} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium" htmlFor="address-label">
                Etiqueta
              </label>
              <input
                id="address-label"
                {...register('addressLabel')}
                className={inputClass}
              />
              <FieldError message={errors.addressLabel?.message} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium" htmlFor="address-line">
                Dirección de servicio
              </label>
              <input
                id="address-line"
                {...register('addressLine')}
                className={inputClass}
              />
              <FieldError message={errors.addressLine?.message} />
            </div>
          </div>

          {isCreate && (
            <div>
              <label className="text-xs font-medium" htmlFor="client-note">
                Nota inicial
              </label>
              <textarea
                id="client-note"
                {...register('note')}
                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              />
              <FieldError message={errors.note?.message} />
            </div>
          )}

          {mutation.isError && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <ApiErrorNotice error={mutation.error} />
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              disabled={mutation.isPending}
              className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50"
            >
              {mutation.isPending ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      )}
    </SimpleDialog>
  );
}

export function ArchiveClientDialog() {
  const activeModal = useClientsStore((state) => state.activeModal);
  const selectedClientId = useClientsStore((state) => state.selectedClientId);
  const setActiveModal = useClientsStore((state) => state.setActiveModal);
  const setDrawerOpen = useClientsStore((state) => state.setDrawerOpen);
  const { archiveClient } = useClientMutations();

  const close = () => {
    if (!archiveClient.isPending) {
      archiveClient.reset();
      setActiveModal('none');
    }
  };

  const confirm = () => {
    if (!selectedClientId) return;

    archiveClient.mutate(
      { id: selectedClientId },
      {
        onSuccess: () => {
          setActiveModal('none');
          setDrawerOpen(false);
        },
      },
    );
  };

  return (
    <SimpleDialog
      open={activeModal === 'archive'}
      onClose={close}
      title="Archivar cliente"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          El cliente quedará archivado y conservará su historial. Esta operación no
          elimina sus datos.
        </p>
        {archiveClient.isError && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <ApiErrorNotice error={archiveClient.error} />
          </div>
        )}
        <div className="pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            disabled={archiveClient.isPending}
            className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={archiveClient.isPending || !selectedClientId}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm disabled:opacity-50"
          >
            {archiveClient.isPending ? 'Archivando…' : 'Confirmar archivado'}
          </button>
        </div>
      </div>
    </SimpleDialog>
  );
}
