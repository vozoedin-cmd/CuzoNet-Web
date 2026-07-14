
import { 
  LayoutDashboard, 
  Users, 
  Server, 
  CreditCard, 
  Box, 
  Network, 
  Activity, 
  BellRing, 
  MessageSquare,
  HardHat, 
  FileText, 
  Settings, 
  Sparkles 
} from "lucide-react"

export const navigationSections = [
  {
    title: "General",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Clientes", href: "/clients", icon: Users },
      { name: "Servicios", href: "/services", icon: Server },
      { name: "Planes", href: "/plans", icon: Box },
      { name: "Facturación", href: "/billing", icon: CreditCard },
    ]
  },
  {
    title: "Infraestructura",
    items: [
      { name: "Inventario", href: "/inventory", icon: Box },
      { name: "Red", href: "/network", icon: Network },
      { name: "Monitoreo", href: "/monitoring", icon: Activity },
    ]
  },
  {
    title: "Operaciones",
    items: [
      { name: "Alertas", href: "/alerting", icon: BellRing },
      { name: "Notificaciones", href: "/notifications", icon: MessageSquare },
      { name: "Workers", href: "/workers", icon: HardHat },
    ]
  },
  {
    title: "Sistema",
    items: [
      { name: "Reportes", href: "/reports", icon: FileText },
      { name: "Configuración", href: "/settings", icon: Settings },
      { name: "IA Assistant", href: "/ai-assistant", icon: Sparkles },
    ]
  }
]
