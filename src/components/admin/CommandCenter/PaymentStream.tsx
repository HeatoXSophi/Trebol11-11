"use client"

import { useState, useEffect } from "react"
import { Check, X, Loader2, ExternalLink, Clock } from "lucide-react"
import { getPendingPayments, approvePayment, rejectPayment } from "@/app/actions/payment"
import { Button } from "@/components/ui/button"

export function PaymentStream() {
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    useEffect(() => {
        loadPayments()
        const interval = setInterval(loadPayments, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [])

    async function loadPayments() {
        const data = await getPendingPayments()
        setPayments(data)
        setLoading(false)
    }

    async function handleApprove(id: string) {
        setProcessingId(id)
        const res = await approvePayment(id)
        if (res.success) {
            setPayments(prev => prev.filter(p => p.id !== id))
        }
        setProcessingId(null)
    }

    async function handleReject(id: string) {
        if (!confirm("¿Rechazar este pago?")) return;
        setProcessingId(id)
        const res = await rejectPayment(id)
        if (res.success) {
            setPayments(prev => prev.filter(p => p.id !== id))
        }
        setProcessingId(null)
    }

    return (
        <div className="h-full flex flex-col bg-zinc-950/50 backdrop-blur-sm border-r border-white/5">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    Pending Payments
                </h3>
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">{payments.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading && <div className="text-xs text-zinc-600 text-center py-10 animate-pulse">Scanning blockchain...</div>}

                {!loading && payments.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 opacity-20">
                        <Clock className="w-8 h-8 text-white mb-2" />
                        <span className="text-xs uppercase tracking-widest text-white">No incoming transfers</span>
                    </div>
                )}

                {payments.map(payment => (
                    <div key={payment.id} className="group relative bg-zinc-900 border border-white/5 hover:border-white/10 rounded-lg p-3 transition-colors">
                        <div className="flex gap-3">
                            {/* Tiny Thumb */}
                            <div
                                className="w-12 h-12 bg-black rounded border border-white/10 overflow-hidden cursor-pointer"
                                onClick={() => window.open(payment.proofImage, '_blank')}
                            >
                                {payment.proofImage ? (
                                    <img src={payment.proofImage} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[8px]">NO IMG</div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-white truncate">{payment.user?.name || payment.user?.email}</p>
                                    <p className="text-sm font-mono text-emerald-400 font-bold">${payment.amount}</p>
                                </div>
                                <p className="text-xs text-zinc-500 truncate flex items-center gap-1">
                                    ID: ...{payment.id.slice(-6)}
                                </p>
                            </div>
                        </div>

                        {/* Action Overlay (Always visible on mobile, hover on desk) */}
                        <div className="mt-3 grid grid-cols-2 gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Button
                                size="sm"
                                className="h-7 text-xs bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black border border-emerald-500/20"
                                onClick={() => handleApprove(payment.id)}
                            >
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                onClick={() => handleReject(payment.id)}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
