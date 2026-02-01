"use client"

import { resetPassword } from "@/app/actions/reset-password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage({ searchParams }: { searchParams: { token: string } }) {
    const router = useRouter()
    const token = searchParams.token

    if (!token) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-red-500">Token inválido</div>
        )
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Nueva Contraseña</h1>

                <form action={async (formData) => {
                    const res = await resetPassword(token, formData)
                    if (res?.error) {
                        alert(res.error)
                    } else {
                        alert("¡Contraseña restablecida! Inicia sesión.")
                        router.push("/login")
                    }
                }} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-white">Nueva Contraseña</Label>
                        <Input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className="bg-black/50 border-zinc-700 h-11 text-white"
                        />
                    </div>

                    <Button className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold h-12">
                        Cambiar Contraseña
                    </Button>
                </form>
            </div>
        </div>
    )
}
