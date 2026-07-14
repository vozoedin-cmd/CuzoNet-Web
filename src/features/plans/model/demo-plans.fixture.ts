
import { PlanDto, PlanDetailsDto, PlanStatsDto, PlanVersionDto } from '../api/plans.service';

export const getDemoPlans = (): { plans: PlanDto[], stats: PlanStatsDto } => {
  const defaultVersion: PlanVersionDto = {
    id: 'pv-100',
    planId: 'plan-001',
    versionNumber: 1,
    status: 'published',
    priceCents: 49900,
    currencyCode: 'MXN',
    uploadKbps: 50000,
    downloadKbps: 100000,
    validFrom: new Date(Date.now() - 86400000 * 300).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
    publishedAt: new Date(Date.now() - 86400000 * 300).toISOString(),
  };

  const plans: PlanDto[] = [
    {
      id: 'plan-001',
      code: 'FIBRA-100',
      name: 'Fibra Óptica 100 Mbps',
      compatibleServiceType: 'pppoe',
      status: 'active',
      currentVersionId: 'pv-100',
      currentVersion: defaultVersion,
      versionsCount: 2,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'plan-002',
      code: 'WISP-50',
      name: 'Inalámbrico 50 Mbps',
      compatibleServiceType: 'simple_queue',
      status: 'active',
      currentVersionId: 'pv-200',
      currentVersion: { ...defaultVersion, id: 'pv-200', priceCents: 29900, uploadKbps: 10000, downloadKbps: 50000 },
      versionsCount: 1,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'plan-003',
      code: 'HOT-DIA',
      name: 'Ficha Hotspot 1 Día',
      compatibleServiceType: 'hotspot',
      status: 'inactive',
      versionsCount: 1,
      updatedAt: new Date().toISOString()
    },
  ];

  const stats: PlanStatsDto = {
    total: 35,
    active: 28,
    inactive: 7,
    draftVersions: 4,
    publishedVersions: 31,
    simpleQueueCount: 15
  };

  return { plans, stats };
};

export const getDemoPlanDetails = (id: string): PlanDetailsDto => {
  const base = getDemoPlans().plans.find(p => p.id === id) || getDemoPlans().plans[0];
  return {
    ...base,
    versions: [
      base.currentVersion || {
        id: 'pv-demo', planId: id, versionNumber: 1, status: 'published', priceCents: 10000, currencyCode: 'MXN', uploadKbps: 1000, downloadKbps: 1000, validFrom: new Date().toISOString(), createdAt: new Date().toISOString()
      },
      {
        id: 'pv-draft',
        planId: id,
        versionNumber: 2,
        status: 'draft',
        priceCents: (base.currentVersion?.priceCents || 10000) * 1.1,
        currencyCode: 'MXN',
        uploadKbps: (base.currentVersion?.uploadKbps || 1000) * 2,
        downloadKbps: (base.currentVersion?.downloadKbps || 1000) * 2,
        validFrom: new Date(Date.now() + 86400000 * 30).toISOString(),
        createdAt: new Date().toISOString(),
      }
    ]
  };
};
