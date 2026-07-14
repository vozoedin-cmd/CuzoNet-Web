
import { apiClient } from '@/services/api/api-client';

export type NodeStatus = 'active' | 'degraded' | 'offline' | 'inactive';

export interface TopologyNode {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'olt' | 'antenna';
  status: NodeStatus;
  availability: number;
  affectedClients: number;
  lat: number;
  lng: number;
}

export interface TopologyLink {
  id: string;
  sourceId: string;
  targetId: string;
  status: NodeStatus;
  capacityGbps: number;
  usagePercentage: number;
  latencyMs: number;
}

export interface NetworkTopologyDto {
  nodes: TopologyNode[];
  links: TopologyLink[];
}

// FIXTURE DEMO (Solo para desarrollo)
const DEMO_FIXTURE: NetworkTopologyDto = {
  nodes: [
    { id: 'n1', name: 'Core Router Norte', type: 'router', status: 'active', availability: 99.9, affectedClients: 0, lat: 20.659698, lng: -103.349609 },
    { id: 'n2', name: 'OLT Centro', type: 'olt', status: 'active', availability: 99.8, affectedClients: 0, lat: 20.676667, lng: -103.3475 },
    { id: 'n3', name: 'Antena Sur', type: 'antenna', status: 'degraded', availability: 95.0, affectedClients: 45, lat: 20.6200, lng: -103.3800 },
    { id: 'n4', name: 'Switch Este', type: 'switch', status: 'offline', availability: 0.0, affectedClients: 120, lat: 20.6400, lng: -103.3100 },
  ],
  links: [
    { id: 'l1', sourceId: 'n1', targetId: 'n2', status: 'active', capacityGbps: 10, usagePercentage: 45, latencyMs: 2 },
    { id: 'l2', sourceId: 'n1', targetId: 'n3', status: 'degraded', capacityGbps: 1, usagePercentage: 85, latencyMs: 15 },
    { id: 'l3', sourceId: 'n2', targetId: 'n4', status: 'offline', capacityGbps: 1, usagePercentage: 0, latencyMs: 0 },
  ]
};

export const networkService = {
  getTopology: async (companyId: string) => {
    try {
      return await apiClient.get<NetworkTopologyDto>('/network/topology?companyId=' + companyId);
    } catch (error) {
      // Retornar fixture de demostración si falla el backend (solo en dev)
      console.warn('Usando FIXTURE de desarrollo para topología de red', error);
      return DEMO_FIXTURE;
    }
  }
};
