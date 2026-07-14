
import * as React from "react"
import { WorkerHealthStatus, OperationStatus, WorkerRole } from "../api/workers.service"
import { CheckCircle2, Clock, XCircle, AlertTriangle, Play, Settings, Database, Activity, Mail } from "lucide-react"

export function WorkerStatusBadge({ status }: { status: WorkerHealthStatus }) {
  const cfg = {
    healthy: { icon: CheckCircle2, label: 'Healthy', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    degraded: { icon: AlertTriangle, label: 'Degraded', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    stopped: { icon: XCircle, label: 'Stopped', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
    unknown: { icon: Clock, label: 'Unknown', color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' },
  };
  const { icon: Icon, label, color } = cfg[status] || cfg.unknown;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${color}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  )
}

export function OperationStatusBadge({ status }: { status: OperationStatus }) {
  const cfg = {
    queued: { icon: Clock, label: 'En Cola', color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' },
    running: { icon: Play, label: 'En Proceso', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse' },
    succeeded: { icon: CheckCircle2, label: 'Éxito', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    failed: { icon: XCircle, label: 'Fallido', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
    cancelled: { icon: XCircle, label: 'Cancelado', color: 'bg-zinc-800/10 text-zinc-400 border-zinc-800/20' },
    manual_review: { icon: AlertTriangle, label: 'Revisión Manual', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  };
  const { icon: Icon, label, color } = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${color}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  )
}

export function WorkerRoleBadge({ role }: { role: WorkerRole }) {
  const cfg = {
    outbox: { icon: Database, label: 'Outbox Relay' },
    automation: { icon: Activity, label: 'Automations' },
    provisioning: { icon: Settings, label: 'Provisioning' },
    notifications: { icon: Mail, label: 'Notifications' },
  };
  const { icon: Icon, label } = cfg[role] || { icon: Database, label: role };
  return (
    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] uppercase font-bold bg-muted text-muted-foreground">
      <Icon className="h-3 w-3" /> {label}
    </div>
  )
}

// Security function to sanitize backend errors from secrets/passwords
export function sanitizeError(errorText: string): string {
  if (!errorText) return 'Error desconocido';
  // Strip passwords, IPs or tokens that might leak
  return errorText.replace(/password[:=][^\s]+/gi, 'password=***')
                  .replace(/token[:=][^\s]+/gi, 'token=***')
                  .replace(/([a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+)/g, '[REDACTED_EMAIL]')
                  .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[REDACTED_IP]');
}

// Function to partially hide idempotency keys / fencing tokens
export function maskToken(token?: string): string {
  if (!token) return '--';
  if (token.length <= 8) return '***';
  return token.substring(0, 4) + '...' + token.substring(token.length - 4);
}
