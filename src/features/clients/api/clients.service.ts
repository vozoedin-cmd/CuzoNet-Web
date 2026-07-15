import {
  apiClient,
  type ApiRequestOptions,
} from '@/services/api/api-client';

export type ClientStatus = 'active' | 'archived';
export type ClientType = 'person' | 'company';
export type ClientContactType = 'phone' | 'email' | 'whatsapp';

export interface ClientContact {
  type: ClientContactType;
  value: string;
  isPrimary: boolean;
}

export interface ClientAddress {
  addressLine: string;
  isServiceAddress: boolean;
  label?: string;
  latitude?: number;
  longitude?: number;
}

export interface ClientDto {
  id: string;
  clientType: ClientType;
  legalName: string;
  documentType: string;
  documentNumber: string;
  status: ClientStatus;
  contacts: readonly ClientContact[];
  addresses: readonly ClientAddress[];
  createdAt: string;
  updatedAt?: string;
}

export interface ClientPageDto {
  data: readonly ClientDto[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ClientServiceDto {
  billingDay: number;
  clientId: string;
  id: string;
  lifecycleStatus: string;
  planVersionId: string;
  serviceType: string;
  startedOn?: string;
}

export interface ClientAccountDto {
  clientId: string;
  creditCents: number;
  currencyCode: string;
  debtCents: number;
  invoiceCount: number;
  nextDueOn: string | null;
  overdueCents: number;
}

export interface GetClientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ClientStatus;
}

export interface CreateClientRequest {
  clientType: ClientType;
  legalName: string;
  documentType: string;
  documentNumber: string;
  contacts?: readonly ClientContact[];
  addresses?: readonly ClientAddress[];
  note?: string;
}

export interface UpdateClientRequest {
  legalName?: string;
  contacts?: readonly ClientContact[];
  addresses?: readonly ClientAddress[];
}

export type ClientMutationOptions = Pick<
  ApiRequestOptions,
  'correlationId' | 'idempotencyKey' | 'signal'
>;

function buildClientsQuery(params: GetClientsParams): string {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.set('page', String(params.page));
  if (params.pageSize !== undefined) query.set('pageSize', String(params.pageSize));
  if (params.search !== undefined && params.search.length > 0) {
    query.set('search', params.search);
  }
  if (params.status !== undefined) query.set('status', params.status);

  const serialized = query.toString();
  return serialized.length > 0 ? '?' + serialized : '';
}

function mutationOptions(options: ClientMutationOptions = {}): ApiRequestOptions {
  return {
    ...options,
    idempotencyKey: options.idempotencyKey ?? crypto.randomUUID(),
  };
}

export const clientsService = {
  getClients: (params: GetClientsParams, signal?: AbortSignal): Promise<ClientPageDto> =>
    apiClient.get<ClientPageDto>('/clientes' + buildClientsQuery(params), { signal }),

  getClient: (clientId: string, signal?: AbortSignal): Promise<ClientDto> =>
    apiClient.get<ClientDto>('/clientes/' + clientId, { signal }),

  getClientServices: (clientId: string, signal?: AbortSignal): Promise<ClientServiceDto[]> =>
    apiClient.get<ClientServiceDto[]>('/clientes/' + clientId + '/servicios', { signal }),

  getClientAccount: (clientId: string, signal?: AbortSignal): Promise<ClientAccountDto> =>
    apiClient.get<ClientAccountDto>('/clientes/' + clientId + '/cuenta', { signal }),

  create: (
    data: CreateClientRequest,
    options?: ClientMutationOptions,
  ): Promise<ClientDto> =>
    apiClient.post<ClientDto, CreateClientRequest>(
      '/clientes',
      data,
      mutationOptions(options),
    ),

  update: (
    clientId: string,
    data: UpdateClientRequest,
    options?: ClientMutationOptions,
  ): Promise<ClientDto> =>
    apiClient.put<ClientDto, UpdateClientRequest>(
      '/clientes/' + clientId,
      data,
      mutationOptions(options),
    ),

  archive: (clientId: string, options?: ClientMutationOptions): Promise<void> =>
    apiClient.delete<void>('/clientes/' + clientId, mutationOptions(options)),
};
