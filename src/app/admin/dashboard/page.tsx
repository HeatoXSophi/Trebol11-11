"use client"

import { signOut } from "next-auth/react"

import { useState } from "react"
import { PaymentStream } from "@/components/admin/CommandCenter/PaymentStream"
import { LiveTicketGrid } from "@/components/admin/CommandCenter/LiveTicketGrid"
import { DrawConfigPanel } from "@/components/admin/DrawConfigPanel"
import { UsersPanel } from "@/components/admin/UsersPanel"
import { SalesPanel } from "@/components/admin/SalesPanel" // Verify if this file exists or mock it if missing
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Settings, LogOut, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
    const [activeView, setActiveView] = useState("dashboard")

    return (
        <div className="h-screen w-full bg-black text-foreground overflow-hidden flex">

            {/* 1. Mini Sidebar (Icon Only) */}
            <aside className="w-16 h-full border-r border-white/5 bg-zinc-950 flex flex-col items-center py-6 gap-6 z-20">
                <div className="w-8 h-8 rounded bg-gold-500 flex items-center justify-center font-bold text-black mb-4">T</div>

                <nav className="flex-1 flex flex-col gap-4 w-full px-2">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveView("dashboard")}
                        className={`w-full ${activeView === 'dashboard' ? 'text-gold-500 bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        title="Command Center"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveView("sorteos")}
                        className={`w-full ${activeView === 'sorteos' ? 'text-gold-500 bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        title="Configurar Sorteo"
                    >
                        <Settings className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveView("usuarios")}
                        className={`w-full ${activeView === 'usuarios' ? 'text-gold-500 bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        title="Usuarios"
                    >
                        <Users className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveView("ventas")}
                        className={`w-full ${activeView === 'ventas' ? 'text-gold-500 bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        title="Ventas"
                    >
                        <BarChart3 className="w-5 h-5" />
                    </Button>
                </nav>

                <Button
                    variant="ghost"
                    className="text-red-500 hover:bg-red-500/10 mb-4"
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                >
                    <LogOut className="w-5 h-5" />
                </Button>
            </aside>

            {/* 2. Payment Stream (Persistent Left Panel) */}
            <div className="hidden md:block w-80 h-full border-r border-white/5 bg-zinc-950/30 backdrop-blur top-0 z-10 shrink-0">
                <PaymentStream />
            </div>

            {/* 3. Main Content Area (Right Panel) */}
            <main className="flex-1 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black relative flex flex-col overflow-hidden">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none fixed"></div>

                <div className="relative z-10 flex-1 flex flex-col p-4 md:p-6 min-h-0">
                    {activeView === "dashboard" && <LiveTicketGrid />}

                    {activeView === "sorteos" && (
                        <div className="h-full overflow-y-auto max-w-4xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-bold text-white mb-6">Configuración de Sorteo</h2>
                            <DrawConfigPanel />
                        </div>
                    )}

                    {activeView === "usuarios" && (
                        <div className="h-full overflow-y-auto max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-bold text-white mb-6">Gestión de Usuarios</h2>
                            <UsersPanel />
                        </div>
                    )}

                    {activeView === "ventas" && (
                        <div className="h-full overflow-y-auto max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-2xl font-bold text-white mb-6">Reporte de Ventas</h2>
                            <SalesPanel /> // Ensure this component exists
                        </div>
                    )}
                </div>
            </main>

        </div>
    )
}
