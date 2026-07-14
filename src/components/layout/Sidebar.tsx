
"use client"

import { cn } from "@/lib/utils"
import { SidebarItem } from "./SidebarItem"
import { navigationSections } from "./navigation"
import { useLayoutStore } from "@/stores/layout.store"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useLayoutStore()

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-6">
          <span className="font-bold text-lg tracking-tight">CuzoNet Web</span>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto p-4 space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <SidebarItem key={item.name} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}
