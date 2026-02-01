"use client"

import { useEffect, useState } from "react"
import { verifyTicket } from "@/app/actions/verify"
import { Loader2, ShieldCheck, CheckCircle2, Ticket, Calendar, User, Info } from "lucide-react"
import { useParams } from "next/navigation"

export default function VerifyPage() {
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        const code = params?.code as string;

        if (!code) return; // Wait for params to be ready

        verifyTicket(code)
            .then(res => {
                if (res.success) {
                    setData(res.ticket)
                } else {
                    setError(res.error || "Ticket inválido")
                }
            })
            .catch(() => setError("Error de conexión"))
            .finally(() => setLoading(false))
    }, [params])

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-gold-500 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-red-500/30 rounded-2xl p-8 text-center max-w-md w-full">
                    <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <Info className="h-8 w-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Verificación Fallida</h1>
                    <p className="text-zinc-400">{error}</p>
                    <p className="text-xs text-zinc-600 mt-4">Este código QR no corresponde a ningún ticket válido registrado en nuestra plataforma.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gold-600/10 blur-[150px] rounded-full" />

            <div className="relative w-full max-w-lg bg-zinc-950/80 backdrop-blur-xl border border-gold-500/30 rounded-3xl p-6 md:p-10 shadow-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-bold tracking-widest uppercase text-xs mb-4">
                        <ShieldCheck className="w-4 h-4" />
                        Ticket Auténtico
                    </div>
                    <h1 className="text-3xl font-black text-white mb-1">CERTIFICADO DIGITAL</h1>
                    <p className="text-zinc-400 text-sm">Verificación Blockchain - Trebol 11-11</p>
                </div>

                {/* Ticket Serial */}
                <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-xl p-4 text-center mb-8 relative group">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 px-3 text-xs text-zinc-500 font-mono">SERIAL ÚNICO</div>
                    <p className="font-mono text-xl md:text-2xl text-gold-500 tracking-widest break-all">
                        {data.serialCode}
                    </p>
                </div>

                {/* Details Grid */}
                <div className="space-y-6">

                    {/* Ticket Info */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-gold-500" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Número de Ticket</p>
                            <p className="text-2xl font-black text-white ml-[-1px]">{data.number}</p>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800 w-full" />

                    {/* Owner Info */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Propietario</p>
                            <p className="text-lg font-bold text-white capitalize">
                                {data.user?.name} {data.user?.lastName}
                            </p>
                            <p className="text-xs text-zinc-500 font-mono">
                                ID: {data.user?.identification?.slice(0, 2)}***{data.user?.identification?.slice(-3)}
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800 w-full" />

                    {/* Draw Info */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Fecha del Sorteo</p>
                            <p className="text-lg font-bold text-white">
                                {new Date(data.draw.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}
                            </p>
                            <p className="text-xs text-zinc-500">
                                Estado: <span className={data.draw.status === 'OPEN' ? 'text-emerald-400' : 'text-zinc-400'}>{data.draw.status}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Timestamp */}
                <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                    <p className="text-xs text-zinc-600">
                        Verificado el {new Date().toLocaleString()}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-zinc-500 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        Powered by blockchain security
                    </div>
                </div>
            </div>
        </div>
    )
}
