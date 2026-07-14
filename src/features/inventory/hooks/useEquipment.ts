
import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '../api/inventory.service';

export function useEquipment(companyId: string, equipmentId: string | null) {
  return useQuery({
    queryKey: ['inventory', 'detail', companyId, equipmentId],
    queryFn: () => inventoryService.getEquipment(companyId, equipmentId!),
    enabled: !!equipmentId,
  });
}
