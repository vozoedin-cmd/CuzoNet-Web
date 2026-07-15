import { PageHeader } from '@/components/layout/PageHeader';
import { BillingOverview } from '@/features/billing';

export default function BillingPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Pagos y cuenta del cliente"
        description="Registro de pagos y consulta del resumen contractual"
        breadcrumb={[{ label: 'Billing' }]}
      />
      <BillingOverview />
    </div>
  );
}
