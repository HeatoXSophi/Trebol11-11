"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShoppingCart, Ticket, Trash2, Wallet, Lock, Plus } from "lucide-react"
import { getUserBalance, buyTickets, getUnavailableTickets } from "@/app/actions/user"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function TicketSelector({ pricePerTicket }: { pricePerTicket: number }) {
    const { data: session } = useSession()
    const router = useRouter()

    const [balance, setBalance] = useState<number | null>(null)
    const [selectedNumbers, setSelectedNumbers] = useState<string[]>([])
    const [currentInput, setCurrentInput] = useState("")
    const [unavailableNumbers, setUnavailableNumbers] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (session) {
            getUserBalance().then(bal => setBalance(bal))
        }
        // Fetch unavailable numbers (sold)
        getUnavailableTickets().then(nums => setUnavailableNumbers(new Set(nums)))
    }, [session])

    const handleAddNumber = () => {
        if (currentInput.length !== 4) return alert("El número debe tener 4 dígitos")
        if (selectedNumbers.includes(currentInput)) return alert("Ya seleccionaste este número")
        if (unavailableNumbers.has(currentInput)) return alert("Este número ya fue vendido. Intenta con otro.")

        setSelectedNumbers([...selectedNumbers, currentInput])
        setCurrentInput("")
    }

    const handleBulkAdd = () => {
        const count = prompt("¿Cuántos tickets al azar quieres agregar? (Máx 100)")
        if (!count) return

        const qty = parseInt(count)
        if (isNaN(qty) || qty < 1) return
        if (qty > 1000) return alert("Máximo 100 por vez para no saturar.")

        const newNumbers: string[] = []
        let attempts = 0
        const maxAttempts = qty * 10

        while (newNumbers.length < qty && attempts < maxAttempts) {
            const num = Math.floor(1000 + Math.random() * 9000).toString()
            if (!selectedNumbers.includes(num) && !newNumbers.includes(num) && !unavailableNumbers.has(num)) {
                newNumbers.push(num)
            }
            attempts++
        }

        if (newNumbers.length < qty) alert(`Solo se generaron ${newNumbers.length} tickets disponibles (el resto estaban ocupados).`)
        setSelectedNumbers([...selectedNumbers, ...newNumbers])
    }

    const isUnavailable = unavailableNumbers.has(currentInput) && currentInput.length === 4

    const handleBuy = async () => {
        if (selectedNumbers.length === 0) return
        if (!confirm(`¿Comprar ${selectedNumbers.length} tickets por $${(selectedNumbers.length * pricePerTicket).toFixed(2)}?`)) return

        setLoading(true)
        const res = await buyTickets(selectedNumbers)
        setLoading(false)

        if (res.success) {
            alert(res.message)
            setSelectedNumbers([])
            // Refresh balance
            getUserBalance().then(bal => setBalance(bal))
            // Optionally reload to update header too
            window.location.reload()
        } else {
            alert(res.error)
        }
    }

    // Logic: Only show game if balance > 0
    if (!session) {
        return (
            <Card className="border-gold-500/20 bg-black/40 text-center py-8">
                <CardContent>
                    <Lock className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Inicia Sesión para Jugar</h3>
                    <p className="text-zinc-400 mb-4">Necesitas una cuenta para comprar tickets.</p>
                    <Button onClick={() => router.push("/login")} className="bg-gold-600 hover:bg-gold-700 font-bold text-black">
                        Ingresar
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (balance === null) return <div className="text-white text-center">Cargando billetera...</div>

    if (balance <= 0) {
        return (
            <Card className="border-gold-500/20 bg-zinc-900/50 text-center py-8 animate-in fade-in">
                <CardContent className="space-y-4">
                    <div className="relative mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-900/20 mb-2">
                        <Wallet className="h-8 w-8 text-red-500" />
                        <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                            <Lock className="h-3 w-3 text-white" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-black text-white">Saldo Insuficiente</h3>
                        <p className="text-zinc-400">Tu billetera está vacía ($0.00).</p>
                        <p className="text-zinc-500 text-sm mt-1">Recarga saldo para desbloquear el panel de juego.</p>
                    </div>

                    <div className="w-full max-w-xs mx-auto">
                        <Button asChild className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 font-bold text-white shadow-lg shadow-green-900/20">
                            <Link href="/payments/report">
                                <Wallet className="mr-2 h-4 w-4" /> Recargar Saldo
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-gold-500/30 bg-black/80 backdrop-blur-md shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="flex items-center justify-between text-gold-500">
                    <span className="flex items-center gap-2"><CalculatorIcon /> Panel de Juego</span>
                    <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-white/10">
                        Saldo: ${balance.toFixed(2)}
                    </span>
                </CardTitle>
                <CardDescription>
                    Elige tus números de la suerte (4 dígitos). Costo: ${pricePerTicket}/ticket.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

                {/* Input Area */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            placeholder="0000"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                            className={`text-2xl font-mono tracking-widest text-center h-14 ${isUnavailable ? "border-red-500 text-red-500 bg-red-950/20" : "bg-zinc-900 border-zinc-700"}`}
                            onKeyDown={(e) => e.key === "Enter" && handleAddNumber()}
                        />
                        {isUnavailable && (
                            <div className="absolute -bottom-6 left-0 w-full text-center text-xs font-bold text-red-500 animate-pulse">
                                🚫 NO DISPONIBLE
                            </div>
                        )}
                    </div>
                    <Button onClick={handleAddNumber} disabled={isUnavailable} className="h-14 w-14 bg-zinc-800 hover:bg-zinc-700 border border-white/10 disabled:opacity-50">
                        <Plus className="h-6 w-6 text-white" />
                    </Button>
                </div>

                {/* Quick Picks */}
                <div className="flex flex-wrap gap-2 pb-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentInput(Math.floor(1000 + Math.random() * 9000).toString())} className="border-zinc-700 text-zinc-400 hover:text-white text-xs">
                        1 Azar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleBulkAdd} className="border-zinc-700 text-gold-500 hover:text-gold-400 hover:bg-gold-500/10 text-xs border-gold-500/30">
                        ⚡ Agregar Muchos
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentInput("7777")} className="border-zinc-700 text-zinc-400 hover:text-white text-xs">
                        7777s
                    </Button>
                    {selectedNumbers.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedNumbers([])} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 text-xs ml-auto">
                            Limpiar
                        </Button>
                    )}
                </div>

                {/* Cart / Selected List */}
                {selectedNumbers.length > 0 && (
                    <div className="bg-zinc-900/50 rounded-lg p-3 space-y-2 border border-white/5 max-h-40 overflow-y-auto custom-scrollbar">
                        {selectedNumbers.map((num, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-black/40 px-3 py-2 rounded border border-gold-500/10 hover:border-gold-500/30 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <Ticket className="h-4 w-4 text-gold-500" />
                                    <span className="font-mono text-lg font-bold text-white tracking-widest">{num}</span>
                                </div>
                                <button onClick={() => setSelectedNumbers(selectedNumbers.filter((_, i) => i !== idx))} className="text-zinc-600 hover:text-red-500 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary & Action */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-muted-foreground text-sm">Total ({selectedNumbers.length} tickets)</span>
                        <span className="text-3xl font-black text-white">${(selectedNumbers.length * pricePerTicket).toFixed(2)}</span>
                    </div>

                    <Button
                        onClick={handleBuy}
                        disabled={loading || selectedNumbers.length === 0 || (selectedNumbers.length * pricePerTicket) > balance}
                        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Procesando..." : (balance < (selectedNumbers.length * pricePerTicket) ? "Saldo Insuficiente" : "COMPRAR AHORA")}
                    </Button>
                </div>

            </CardContent>
        </Card>
    )
}

function CalculatorIcon() {
    return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" x2="16" y1="6" y2="6" />
            <line x1="16" x2="16" y1="14" y2="18" />
            <path d="M16 10h.01" />
            <path d="M12 10h.01" />
            <path d="M8 10h.01" />
            <path d="M12 14h.01" />
            <path d="M8 14h.01" />
            <path d="M12 18h.01" />
            <path d="M8 18h.01" />
        </svg>
    )
}
