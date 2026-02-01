"use client"

import { useActionState } from "react"
import { forgotPassword } from "@/app/actions/reset-password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail } from "lucide-react"

function SubmitButton() {
    return (
        <Button className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold h-12 mt-4">
            Enviar Link de Recuperación
        </Button>
    )
}

export default function ForgotPasswordPage() {
    // Note: useActionState in Next.js 14/15 might require specific handling or use wrapper
    // For simplicity with server actions, we can wrapping logic inline or use transition

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

            <div className="w-full max-w-md bg-zinc-950/80 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8 shadow-2xl relative z-10">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black text-white mb-2">Recuperar Contraseña</h1>
                    <p className="text-zinc-400 text-sm">Ingresa tu correo y te enviaremos un enlace para restablecer tu clave.</p>
                </div>

                <form action={async (formData) => {
                    alert("Enviando solicitud...")
                    const res = await forgotPassword(formData)
                    if (res?.error) {
                        alert(res.error)
                    } else {
                        alert("¡Correo enviado! Revisa tu bandeja de entrada (y spam).")
                    }
                }} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-white">Correo Electrónico</Label>
                        <Input
                            name="email"
                            type="email"
                            placeholder="juan@ejemplo.com"
                            required
                            className="bg-black/50 border-zinc-700 h-11 text-white"
                        />
                    </div>

                    <SubmitButton />

                    <div className="text-center mt-4">
                        <a href="/login" className="text-xs text-gold-500 hover:underline">
                            Volver al Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
