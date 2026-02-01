"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { login } from "@/app/actions/auth"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold h-12" type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Iniciando..." : "Entrar"}
        </Button>
    )
}

export function LoginForm() {
    const [errorMessage, dispatch] = useActionState(login, undefined)

    return (
        <form action={dispatch} className="space-y-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Cédula / Correo Electrónico</Label>
                    <Input name="identification" placeholder="V-12345678" className="bg-black/50 border-zinc-700 h-11" required />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Contraseña</Label>
                        <a href="/forgot-password" className="text-xs text-gold-500 hover:text-gold-400 font-bold hover:underline">
                            ¿Olvidaste tu clave?
                        </a>
                    </div>
                    <Input name="password" type="password" placeholder="••••••••" className="bg-black/50 border-zinc-700 h-11" required />
                </div>
                {errorMessage && (
                    <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm text-center font-bold">
                        {errorMessage}
                    </div>
                )}
                <SubmitButton />
            </div>
        </form>
    )
}
