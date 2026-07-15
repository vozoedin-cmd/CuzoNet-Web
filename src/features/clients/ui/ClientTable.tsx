import type { ClientContactType, ClientDto } from '../api/clients.service';
import { useClientsStore } from '../model/clients.store';
import { ClientStatusBadge, ClientTypeBadge } from './ClientBadges';

function getPrimaryContact(client: ClientDto, type: ClientContactType): string {
  return (
    client.contacts.find((contact) => contact.type === type && contact.isPrimary)?.value ??
    client.contacts.find((contact) => contact.type === type)?.value ??
    'No registrado'
  );
}

export function ClientTable({ clients }: { clients: readonly ClientDto[] }) {
  const selectClient = useClientsStore((state) => state.selectClient);

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Documento</th>
            <th className="px-4 py-3 font-medium">Contacto</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Creado</th>
            <th className="px-4 py-3 font-medium">Actualizado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {clients.map((client) => (
            <tr
              key={client.id}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectClient(client.id)}
            >
              <td className="px-4 py-3">
                <ClientTypeBadge type={client.clientType} />
                <p className="font-semibold mt-1">{client.legalName}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-xs text-muted-foreground">{client.documentType}</p>
                <p className="font-mono text-xs">{client.documentNumber}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-xs">{getPrimaryContact(client, 'phone')}</p>
                <p className="text-xs text-muted-foreground">
                  {getPrimaryContact(client, 'email')}
                </p>
              </td>
              <td className="px-4 py-3">
                <ClientStatusBadge status={client.status} />
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {new Date(client.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {client.updatedAt
                  ? new Date(client.updatedAt).toLocaleDateString()
                  : 'Sin cambios'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
