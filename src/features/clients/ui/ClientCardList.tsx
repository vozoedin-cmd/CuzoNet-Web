import type { ClientContactType, ClientDto } from '../api/clients.service';
import { useClientsStore } from '../model/clients.store';
import { ClientStatusBadge, ClientTypeBadge } from './ClientBadges';

function getContact(client: ClientDto, type: ClientContactType): string {
  return (
    client.contacts.find((contact) => contact.type === type && contact.isPrimary)?.value ??
    client.contacts.find((contact) => contact.type === type)?.value ??
    'No registrado'
  );
}

export function ClientCardList({ clients }: { clients: readonly ClientDto[] }) {
  const selectClient = useClientsStore((state) => state.selectClient);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <button
          type="button"
          key={client.id}
          className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors flex flex-col gap-3 text-left"
          onClick={() => selectClient(client.id)}
        >
          <div className="flex items-center justify-between border-b pb-2 w-full">
            <ClientTypeBadge type={client.clientType} />
            <ClientStatusBadge status={client.status} />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">{client.legalName}</h4>
            <p className="text-xs text-muted-foreground font-mono">
              {client.documentType}: {client.documentNumber}
            </p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border w-full">
            {getContact(client, 'phone')}
            <br />
            {getContact(client, 'email')}
          </div>
          <span className="text-[10px] text-muted-foreground mt-auto">
            Creado {new Date(client.createdAt).toLocaleDateString()}
          </span>
        </button>
      ))}
    </div>
  );
}
