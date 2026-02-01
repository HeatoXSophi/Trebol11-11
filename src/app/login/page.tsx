import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginForm } from "@/components/auth/LoginForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/20 via-black to-black pointer-events-none" />

            <Card className="w-full max-w-md bg-zinc-900/80 border-gold-500/30 text-white backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-4 left-4 z-20">
                    <Link href="/" className="flex items-center text-zinc-400 hover:text-gold-500 transition-colors text-sm font-medium">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
                    </Link>
                </div>

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/50 mb-4">
                        <span className="text-2xl">🎟️</span>
                    </div>
                    <CardTitle className="text-3xl font-black text-gold-500 tracking-tight uppercase">
                        TREBOL 11-11
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Ingresa a la plataforma de sorteos más exclusiva.
                    </CardDescription>
                </CardHeader>



                <CardContent className="space-y-6">
                    <LoginForm />
                    <div className="text-center text-sm text-zinc-500 mt-4">
                        ¿No tienes cuenta?{" "}
                        <Link href="/register" className="text-gold-500 hover:text-gold-400 font-bold hover:underline transition-all">
                            Regístrate aquí
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
