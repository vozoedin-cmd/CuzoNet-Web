'use client';

import * as React from 'react';
import { LayoutGrid, LayoutList, LoaderCircle } from 'lucide-react';

import { usePlans } from '../hooks/usePlans';
import { usePlansStore } from '../model/plans.store';
import { PlanCardList } from './PlanCardList';
import { PlanDetailsDrawer } from './PlanDetailsDrawer';
import { CreatePlanDialog, RevisePlanDialog } from './PlanDialogs';
import { PlanFilters } from './PlanFilters';
import { PlanStatsGrid } from './PlanStatsGrid';
import { PlanTable } from './PlanTable';
import { PlansEmpty, PlansError, PlansSkeleton } from './PlansStates';

export function PlansOverview() {
  const filters = usePlansStore((state) => state.filters);
  const selectedPlanId = usePlansStore((state) => state.selectedPlanId);
  const setViewMode = usePlansStore((state) => state.setViewMode);
  const viewMode = usePlansStore((state) => state.viewMode);
  const plansQuery = usePlans();

  const filteredPlans = React.useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return (plansQuery.data ?? []).filter((plan) => {
      if (
        filters.isActive === 'active' &&
        !plan.isActive
      ) {
        return false;
      }
      if (
        filters.isActive === 'inactive' &&
        plan.isActive
      ) {
        return false;
      }
      if (
        filters.serviceType !== '' &&
        plan.serviceType !== filters.serviceType
      ) {
        return false;
      }
      if (
        search.length > 0 &&
        !plan.code.toLowerCase().includes(search) &&
        !plan.name.toLowerCase().includes(search)
      ) {
        return false;
      }
      return true;
    });
  }, [filters, plansQuery.data]);

  const selectedPlan = plansQuery.data?.find(
    (plan) => plan.id === selectedPlanId,
  );

  if (plansQuery.isPending) return <PlansSkeleton />;

  if (plansQuery.isError) {
    return (
      <PlansError
        error={plansQuery.error}
        onRetry={() => void plansQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 relative pb-10">
      <PlanStatsGrid plans={plansQuery.data} />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full">
          <PlanFilters />
        </div>
        <div className="flex items-center gap-2 border bg-card p-1 rounded-lg">
          <button
            type="button"
            className={
              'p-2 rounded-md ' +
              (viewMode === 'table' ? 'bg-muted' : 'hover:bg-muted/50')
            }
            onClick={() => setViewMode('table')}
            title="Vista de tabla"
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={
              'p-2 rounded-md ' +
              (viewMode === 'cards' ? 'bg-muted' : 'hover:bg-muted/50')
            }
            onClick={() => setViewMode('cards')}
            title="Vista de tarjetas"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {plansQuery.isFetching && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Actualizando planes…
        </p>
      )}

      {filteredPlans.length === 0 ? (
        <PlansEmpty />
      ) : viewMode === 'table' ? (
        <>
          <div className="hidden md:block">
            <PlanTable plans={filteredPlans} />
          </div>
          <div className="block md:hidden">
            <PlanCardList plans={filteredPlans} />
          </div>
        </>
      ) : (
        <PlanCardList plans={filteredPlans} />
      )}

      <PlanDetailsDrawer plan={selectedPlan} />
      <CreatePlanDialog />
      <RevisePlanDialog plan={selectedPlan} />
    </div>
  );
}
