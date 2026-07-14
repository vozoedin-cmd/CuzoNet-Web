
import { apiClient } from '@/services/api/api-client';

export type EquipmentType = 'router' | 'access_point' | 'switch' | 'cpe' | 'ptp_radio' | 'battery' | 'solar_panel' | 'generic_equipment';
export type EquipmentRole = 'core' | 'distribution' | 'access' | 'client';
export type EquipmentStatus = 'active' | 'inactive' | 'retired' | 'assigned';

export interface EquipmentDto {
  id: string;
  type: EquipmentType;
  role: EquipmentRole;
  manufacturer: string;
  model: string;
  serialNumber: string;
  macAddress: string;
  status: EquipmentStatus;
  capabilities: string[];
  location: string;
  activeAssignmentId: string | null;
  updatedAt: string;
}

export interface InventoryStatsDto {
  total: number;
  active: number;
  inactive: number;
  retired: number;
  assigned: number;
  available: number;
}

export interface EquipmentInterface {
  id: string;
  name: string;
  type: 'ethernet' | 'optical' | 'wireless' | 'virtual';
  mac: string;
  adminState: 'up' | 'down';
  operState: 'up' | 'down' | 'unknown';
  speedMbps: number;
}

export interface AssignmentHistory {
  id: string;
  targetType: 'client' | 'service';
  targetId: string;
  assignedAt: string;
  releasedAt: string | null;
  reason: string;
}

export interface EquipmentDetailsDto extends EquipmentDto {
  firmwareVersion: string;
  adminState: 'enabled' | 'disabled';
  operState: 'up' | 'down' | 'degraded';
  interfaces: EquipmentInterface[];
  assignmentHistory: AssignmentHistory[];
  createdAt: string;
}

export interface GetEquipmentsParams {
  type?: string;
  role?: string;
  status?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  macAddress?: string;
  clientId?: string;
  serviceId?: string;
  page?: number;
  limit?: number;
}

export interface GetEquipmentsResponse {
  equipments: EquipmentDto[];
  stats: InventoryStatsDto;
  total: number;
}

const isDemo = () => process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

export const inventoryService = {
  getEquipments: async (companyId: string, params: GetEquipmentsParams): Promise<GetEquipmentsResponse> => {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return await apiClient.get<GetEquipmentsResponse>(`/equipos?companyId=${companyId}&${query}`);
    } catch (error) {
      if (isDemo()) {
        const { getDemoInventory } = await import('../model/demo-inventory.fixture');
        const data = getDemoInventory();
        let filtered = data.equipments;
        if (params.type) filtered = filtered.filter(e => e.type === params.type);
        if (params.role) filtered = filtered.filter(e => e.role === params.role);
        if (params.status) filtered = filtered.filter(e => e.status === params.status);
        if (params.manufacturer) filtered = filtered.filter(e => e.manufacturer.toLowerCase().includes(params.manufacturer!.toLowerCase()));
        
        return { equipments: filtered, stats: data.stats, total: filtered.length };
      }
      throw error;
    }
  },

  getEquipment: async (companyId: string, equipmentId: string): Promise<EquipmentDetailsDto> => {
    try {
      return await apiClient.get<EquipmentDetailsDto>(`/equipos/${equipmentId}?companyId=${companyId}`);
    } catch (error) {
      if (isDemo()) {
        const { getDemoEquipmentDetails } = await import('../model/demo-inventory.fixture');
        return getDemoEquipmentDetails(equipmentId);
      }
      throw error;
    }
  },

  create: async (companyId: string, data: Partial<EquipmentDto>): Promise<EquipmentDto> => {
    if (isDemo()) return { ...data, id: 'eq-new' } as EquipmentDto;
    return await apiClient.post<EquipmentDto>(`/equipos?companyId=${companyId}`, data);
  },

  update: async (companyId: string, equipmentId: string, data: Partial<EquipmentDto>): Promise<EquipmentDto> => {
    if (isDemo()) return { ...data, id: equipmentId } as EquipmentDto;
    return await apiClient.put<EquipmentDto>(`/equipos/${equipmentId}?companyId=${companyId}`, data);
  },

  changeStatus: async (companyId: string, equipmentId: string, status: EquipmentStatus): Promise<void> => {
    if (isDemo()) return;
    await apiClient.put<void>(`/equipos/${equipmentId}/estado?companyId=${companyId}`, { status });
  },

  registerInterface: async (companyId: string, equipmentId: string, data: Partial<EquipmentInterface>): Promise<void> => {
    if (isDemo()) return;
    await apiClient.post<void>(`/equipos/${equipmentId}/interfaces?companyId=${companyId}`, data);
  },

  assign: async (companyId: string, equipmentId: string, data: { targetType: string, targetId: string, reason: string }): Promise<void> => {
    if (isDemo()) return;
    await apiClient.post<void>(`/equipos/${equipmentId}/asignaciones?companyId=${companyId}`, data);
  },

  release: async (companyId: string, equipmentId: string, assignmentId: string): Promise<void> => {
    if (isDemo()) return;
    await apiClient.put<void>(`/equipos/${equipmentId}/asignaciones/${assignmentId}/liberacion?companyId=${companyId}`);
  }
};
