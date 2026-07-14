
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, CreditCard, Activity } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button variant="outline" className="justify-start"><PlusCircle className="mr-2 h-4 w-4" /> Nuevo Cliente</Button>
        <Button variant="outline" className="justify-start"><CreditCard className="mr-2 h-4 w-4" /> Registrar Pago</Button>
        <Button variant="outline" className="justify-start"><Activity className="mr-2 h-4 w-4" /> Ejecutar Diagnóstico</Button>
      </CardContent>
    </Card>
  )
}
