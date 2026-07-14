
import { apiClient } from '@/services/api/api-client';

export type ClientStatus = 'active' | 'archived' | 'delinquent';
export type ClientType = 'person' | 'company';

export interface ClientAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary: boolean;
}

export interface ClientContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface ClientServiceDto {
  id: string;
  planName: string;
  status: 'active' | 'suspended' | 'cancelled';
  price: number;
  installedAt: string;
}

export interface ClientAccountDto {
  balance: number;
  currency: string;
  lastInvoiceDate: string | null;
  status: 'up_to_date' | 'in_arrears';
}

export interface ClientDto {
  id: string;
  type: ClientType;
  legalName: string;
  documentId: string;
  status: ClientStatus;
  primaryPhone: string;
  primaryEmail: string;
  createdAt: string;
  servicesCount: number;
  balance: number;
}

export interface ClientDetailsDto extends ClientDto {
  addresses: ClientAddress[];
  contacts: ClientContact[];
  notes: string;
  updatedAt: string;
}

export interface ClientStatsDto {
  total: number;
  active: number;
  archived: number;
  withServices: number;
  delinquent: number;
}

export interface GetClientsParams {
  search?: string;
  status?: string;
  type?: string;
  document?: string;
  phone?: string;
  page?: number;
  limit?: number;
}

export interface GetClientsResponse {
  clients: ClientDto[];
  stats: ClientStatsDto;
  total: number;
}

const isDemo = () => process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

export const clientsService = {
  getClients: async (companyId: string, params: GetClientsParams): Promise<GetClientsResponse> => {
    if (isDemo()) {
      const { getDemoClients } = await import('../model/demo-clients.fixture');
      let data = getDemoClients().clients;
      if (params.search) data = data.filter(c => c.legalName.toLowerCase().includes(params.search!.toLowerCase()) || c.documentId.includes(params.search!));
      if (params.status) data = data.filter(c => c.status === params.status);
      if (params.type) data = data.filter(c => c.type === params.type);
      return { clients: data, stats: getDemoClients().stats, total: data.length };
    }
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return await apiClient.get<GetClientsResponse>(`/clientes?companyId=${companyId}&${query}`);
  },

  getClient: async (companyId: string, clientId: string): Promise<ClientDetailsDto> => {
    if (isDemo()) {
      const { getDemoClientDetails } = await import('../model/demo-clients.fixture');
      return getDemoClientDetails(clientId);
    }
    return await apiClient.get<ClientDetailsDto>(`/clientes/${clientId}?companyId=${companyId}`);
  },

  getClientServices: async (companyId: string, clientId: string): Promise<ClientServiceDto[]> => {
    if (isDemo()) {
      const { getDemoClientServices } = await import('../model/demo-clients.fixture');
      return getDemoClientServices(clientId);
    }
    return await apiClient.get<ClientServiceDto[]>(`/clientes/${clientId}/servicios?companyId=${companyId}`);
  },

  getClientAccount: async (companyId: string, clientId: string): Promise<ClientAccountDto> => {
    if (isDemo()) {
      const { getDemoClientAccount } = await import('../model/demo-clients.fixture');
      return getDemoClientAccount(clientId);
    }
    return await apiClient.get<ClientAccountDto>(`/clientes/${clientId}/cuenta?companyId=${companyId}`);
  },

  create: async (companyId: string, data: Partial<ClientDetailsDto>): Promise<ClientDto> => {
    if (isDemo()) return { ...data, id: 'cli-new' } as ClientDto;
    return await apiClient.post<ClientDto>(`/clientes?companyId=${companyId}`, data);
  },

  update: async (companyId: string, clientId: string, data: Partial<ClientDetailsDto>): Promise<ClientDto> => {
    if (isDemo()) return { ...data, id: clientId } as ClientDto;
    return await apiClient.put<ClientDto>(`/clientes/${clientId}?companyId=${companyId}`, data);
  },

  archive: async (companyId: string, clientId: string): Promise<void> => {
    if (isDemo()) return;
    await apiClient.delete<void>(`/clientes/${clientId}?companyId=${companyId}`);
  }
};
