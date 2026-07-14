
import * as React from "react"
import { AlertTimelineEvent } from "../api/alerting.service"

export function AlertTimeline({ timeline }: { timeline: AlertTimelineEvent[] }) {
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }

  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {timeline.map((evt) => (
        <div key={evt.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm capitalize">{evt.action}</span>
              <time className="text-xs text-muted-foreground">{formatDate(evt.timestamp)}</time>
            </div>
            <p className="text-xs text-muted-foreground">{evt.message}</p>
            {evt.actor && <p className="text-[10px] text-muted-foreground mt-1">Por: {evt.actor}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
