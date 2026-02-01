"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, User, Phone, Mail, CreditCard } from "lucide-react"
import { searchTicket } from "@/app/actions/admin"

export function TicketSearchPanel() {
    const [ticketNumber, setTicketNumber] = useState("")
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!ticketNumber) return
        setLoading(true)
        const res = await searchTicket(ticketNumber)
        setResult(res)
        setLoading(false)
    }

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-gold-500" />
                    Buscador de Tickets
                </CardTitle>
                <CardDescription>Consulte si un número específico tiene dueño.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                    <Input
                        placeholder="Número (Ej: 1234)"
                        value={ticketNumber}
                        onChange={(e) => setTicketNumber(e.target.value)}
                        className="bg-black border-zinc-700"
                    />
                    <Button type="submit" disabled={loading} className="bg-gold-600 hover:bg-gold-700 text-black font-bold">
                        {loading ? "Buscando..." : "Buscar"}
                    </Button>
                </form>

                {result && (
                    <div className={`p-4 rounded-lg border ${result.status === 'SOLD' ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                        {result.status === 'AVAILABLE' ? (
                            <div className="text-center text-zinc-400 py-4">
                                <p className="text-lg font-bold text-white mb-1">Ticket Disponible</p>
                                <p>Este número no ha sido comprado aún.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                    <span className="text-green-500 font-bold flex items-center gap-2">
                                        <CheckIcon /> Vendido
                                    </span>
                                    <span className="text-xs text-zinc-500">
                                        {new Date(result.purchaseDate).toLocaleString()}
                                    </span>
                                </div>

                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <User className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">Propietario</p>
                                            <p className="font-medium text-white">{result.user.name} {result.user.lastName}</p>
                                            <p className="text-xs text-zinc-400">{result.user.identification}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <Phone className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">Teléfono</p>
                                            <p className="font-medium text-white">{result.user.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function CheckIcon() {
    return (
        <svg
            className=" h-4 w-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
