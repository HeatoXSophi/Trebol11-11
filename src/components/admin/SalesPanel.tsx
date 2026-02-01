"use client"

import { useEffect, useState } from "react"
import { getRecentSales, getSalesSummary } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, DollarSign, Ticket } from "lucide-react"

export function SalesPanel() {
    const [sales, setSales] = useState<any[]>([])
    const [summary, setSummary] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getRecentSales(), getSalesSummary()]).then(([salesData, summaryData]) => {
            setSales(salesData)
            setSummary(summaryData)
            setLoading(false)
        })
    }, [])

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-white" /></div>

    return (
        <div className="space-y-6">
            {/* Sales Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                {summary.map((item) => (
                    <Card key={item.drawId} className="bg-zinc-900 border-gold-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">
                                Sorteo {new Date(item.drawDate).toLocaleDateString()}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-2xl font-bold text-white">${item.totalMoney.toLocaleString()}</div>
                                    <div className="text-xs text-zinc-500">{item.drawTitle}</div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-sm text-gold-500 font-bold">
                                        <Ticket className="w-4 h-4" />
                                        {item.ticketCount}
                                    </div>
                                    <div className="text-[10px] text-zinc-500">${item.ticketPrice}/ticket</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-zinc-900 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white">Últimas Ventas Individuales</CardTitle>
                </CardHeader>
                <CardContent>
                    {sales.length === 0 ? (
                        <p className="text-zinc-500">No hay ventas registradas.</p>
                    ) : (
                        <div className="space-y-4">
                            {sales.map((sale) => (
                                <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                                    <div>
                                        <div className="font-bold text-white flex items-center gap-2">
                                            Ticket #{sale.number}
                                            <Badge variant="outline" className="border-gold-500/50 text-gold-500 text-[10px] bg-gold-500/10">SOLD</Badge>
                                        </div>
                                        <div className="text-xs text-zinc-500">
                                            Comprador: {sale.user?.name || sale.user?.email || "Desconocido"}
                                        </div>
                                        <div className="text-[10px] text-zinc-600">
                                            Sorteo: {new Date(sale.draw?.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-right text-xs text-zinc-500">
                                        {new Date(sale.updatedAt).toLocaleDateString()} <br />
                                        {new Date(sale.updatedAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
