import type { ServiceDto } from '../api/services.service';
import { useServicesStore } from '../model/services.store';
import {
  ServiceLifecycleStatusBadge,
  ServiceTypeBadge,
} from './ServiceBadges';

export function ServiceTable({
  services,
}: {
  services: readonly ServiceDto[];
}) {
  const selectService = useServicesStore((state) => state.selectService);

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Servicio</th>
            <th className="px-4 py-3 font-medium">Tipo / Plan</th>
            <th className="px-4 py-3 font-medium">Estado contractual</th>
            <th className="px-4 py-3 font-medium">Facturación</th>
            <th className="px-4 py-3 font-medium">Estado técnico</th>
            <th className="px-4 py-3 font-medium">Inicio</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {services.map((service) => (
            <tr
              key={service.serviceId}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectService(service.serviceId)}
            >
              <td className="px-4 py-3">
                <p className="font-mono text-xs">{service.serviceId}</p>
                <p className="text-xs text-muted-foreground">
                  Cliente: {service.clientId}
                </p>
              </td>
              <td className="px-4 py-3">
                <ServiceTypeBadge type={service.serviceType} />
                <p className="text-xs mt-1">{service.planVersionId}</p>
              </td>
              <td className="px-4 py-3">
                <ServiceLifecycleStatusBadge status={service.lifecycleStatus} />
              </td>
              <td className="px-4 py-3 text-xs font-semibold">
                Día {service.billingDay}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                Sin operación técnica
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {service.startedOn ?? 'No disponible'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
