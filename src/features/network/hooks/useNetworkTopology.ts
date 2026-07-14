
import { useQuery } from '@tanstack/react-query';
import { networkService } from '../api/network.service';

export function useNetworkTopology(companyId: string) {
  return useQuery({
    queryKey: ['network', 'topology', companyId],
    queryFn: () => networkService.getTopology(companyId),
    refetchInterval: 30000, // Actualización cada 30 segundos
  });
}
