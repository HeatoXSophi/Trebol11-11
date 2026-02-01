"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

export default function AdminLoginPage() {
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === "Heatox.227") {
            // Set cookie for admin access (simple implementation)
            document.cookie = "admin_access=true; path=/; max-age=86400"
            router.push("/admin/dashboard")
        } else {
            setError("Acceso Denegado")
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <Card className="w-full max-w-sm bg-zinc-900 border-red-900/30">
                <CardHeader className="text-center">
                    <div className="mx-auto h-12 w-12 bg-red-900/20 rounded-full flex items-center justify-center mb-2">
                        <Lock className="h-6 w-6 text-red-500" />
                    </div>
                    <CardTitle className="text-white">Acceso Administrativo</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Clave de acceso"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black border-zinc-800 text-white"
                        />
                        {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
                        <Button type="submit" className="w-full bg-red-900 hover:bg-red-800 text-white">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
