import { PageHeader } from '@/components/layout/PageHeader';
import { PlansOverview } from '@/features/plans';

export default function PlansPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Catálogo de planes comerciales"
        description="Planes vigentes y revisión de sus versiones"
        breadcrumb={[{ label: 'Planes' }]}
      />
      <PlansOverview />
    </div>
  );
}
