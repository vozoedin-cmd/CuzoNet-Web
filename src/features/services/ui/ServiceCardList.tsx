import type { ServiceDto } from '../api/services.service';
import { useServicesStore } from '../model/services.store';
import {
  ServiceLifecycleStatusBadge,
  ServiceTypeBadge,
} from './ServiceBadges';

export function ServiceCardList({
  services,
}: {
  services: readonly ServiceDto[];
}) {
  const selectService = useServicesStore((state) => state.selectService);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <button
          type="button"
          key={service.serviceId}
          className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors flex flex-col gap-3 text-left"
          onClick={() => selectService(service.serviceId)}
        >
          <div className="flex items-center justify-between border-b pb-2 w-full">
            <ServiceTypeBadge type={service.serviceType} />
            <ServiceLifecycleStatusBadge status={service.lifecycleStatus} />
          </div>
          <div>
            <h4 className="font-mono text-sm leading-tight">
              {service.serviceId}
            </h4>
            <p className="text-xs text-muted-foreground">
              Plan: {service.planVersionId}
            </p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border w-full">
            Cliente: {service.clientId}
            <br />
            Facturación: día {service.billingDay}
            <br />
            Inicio: {service.startedOn ?? 'No disponible'}
          </div>
          <span className="text-xs text-muted-foreground">
            Estado técnico: Sin operación técnica
          </span>
        </button>
      ))}
    </div>
  );
}
