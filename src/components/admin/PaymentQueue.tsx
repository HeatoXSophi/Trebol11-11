"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, AlertCircle, Loader2 } from "lucide-react"
import { getPendingPayments, approvePayment, rejectPayment } from "@/app/actions/payment"

export function PaymentQueue() {
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    useEffect(() => {
        loadPayments()
    }, [])

    async function loadPayments() {
        setLoading(true)
        const data = await getPendingPayments()
        setPayments(data)
        setLoading(false)
    }

    async function handleApprove(id: string) {
        setProcessingId(id)
        const res = await approvePayment(id)
        if (res.success) {
            alert("Pago aprobado y saldo acreditado.")
            // Optimistic update or reload
            setPayments(prev => prev.filter(p => p.id !== id))
        } else {
            alert("Error al aprobar.")
        }
        setProcessingId(null)
    }

    async function handleReject(id: string) {
        if (!confirm("¿Rechazar este pago?")) return;
        setProcessingId(id)
        const res = await rejectPayment(id)
        if (res.success) {
            setPayments(prev => prev.filter(p => p.id !== id))
        } else {
            alert("Error al rechazar.")
        }
        setProcessingId(null)
    }

    if (loading) {
        return <div className="text-zinc-500 animate-pulse">Cargando pagos pendientes...</div>
    }

    if (payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-zinc-800 rounded-lg text-zinc-500">
                <AlertCircle className="mb-2 h-8 w-8 opacity-20" />
                <p>No hay pagos pendientes de verificación.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {payments.map((payment) => (
                <Card key={payment.id} className="overflow-hidden bg-zinc-900 border-white/10">
                    <div className="aspect-video w-full bg-zinc-800 flex items-center justify-center relative group">
                        {payment.proofImage ? (
                            <img src={payment.proofImage} alt="Comprobante" className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open(payment.proofImage, '_blank')} />
                        ) : (
                            <span className="text-zinc-600 text-xs">[Sin Imagen]</span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                            <span className="text-white text-xs">Clic para ver</span>
                        </div>
                    </div>
                    <CardHeader className="p-4">
                        <CardTitle className="text-base text-white">{payment.user?.name || "Usuario Desconocido"}</CardTitle>
                        <CardDescription className="text-zinc-500">
                            {/* Assuming payment has reference logic later, using date for now */}
                            {new Date(payment.createdAt).toLocaleDateString()} • ${payment.amount.toFixed(2)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex gap-2">
                        <Button
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            size="sm"
                            onClick={() => handleApprove(payment.id)}
                            disabled={!!processingId}
                        >
                            {processingId === payment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="mr-2 h-4 w-4" /> Aprobar</>}
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="px-3"
                            onClick={() => handleReject(payment.id)}
                            disabled={!!processingId}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
