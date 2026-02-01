"use client"

import { GoldenTicket } from "@/components/tickets/GoldenTicket"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TicketDemoPage() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gold-500/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 text-center space-y-8 max-w-md w-full">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white">Tu Ticket Dorado</h1>
                    <p className="text-zinc-400">Así lucirá tu comprobante digital al ganar.</p>
                </div>

                <GoldenTicket
                    ticketNumber="7777"
                    serialCode="TREBOL-X99-2024"
                    drawDate={new Date()}
                    purchaseDate={new Date().toLocaleDateString()}
                />

                <div className="pt-8">
                    <Link href="/">
                        <Button variant="outline" className="border-gold-500/50 text-gold-500 hover:bg-gold-500 hover:text-black">
                            Volver al Inicio
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
