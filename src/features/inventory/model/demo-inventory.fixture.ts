
import { EquipmentDto, EquipmentDetailsDto, InventoryStatsDto } from '../api/inventory.service';

export const getDemoInventory = (): { equipments: EquipmentDto[], stats: InventoryStatsDto } => {
  const equipments: EquipmentDto[] = [
    {
      id: 'eq-001',
      type: 'router',
      role: 'core',
      manufacturer: 'MikroTik',
      model: 'CCR2116-12G-4S+',
      serialNumber: 'HE39281B2A',
      macAddress: '4C:5E:0C:1A:2B:3C',
      status: 'active',
      capabilities: ['bgp', 'ospf', 'mpls'],
      location: 'DC Norte - Rack 1',
      activeAssignmentId: null,
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'eq-002',
      type: 'generic_equipment',
      role: 'distribution',
      manufacturer: 'Huawei',
      model: 'MA5800-X15',
      serialNumber: 'HWTC4A39281B',
      macAddress: '00:1E:10:1F:2C:3B',
      status: 'active',
      capabilities: ['fiber'],
      location: 'Nodo Sur - Gabinete 2',
      activeAssignmentId: null,
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'eq-003',
      type: 'cpe',
      role: 'access',
      manufacturer: 'TP-Link',
      model: 'Archer C6',
      serialNumber: '21948392019',
      macAddress: 'D8:47:32:1A:2C:9F',
      status: 'assigned',
      capabilities: ['wifi5', 'gigabit'],
      location: 'Cliente - Av. Siempre Viva 742',
      activeAssignmentId: 'asg-001',
      updatedAt: new Date(Date.now() - 150000).toISOString(),
    },
    {
      id: 'eq-004',
      type: 'switch',
      role: 'access',
      manufacturer: 'Ubiquiti',
      model: 'USW-Pro-48-PoE',
      serialNumber: 'UBNT492810',
      macAddress: 'F0:9F:C2:11:22:33',
      status: 'inactive',
      capabilities: ['poe+', 'layer3'],
      location: 'Bodega Principal',
      activeAssignmentId: null,
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  const stats: InventoryStatsDto = {
    total: 450,
    active: 320,
    inactive: 15,
    retired: 5,
    assigned: 110,
    available: 15,
  };

  return { equipments, stats };
};

export const getDemoEquipmentDetails = (id: string): EquipmentDetailsDto => {
  const base = getDemoInventory().equipments.find(a => a.id === id) || getDemoInventory().equipments[0];
  
  return {
    ...base,
    firmwareVersion: 'v7.12.1',
    adminState: 'enabled',
    operState: base.status === 'inactive' ? 'down' : 'up',
    interfaces: [
      { id: 'if-1', name: 'ether1', type: 'ethernet', mac: '4C:5E:0C:1A:2B:3C', adminState: 'up', operState: 'up', speedMbps: 1000 },
      { id: 'if-2', name: 'sfp1', type: 'optical', mac: '4C:5E:0C:1A:2B:3D', adminState: 'up', operState: 'down', speedMbps: 10000 },
    ],
    assignmentHistory: [
      { id: 'h1', targetType: 'client', targetId: 'cli-99', assignedAt: new Date(Date.now() - 86400000 * 30).toISOString(), releasedAt: new Date(Date.now() - 86400000 * 2).toISOString(), reason: 'Cambio de domicilio' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 365).toISOString(),
  };
};
