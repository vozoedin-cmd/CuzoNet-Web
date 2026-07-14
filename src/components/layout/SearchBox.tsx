
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBox() {
  return (
    <div className="relative hidden md:block w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar..."
        className="pl-8 bg-background"
      />
    </div>
  )
}
