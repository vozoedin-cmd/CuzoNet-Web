import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import type { ApiError } from '@/services/api/api-client';

import {
  clientsService,
  type ClientAccountDto,
  type ClientDto,
  type ClientMutationOptions,
  type ClientPageDto,
  type ClientServiceDto,
  type CreateClientRequest,
  type GetClientsParams,
  type UpdateClientRequest,
} from '../api/clients.service';

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (params: GetClientsParams) => [...clientKeys.lists(), params] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (clientId: string) => [...clientKeys.details(), clientId] as const,
  services: (clientId: string) => [...clientKeys.all, 'services', clientId] as const,
  account: (clientId: string) => [...clientKeys.all, 'account', clientId] as const,
};

export function useClients(params: GetClientsParams) {
  return useQuery<ClientPageDto, ApiError>({
    queryKey: clientKeys.list(params),
    queryFn: ({ signal }) => clientsService.getClients(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function useClient(clientId: string | null) {
  return useQuery<ClientDto, ApiError>({
    queryKey: clientKeys.detail(clientId ?? ''),
    queryFn: ({ signal }) => clientsService.getClient(clientId as string, signal),
    enabled: clientId !== null,
  });
}

export function useClientServices(clientId: string | null) {
  return useQuery<ClientServiceDto[], ApiError>({
    queryKey: clientKeys.services(clientId ?? ''),
    queryFn: ({ signal }) => clientsService.getClientServices(clientId as string, signal),
    enabled: clientId !== null,
  });
}

export function useClientAccount(clientId: string | null) {
  return useQuery<ClientAccountDto, ApiError>({
    queryKey: clientKeys.account(clientId ?? ''),
    queryFn: ({ signal }) => clientsService.getClientAccount(clientId as string, signal),
    enabled: clientId !== null,
  });
}

interface UpdateClientVariables {
  id: string;
  data: UpdateClientRequest;
  options?: ClientMutationOptions;
}

interface ArchiveClientVariables {
  id: string;
  options?: ClientMutationOptions;
}

interface CreateClientVariables {
  data: CreateClientRequest;
  options?: ClientMutationOptions;
}

export function useClientMutations() {
  const queryClient = useQueryClient();

  const invalidateLists = () =>
    queryClient.invalidateQueries({ queryKey: clientKeys.lists() });

  const createClient = useMutation<ClientDto, ApiError, CreateClientVariables>({
    mutationFn: ({ data, options }) => clientsService.create(data, options),
    onSuccess: (client) => {
      queryClient.setQueryData(clientKeys.detail(client.id), client);
      void invalidateLists();
    },
  });

  const updateClient = useMutation<ClientDto, ApiError, UpdateClientVariables>({
    mutationFn: ({ id, data, options }) => clientsService.update(id, data, options),
    onSuccess: (client) => {
      queryClient.setQueryData(clientKeys.detail(client.id), client);
      void invalidateLists();
      void queryClient.invalidateQueries({ queryKey: clientKeys.detail(client.id) });
    },
  });

  const archiveClient = useMutation<void, ApiError, ArchiveClientVariables>({
    mutationFn: ({ id, options }) => clientsService.archive(id, options),
    onSuccess: (_, { id }) => {
      void invalidateLists();
      void queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: clientKeys.services(id) });
      void queryClient.invalidateQueries({ queryKey: clientKeys.account(id) });
    },
  });

  return { archiveClient, createClient, updateClient };
}
