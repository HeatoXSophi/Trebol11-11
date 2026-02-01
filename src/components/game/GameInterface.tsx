"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Zap, Ticket as TicketIcon, Check, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { buyTickets } from "@/app/actions/game"
import { QRCodeCanvas } from "qrcode.react"

interface GameProps {
    draw: any
    soldNumbers: string[]
    userBalance: number
    userEmail: string
}

export function GameInterface({ draw, soldNumbers, userBalance, userEmail }: GameProps) {
    const [selected, setSelected] = useState<string[]>([])
    const [buying, setBuying] = useState(false)
    const [purchasedTickets, setPurchasedTickets] = useState<any[] | null>(null)

    // Generate placeholder grid (only show a subset or search results)
    const [searchTerm, setSearchTerm] = useState("")

    // Logic for 10k numbers
    const formatNumber = (n: number) => n.toString().padStart(4, '0')

    const toggleNumber = (num: string) => {
        if (soldNumbers.includes(num)) {
            alert("Número no disponible")
            return
        }
        if (selected.includes(num)) {
            setSelected(s => s.filter(n => n !== num))
        } else {
            if (selected.length >= 50) return alert("Máximo 50 tickets por compra")
            setSelected(s => [...s, num])
            setSearchTerm("") // Clear search after picking
        }
    }

    const selectRandom = (count: number) => {
        // Efficient random selection for 10k
        const newSelection = [...selected]
        let attempts = 0
        while (newSelection.length < selected.length + count && attempts < 1000) {
            const rand = Math.floor(Math.random() * 10000)
            const num = formatNumber(rand)
            if (!soldNumbers.includes(num) && !newSelection.includes(num)) {
                newSelection.push(num)
            }
            attempts++
        }
        setSelected(newSelection)
    }

    const totalCost = selected.length * draw.ticketPrice
    const canBuy = userBalance >= totalCost && selected.length > 0

    const handleBuy = async () => {
        if (!canBuy) return
        setBuying(true)
        const res = await buyTickets(selected, draw.id)
        setBuying(false)

        if (res.success) {
            setPurchasedTickets(res.tickets || [])
            setSelected([])
        } else {
            alert(res.error)
        }
    }

    // Filtered numbers for grid (Visualization only) or search
    // const displayedNumbers = searchTerm 
    //     ? Array.from({length: 100}, (_, i) => i).map(i => searchTerm + i.toString()).filter(n => n.length <= 4 && !isNaN(Number(n))).slice(0, 20) // Simple startsWith logic could he better
    //     : [] // Don't show full grid by default

    // Helper to add specific number
    const handleAddSearch = () => {
        if (searchTerm.length === 4) {
            toggleNumber(searchTerm)
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
            {/* LEFT: Selection Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 flex flex-col items-center pt-20">
                <div className="max-w-xl w-full space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-black text-gold-500 uppercase tracking-tighter">Elige tu Suerte</h1>
                        <p className="text-zinc-400">Sorteo Activo: <span className="text-white font-bold">{draw.prizeTitle}</span></p>
                    </div>

                    {/* Search / Input */}
                    <div className="bg-zinc-900/80 p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
                        <label className="text-sm font-bold text-zinc-500 uppercase">Buscar Número (0000 - 9999)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="Ej: 1984"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value.replace(/\D/g, ''))}
                                className="flex-1 bg-black border-2 border-zinc-700 focus:border-gold-500 rounded-xl px-4 py-3 text-3xl font-mono font-bold text-white tracking-widest text-center placeholder:text-zinc-800 transition-colors outline-none"
                            />
                            <Button
                                onClick={handleAddSearch}
                                disabled={searchTerm.length !== 4 || soldNumbers.includes(searchTerm)}
                                className={cn(
                                    "h-auto px-6 text-xl font-bold rounded-xl",
                                    selected.includes(searchTerm) ? "bg-red-900 text-white" : "bg-gold-600 hover:bg-gold-500 text-black"
                                )}
                            >
                                {selected.includes(searchTerm) ? "Quitar" : "Agregar"}
                            </Button>
                        </div>

                        {/* Quick Status of Searched Number */}
                        {searchTerm.length === 4 && (
                            <div className="text-center h-6">
                                {soldNumbers.includes(searchTerm) ? (
                                    <span className="text-red-500 font-bold flex items-center justify-center gap-2"><div className="h-2 w-2 rounded-full bg-red-500"></div> Ocupado</span>
                                ) : (
                                    <span className="text-emerald-500 font-bold flex items-center justify-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500"></div> Disponible</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Picks */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => selectRandom(5)} className="h-14 border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-500 text-zinc-300 font-bold text-lg">
                            <Zap className="mr-2 h-5 w-5 text-gold-500" /> +5 Al Azar
                        </Button>
                        <Button variant="outline" onClick={() => selectRandom(10)} className="h-14 border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-500 text-zinc-300 font-bold text-lg">
                            <Zap className="mr-2 h-5 w-5 text-gold-500" /> +10 Al Azar
                        </Button>
                    </div>

                </div>
            </div>

            {/* RIGHT: Dashboard / Wallet */}
            <div className="w-full lg:w-96 bg-zinc-900 border-l border-white/10 p-6 flex flex-col z-10 shadow-2xl">
                {/* User Info */}
                <div className="flex items-center justify-between mb-8 p-4 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gold-600 flex items-center justify-center font-bold text-black border border-white/10">
                            {userEmail[0].toUpperCase()}
                        </div>
                        <div className="text-sm">
                            <div className="text-zinc-400">Billetera</div>
                            <div className="text-xl font-bold text-white font-mono">${userBalance.toFixed(2)}</div>
                        </div>
                    </div>
                    <Button size="icon" variant="ghost" className="text-zinc-500 hover:text-white">
                        <Wallet className="h-5 w-5" />
                    </Button>
                </div>

                {/* Selection Summary */}
                <div className="flex-1">
                    <h3 className="text-sm uppercase tracking-wider text-zinc-500 font-bold mb-4">Tickets Seleccionados ({selected.length})</h3>
                    <ScrollArea className="h-48 lg:h-[calc(100vh-400px)] pr-4">
                        <div className="flex flex-wrap gap-2">
                            {selected.map(num => (
                                <Badge key={num} onClick={() => toggleNumber(num)} className="bg-zinc-800 hover:bg-red-900 text-gold-400 border border-gold-500/20 px-3 py-1 text-lg font-mono cursor-pointer transition-colors">
                                    {num}
                                </Badge>
                            ))}
                            {selected.length === 0 && <p className="text-zinc-600 text-sm">Selecciona números del panel izquierdo...</p>}
                        </div>
                    </ScrollArea>
                </div>

                {/* Totals & Action */}
                <div className="mt-6 space-y-4 pt-6 border-t border-white/10">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Precio unitario</span>
                        <span className="text-white font-mono">${draw.ticketPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-gold-500 font-bold">Total a Pagar</span>
                        <span className="text-4xl font-black text-white tracking-tight">${totalCost.toFixed(2)}</span>
                    </div>

                    <Button
                        onClick={handleBuy}
                        disabled={!canBuy || buying}
                        className={cn(
                            "w-full h-14 text-xl font-black uppercase tracking-widest transition-all",
                            canBuy ? "bg-gold-600 hover:bg-gold-500 text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]" : "bg-zinc-800 text-zinc-500"
                        )}
                    >
                        {buying ? <Loader2 className="animate-spin" /> : (userBalance < totalCost ? "Saldo Insuficiente" : "COMPRAR AHORA")}
                    </Button>

                    {userBalance < totalCost && (
                        <p className="text-center text-xs text-red-500 animate-pulse">
                            Te faltan ${(totalCost - userBalance).toFixed(2)}
                        </p>
                    )}
                </div>
            </div>

            {/* GOLDEN TICKET SUCCESS MODAL */}
            {purchasedTickets && (
                <Dialog open={true} onOpenChange={() => setPurchasedTickets(null)}>
                    <DialogContent className="bg-black/95 border-gold-500/50 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-center text-3xl font-black text-gold-500 flex flex-col items-center gap-4 py-6">
                                <span className="bg-gold-500/10 p-4 rounded-full border border-gold-500/50">
                                    <Check className="h-10 w-10" />
                                </span>
                                ¡Compra Exitosa!
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                            <p className="text-center text-zinc-300">
                                Has asegurado tus <strong className="text-white">{purchasedTickets.length} tickets</strong>.
                                <br />Se ha enviado una copia a tu correo.
                            </p>

                            {/* Carousel of Tickets (Simplified View) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {purchasedTickets.map((t, i) => (
                                    <div key={i} className="bg-gradient-to-b from-zinc-900 to-black border border-gold-500/30 p-4 rounded-xl relative overflow-hidden group">
                                        {/* Ticket styling */}
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <TicketIcon className="h-24 w-24 text-gold-500" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-xs text-zinc-500 uppercase font-bold mb-1">Tu Número</div>
                                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600 font-mono">
                                                {t.number}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-end">
                                                <div>
                                                    <div className="text-[10px] text-zinc-500 uppercase">Serial</div>
                                                    <div className="text-xs font-mono text-zinc-400">{t.serialCode.slice(-8).toUpperCase()}</div>
                                                </div>
                                                <QRCodeCanvas value={`trebol1111:${t.serialCode}`} size={40} fgColor="#D4AF37" bgColor="transparent" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="sm:justify-center pt-6">
                            <Button onClick={() => setPurchasedTickets(null)} variant="outline" className="border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-500 text-zinc-400">
                                Cerrar y Seguir Jugando
                            </Button>
                            <Button className="bg-zinc-100 text-black hover:bg-white">
                                Descargar Todo (PDF)
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
