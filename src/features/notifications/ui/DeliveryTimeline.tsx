
import * as React from "react"
import { DeliveryTimelineEvent } from "../api/notifications.service"

export function DeliveryTimeline({ timeline }: { timeline: DeliveryTimelineEvent[] }) {
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }

  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
      {timeline.map((evt) => (
        <div key={evt.id} className="relative flex items-center justify-normal group is-active">
          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-background bg-muted shadow shrink-0" />
          <div className="w-full ml-4 p-3 rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm uppercase">{evt.action}</span>
              <time className="text-[10px] text-muted-foreground">{formatDate(evt.timestamp)}</time>
            </div>
            {evt.details && <p className="text-xs text-muted-foreground">{evt.details}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
