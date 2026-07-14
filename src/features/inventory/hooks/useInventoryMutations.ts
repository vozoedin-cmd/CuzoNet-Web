
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService, EquipmentDto, EquipmentStatus, EquipmentInterface } from '../api/inventory.service';

export function useInventoryMutations(companyId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['inventory'] });

  const createEq = useMutation({
    mutationFn: (data: Partial<EquipmentDto>) => inventoryService.create(companyId, data),
    onSuccess: invalidate,
  });

  const updateEq = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EquipmentDto> }) => inventoryService.update(companyId, id, data),
    onSuccess: invalidate,
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EquipmentStatus }) => inventoryService.changeStatus(companyId, id, status),
    onSuccess: invalidate,
  });

  const registerIf = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EquipmentInterface> }) => inventoryService.registerInterface(companyId, id, data),
    onSuccess: invalidate,
  });

  const assignEq = useMutation({
    mutationFn: ({ id, targetType, targetId, reason }: { id: string; targetType: string; targetId: string; reason: string }) => 
      inventoryService.assign(companyId, id, { targetType, targetId, reason }),
    onSuccess: invalidate,
  });

  const releaseEq = useMutation({
    mutationFn: ({ id, assignmentId }: { id: string; assignmentId: string }) => inventoryService.release(companyId, id, assignmentId),
    onSuccess: invalidate,
  });

  return { createEq, updateEq, changeStatus, registerIf, assignEq, releaseEq };
}
