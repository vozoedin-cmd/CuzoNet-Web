
import * as React from "react"

export function ContentContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 overflow-y-auto bg-muted/20">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {children}
      </div>
    </main>
  )
}
