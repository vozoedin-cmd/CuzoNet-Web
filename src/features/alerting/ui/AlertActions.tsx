
import * as React from "react"
import { Button } from "@/components/ui/button"
import { AlertStatus } from "../api/alerting.service"
import { useAcknowledgeAlert, useResolveAlert } from "../hooks/useAlertMutations"
import { CheckCircle2, ShieldCheck } from "lucide-react"

interface AlertActionsProps {
  companyId: string;
  alertId: string;
  status: AlertStatus;
}

export function AlertActions({ companyId, alertId, status }: AlertActionsProps) {
  const ackMutation = useAcknowledgeAlert(companyId);
  const resolveMutation = useResolveAlert(companyId);

  const canAck = status === 'open';
  const canResolve = status === 'open' || status === 'acknowledged';

  const handleAck = () => {
    if (confirm("¿Estás seguro de reconocer (ACK) esta alerta?")) {
      ackMutation.mutate(alertId);
    }
  }

  const handleResolve = () => {
    if (confirm("¿Estás seguro de marcar esta alerta como Resuelta?")) {
      resolveMutation.mutate(alertId);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="outline" 
        className="w-full flex items-center gap-2" 
        disabled={!canAck || ackMutation.isPending}
        onClick={handleAck}
      >
        <ShieldCheck className="h-4 w-4" /> 
        {ackMutation.isPending ? 'Procesando...' : 'Reconocer (ACK)'}
      </Button>
      <Button 
        variant="default" 
        className="w-full flex items-center gap-2" 
        disabled={!canResolve || resolveMutation.isPending}
        onClick={handleResolve}
      >
        <CheckCircle2 className="h-4 w-4" /> 
        {resolveMutation.isPending ? 'Procesando...' : 'Resolver Alerta'}
      </Button>
    </div>
  )
}
