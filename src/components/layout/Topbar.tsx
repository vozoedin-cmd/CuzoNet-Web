
"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLayoutStore } from "@/stores/layout.store"
import { SearchBox } from "./SearchBox"
import { ThemeToggle } from "./ThemeToggle"
import { NotificationButton } from "./NotificationButton"
import { UserMenu } from "./UserMenu"

export function Topbar() {
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar)

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <SearchBox />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationButton />
        <div className="ml-2">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
