
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"
import { useLayoutStore } from "@/stores/layout.store"

interface SidebarItemProps {
  name: string
  href: string
  icon: LucideIcon
}

export function SidebarItem({ name, href, icon: Icon }: SidebarItemProps) {
  const pathname = usePathname()
  const setSidebarOpen = useLayoutStore((s) => s.setSidebarOpen)
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      onClick={() => setSidebarOpen(false)}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{name}</span>
    </Link>
  )
}
