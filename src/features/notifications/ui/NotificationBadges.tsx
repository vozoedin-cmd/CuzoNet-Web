
import * as React from "react"
import { NotificationStatus, NotificationChannel } from "../api/notifications.service"
import { Mail, MessageCircle, Send, Webhook } from "lucide-react"

export function NotificationStatusBadge({ status }: { status: NotificationStatus }) {
  const colors = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse',
    sent: 'bg-green-500/10 text-green-500 border-green-500/20',
    partial: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    failed: 'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${colors[status]}`}>
      {status}
    </span>
  )
}

export function NotificationChannelBadge({ channel }: { channel: NotificationChannel }) {
  const cfg = {
    email: { icon: Mail, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    whatsapp: { icon: MessageCircle, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    telegram: { icon: Send, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
    webhook: { icon: Webhook, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  };

  const Icon = cfg[channel].icon;

  return (
    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] uppercase font-medium ${cfg[channel].color}`} title={channel}>
      <Icon className="h-3 w-3" /> {channel}
    </div>
  )
}
