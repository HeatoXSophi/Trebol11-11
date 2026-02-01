"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, CheckCircle, Loader2 } from "lucide-react"
import { createPaymentReport } from "@/app/actions/payment-report"

export function PaymentReportForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const amountParam = searchParams.get("amount")
    const [amount, setAmount] = useState(amountParam || "")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null)

    // Fetch BCV rate on mount
    const [bcvRate, setBcvRate] = useState<number>(0)
    useEffect(() => {
        fetch('/api/bcv').then(res => res.json()).then(data => setBcvRate(data.rate)).catch(() => setBcvRate(45.00))
    }, [])

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createPaymentReport(formData)
        setLoading(false)
        if (res.success) {
            setSuccess(true)
            setTimeout(() => {
                router.push("/profile")
            }, 3000)
        } else {
            alert("Error al enviar reporte: " + (res.error || "Intente de nuevo"))
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-500 py-12">
                <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center p-4">
                    <CheckCircle className="h-full w-full text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-white text-center">¡Reporte Enviado!</h2>
                <p className="text-zinc-400 text-center max-w-md">
                    Tu pago está siendo verificado por un administrador. <br />
                    Una vez aprobado, verás el saldo en tu billetera.
                </p>
                <Button variant="outline" onClick={() => router.push("/profile")} className="mt-6 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black">
                    Ir a mi Perfil
                </Button>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {/* Disclaimer / Payment Data */}
            <div className="bg-zinc-900 border border-gold-500/20 rounded-lg p-4 space-y-3">
                <h3 className="text-gold-500 font-bold text-sm uppercase tracking-wider">Datos Bancarios</h3>
                <div className="grid grid-cols-1 gap-2 text-xs text-zinc-300">
                    <div className="flex justify-between border-b border-zinc-800 pb-1">
                        <span>Pago Móvil:</span>
                        <span className="font-mono text-white">0414-1234567 / V-12345678 / BdV</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-1">
                        <span>Zelle:</span>
                        <span className="font-mono text-white">pagos@trebol11-11.com</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-1">
                        <span>Binance Pay:</span>
                        <span className="font-mono text-white">ID: 123456789</span>
                    </div>
                    <div className="flex justify-between">
                        <span>USDT (TRC20):</span>
                        <span className="font-mono text-white text-[10px] break-all">T9...WalletMockAddress</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Monto a Reportar ($ USD)</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-8 bg-zinc-900 border-zinc-700 text-white text-lg font-bold"
                        required
                        placeholder="0.00"
                    />
                </div>
                {amount && bcvRate > 0 && (
                    <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg flex justify-between items-center animate-in fade-in">
                        <span className="text-zinc-400 text-sm">Equivalente en Bs:</span>
                        <div className="text-right">
                            <div className="text-emerald-400 font-mono font-bold text-lg">
                                Bs. {(parseFloat(amount) * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-[10px] text-zinc-500">Tasa BCV: {bcvRate.toFixed(2)}</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="proofImage" className="text-white">Comprobante de Pago</Label>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-gold-500/50 transition-colors bg-zinc-900/50 cursor-pointer relative group">
                    <input
                        type="file"
                        id="proofImage"
                        name="proofImage"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setFileName(e.target.files[0].name)
                            }
                        }}
                    />
                    <Upload className="mx-auto h-8 w-8 text-zinc-500 group-hover:text-gold-500 transition-colors mb-2" />
                    <p className="text-sm text-zinc-400 group-hover:text-white transition-colors">
                        {fileName ? (
                            <span className="text-gold-400 font-bold">{fileName}</span>
                        ) : (
                            "Click para subir captura"
                        )}
                    </p>
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gold-600 hover:bg-gold-700 text-black font-bold h-12 text-lg">
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Enviar Reporte"}
            </Button>
        </form>
    )
}
