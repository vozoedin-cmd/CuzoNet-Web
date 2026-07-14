
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService, GetClientsParams, ClientDetailsDto } from '../api/clients.service';

export function useClients(companyId: string, params: GetClientsParams) {
  return useQuery({
    queryKey: ['clients', companyId, params],
    queryFn: () => clientsService.getClients(companyId, params),
  });
}

export function useClient(companyId: string, clientId: string | null) {
  return useQuery({
    queryKey: ['client', 'detail', companyId, clientId],
    queryFn: () => clientsService.getClient(companyId, clientId!),
    enabled: !!clientId,
  });
}

export function useClientServices(companyId: string, clientId: string | null) {
  return useQuery({
    queryKey: ['client', 'services', companyId, clientId],
    queryFn: () => clientsService.getClientServices(companyId, clientId!),
    enabled: !!clientId,
  });
}

export function useClientAccount(companyId: string, clientId: string | null) {
  return useQuery({
    queryKey: ['client', 'account', companyId, clientId],
    queryFn: () => clientsService.getClientAccount(companyId, clientId!),
    enabled: !!clientId,
  });
}

export function useClientMutations(companyId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['clients'] });
  const invalidateDetail = (id: string) => queryClient.invalidateQueries({ queryKey: ['client', 'detail', companyId, id] });

  const createClient = useMutation({
    mutationFn: (data: Partial<ClientDetailsDto>) => clientsService.create(companyId, data),
    onSuccess: invalidate,
  });

  const updateClient = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientDetailsDto> }) => clientsService.update(companyId, id, data),
    onSuccess: (data, variables) => {
      invalidate();
      invalidateDetail(variables.id);
    },
  });

  const archiveClient = useMutation({
    mutationFn: (id: string) => clientsService.archive(companyId, id),
    onSuccess: invalidate,
  });

  return { createClient, updateClient, archiveClient };
}
