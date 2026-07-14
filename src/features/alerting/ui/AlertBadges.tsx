
import * as React from "react"
import { AlertSeverity, AlertStatus } from "../api/alerting.service"

export function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  const colors = {
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    critical: 'bg-red-500/10 text-red-500 border-red-500/20',
    emergency: 'bg-rose-600/10 text-rose-600 border-rose-600/20 animate-pulse',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-md border uppercase tracking-wider ${colors[severity]}`}>
      {severity}
    </span>
  )
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const colors = {
    open: 'bg-red-500/10 text-red-500 border-red-500/20',
    acknowledged: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    resolved: 'bg-green-500/10 text-green-500 border-green-500/20',
    closed: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    suppressed: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border capitalize ${colors[status]}`}>
      {status}
    </span>
  )
}
