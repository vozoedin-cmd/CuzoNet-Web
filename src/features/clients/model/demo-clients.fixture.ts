
import { ClientDto, ClientDetailsDto, ClientStatsDto, ClientServiceDto, ClientAccountDto } from '../api/clients.service';

export const getDemoClients = (): { clients: ClientDto[], stats: ClientStatsDto } => {
  const clients: ClientDto[] = [
    {
      id: 'cli-001',
      type: 'company',
      legalName: 'Corp Solutions S.A. de C.V.',
      documentId: 'CSO123456789',
      status: 'active',
      primaryPhone: '+52 55 1234 5678',
      primaryEmail: 'contacto@corpsolutions.com',
      createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
      servicesCount: 3,
      balance: 0,
    },
    {
      id: 'cli-002',
      type: 'person',
      legalName: 'Juan Pérez',
      documentId: 'PERJ800101XYZ',
      status: 'active',
      primaryPhone: '+52 55 9876 5432',
      primaryEmail: 'juan.perez@email.com',
      createdAt: new Date(Date.now() - 86400000 * 150).toISOString(),
      servicesCount: 1,
      balance: 1500,
    },
    {
      id: 'cli-003',
      type: 'person',
      legalName: 'María García',
      documentId: 'GARM900505ABC',
      status: 'delinquent',
      primaryPhone: '+52 55 5555 4444',
      primaryEmail: 'maria.g@email.com',
      createdAt: new Date(Date.now() - 86400000 * 50).toISOString(),
      servicesCount: 1,
      balance: 4500,
    },
    {
      id: 'cli-004',
      type: 'company',
      legalName: 'Tech Innovators LLC',
      documentId: 'TIL098765432',
      status: 'archived',
      primaryPhone: '+1 800 555 0199',
      primaryEmail: 'admin@techinnovators.com',
      createdAt: new Date(Date.now() - 86400000 * 500).toISOString(),
      servicesCount: 0,
      balance: 0,
    }
  ];

  const stats: ClientStatsDto = {
    total: 1250,
    active: 1100,
    archived: 100,
    withServices: 1120,
    delinquent: 50
  };

  return { clients, stats };
};

export const getDemoClientDetails = (id: string): ClientDetailsDto => {
  const base = getDemoClients().clients.find(c => c.id === id) || getDemoClients().clients[0];
  return {
    ...base,
    updatedAt: new Date().toISOString(),
    notes: 'Cliente preferencial. Renovar contrato en 6 meses.',
    addresses: [
      { id: 'addr-1', street: 'Av. Paseo de la Reforma 222', city: 'Ciudad de México', state: 'CDMX', zipCode: '06600', isPrimary: true }
    ],
    contacts: [
      { id: 'cnt-1', name: base.legalName, phone: base.primaryPhone, email: base.primaryEmail, isPrimary: true }
    ]
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getDemoClientServices = (id: string): ClientServiceDto[] => {
  return [
    { id: 'srv-1', planName: 'Fibra Óptica 500Mbps Corp', status: 'active', price: 2500, installedAt: new Date(Date.now() - 86400000 * 200).toISOString() }
  ];
};

export const getDemoClientAccount = (id: string): ClientAccountDto => {
  return {
    balance: id === 'cli-003' ? 4500 : 0,
    currency: 'MXN',
    lastInvoiceDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: id === 'cli-003' ? 'in_arrears' : 'up_to_date'
  };
};
