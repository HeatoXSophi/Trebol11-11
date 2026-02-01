"use client"

import { QRCodeSVG } from "qrcode.react"
import { Trophy, Star, ShieldCheck } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface GoldenTicketProps {
    ticketNumber: string
    drawDate: Date | string
    price?: number
    userName?: string
    serialCode?: string // Unique UUID for the ticket ideally
    purchaseDate?: string
}

export function GoldenTicket({ ticketNumber, drawDate, price = 2, userName, serialCode, purchaseDate }: GoldenTicketProps) {
    // URL for the QR code to make it "functional" (opens scanner)
    // URL for the QR code to make it "functional" (opens scanner)
    // Use window.location.origin if available, otherwise relative path might not work for QR scanners (needs absolute)
    // Fallback for SSR where window is undefined
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://trebol11-11.com'
    const verificationUrl = `${origin}/verify/${serialCode || "INVALID"}`

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[9/16] md:aspect-[3/4] bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 rounded-3xl p-1 shadow-2xl overflow-hidden border-4 border-yellow-600">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>

            {/* Inner Content Card */}
            <div className="relative h-full w-full bg-black/90 rounded-2xl p-6 flex flex-col items-center justify-between border border-yellow-200/50">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-yellow-500 mb-2">
                        <Star className="w-5 h-5 fill-yellow-500 animate-pulse" />
                        <span className="font-bold tracking-widest uppercase text-sm">Official Ticket</span>
                        <Star className="w-5 h-5 fill-yellow-500 animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200">
                        GOLDEN TICKET
                    </h1>
                </div>

                {/* Main Ticket Number */}
                <div className="w-full bg-yellow-900/20 border border-yellow-500/30 p-6 rounded-xl text-center backdrop-blur-sm">
                    <p className="text-yellow-500/80 text-xs font-mono mb-2">TICKET NUMBER</p>
                    <div className="text-6xl font-black text-white tracking-widest font-mono drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                        {ticketNumber}
                    </div>
                    {/* Serial Code Display */}
                    <div className="mt-2 text-xs font-mono text-zinc-400">
                        SERIAL: <span className="text-white select-all">{serialCode || "PENDING"}</span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="w-full grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-zinc-400 mb-1">FECHA SORTEO</p>
                        <p className="text-white font-bold">{new Date(drawDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-zinc-400 mb-1">PRECIO</p>
                        <p className="text-yellow-400 font-bold">${price} USD</p>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-white p-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <QRCodeSVG value={verificationUrl} size={120} level="H" />
                </div>

                <p className="text-[10px] text-zinc-500 text-center px-4">
                    Este código QR es único e intransferible. Escanee para verificar la autenticidad del boleto en la blockchain.
                </p>

                {/* Footer Shield */}
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-900/20 px-4 py-1.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED & SECURE
                </div>
            </div>
        </div>
    )
}
