"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { register } from "@/app/actions/auth"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold h-12" type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Creando cuenta..." : "Registrarse y Jugar"}
        </Button>
    )
}

export function RegisterForm() {
    const [errorMessage, dispatch, isPending] = useActionState(register, undefined)

    return (
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/80 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">Crear Cuenta</CardTitle>
                <CardDescription className="text-zinc-400">
                    Ingrese sus datos para participar en la lotería.
                </CardDescription>
            </CardHeader>
            <form action={dispatch}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-bold text-zinc-400">
                                Nombre
                            </label>
                            <Input id="name" name="name" placeholder="Juan" required className="bg-black border-zinc-700 text-white h-11" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-bold text-zinc-400">
                                Apellido
                            </label>
                            <Input id="lastName" name="lastName" placeholder="Pérez" required className="bg-black border-zinc-700 text-white h-11" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-zinc-400">
                            Correo Electrónico
                        </label>
                        <Input id="email" name="email" type="email" placeholder="juan@ejemplo.com" required className="bg-black border-zinc-700 text-white h-11" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="identification" className="text-sm font-bold text-zinc-400">
                            Cédula / ID
                        </label>
                        <Input id="identification" name="identification" placeholder="Ej: V-12345678" required className="bg-black border-zinc-700 text-white h-11" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-bold text-zinc-400">
                            Teléfono
                        </label>
                        <Input id="phone" name="phone" type="tel" placeholder="Ej: 0414-1234567" required className="bg-black border-zinc-700 text-white h-11" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-bold text-zinc-400">
                            Contraseña
                        </label>
                        <Input id="password" name="password" type="password" placeholder="••••••••" required className="bg-black border-zinc-700 text-white h-11" />
                    </div>
                    {errorMessage && <p className="text-sm text-red-500 font-bold bg-red-900/20 p-3 rounded border border-red-500/50 text-center">{errorMessage}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <SubmitButton />
                    <div className="text-center text-sm">
                        <span className="text-zinc-400">¿Ya tienes una cuenta? </span>
                        <a href="/login" className="text-gold-500 hover:text-gold-400 font-bold underline underline-offset-4">
                            Iniciar Sesión
                        </a>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}

