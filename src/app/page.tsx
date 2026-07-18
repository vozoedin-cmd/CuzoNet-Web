import { DashboardHeader, DashboardOverview } from '@/features/dashboard';

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader />
      <DashboardOverview />
    </div>
  );
}
