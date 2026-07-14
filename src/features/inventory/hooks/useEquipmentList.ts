
import { useQuery } from '@tanstack/react-query';
import { inventoryService, GetEquipmentsParams } from '../api/inventory.service';

export function useEquipmentList(companyId: string, params: GetEquipmentsParams) {
  return useQuery({
    queryKey: ['inventory', companyId, params],
    queryFn: () => inventoryService.getEquipments(companyId, params),
    refetchInterval: 30000,
  });
}
