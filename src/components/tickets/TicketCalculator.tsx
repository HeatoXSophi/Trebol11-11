"use client"

import * as React from "react"
import { Calculator, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export function TicketCalculator({ pricePerTicket = 2 }: { pricePerTicket?: number }) {
    const router = useRouter()
    const [ticketCount, setTicketCount] = React.useState<number | string>(10)
    const [total, setTotal] = React.useState(20)

    React.useEffect(() => {
        const count = typeof ticketCount === 'string' ? parseInt(ticketCount) || 0 : ticketCount
        setTotal(count * pricePerTicket)
    }, [ticketCount, pricePerTicket])

    const handleBuy = () => {
        // Redirigir a la página de pago con la cantidad/monto pre-llenados (podríamos usar query params)
        router.push(`/payments/report?amount=${total.toFixed(2)}`)
    }

    return (
        <Card className="border-gold-500/30 bg-black/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold-500">
                    <Calculator className="h-5 w-5" />
                    Comprar Tickets
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Cantidad de Tickets</label>
                    <Input
                        type="number"
                        min={1}
                        max={100}
                        value={ticketCount}
                        onChange={(e) => setTicketCount(Number(e.target.value))}
                        className="text-lg font-bold border-gold-500/20 focus:border-gold-500"
                    />
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gold-900/20 p-4 border border-gold-500/10">
                    <span className="text-sm text-muted-foreground">Total a Pagar</span>
                    <span className="text-2xl font-bold text-gold-500">${total}</span>
                </div>

                <Button onClick={handleBuy} className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold text-lg h-12">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Recargar y Comprar
                </Button>
            </CardContent>
        </Card>
    )
}
