"use client"

import { useEffect, useState } from "react"
import { getAllUsers } from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Ticket, Trash2 } from "lucide-react"

export function UsersPanel() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllUsers().then(data => {
            setUsers(data)
            setLoading(false)
        })
    }, [])

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-white" /></div>

    return (
        <Card className="bg-zinc-900 border-white/10">
            <CardHeader>
                <CardTitle className="text-white">Usuarios Registrados</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-white/5">
                            <Avatar className="h-10 w-10 border border-white/10">
                                <AvatarImage src={user.image} />
                                <AvatarFallback className="bg-zinc-800 text-gold-500 font-bold">
                                    {user.name?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                                <div className="font-bold text-white truncate">{user.name || "Sin Nombre"}</div>
                                <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                                <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-400">
                                    <Ticket className="w-3 h-3 text-emerald-500" />
                                    {user._count?.tickets} tickets
                                    <span className="mx-1">•</span>
                                    ${user.balance.toFixed(2)}
                                </div>
                            </div>
                            <button
                                onClick={async () => {
                                    if (confirm('¿Borrar usuario permanentemente?')) {
                                        setLoading(true)
                                        await import("@/app/actions/admin").then(m => m.deleteUser(user.id))
                                        window.location.reload()
                                    }
                                }}
                                className="ml-auto p-2 text-zinc-500 hover:text-red-500 hover:bg-white/5 rounded-full transition-colors"
                                title="Eliminar Usuario"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
