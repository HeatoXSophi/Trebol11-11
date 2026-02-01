"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Star, Wallet, User, LogOut, Loader2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { BalanceDisplay } from "@/components/layout/BalanceDisplay"

export function Header() {
    const { data: session, status } = useSession()
    const loading = status === "loading"

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-black/50">
            <div className="container flex h-20 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-14 w-14">
                        <div className="absolute inset-0 rounded-full bg-gold-500 blur-md opacity-40 group-hover:opacity-80 transition-opacity"></div>
                        <img src="/logo-icon.png" alt="Trebol 11-11" className="relative h-full w-full object-contain drop-shadow-md p-1" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter italic text-white drop-shadow-md">
                        TREBOL <span className="text-gold-500 text-glow">11-11</span>
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-4">
                    {loading ? (
                        <div className="h-10 w-24 bg-zinc-800/50 animate-pulse rounded-full"></div>
                    ) : session ? (
                        <>
                            {/* Balance Pill */}
                            <BalanceDisplay initialBalance={(session.user as any).balance || 0} />

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-zinc-800 hover:bg-zinc-800">
                                        <div className="flex items-center justify-center w-full h-full text-lg font-bold text-gold-500 bg-zinc-900 rounded-full">
                                            {session.user?.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-white" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-white">{session.user?.name}</p>
                                            <p className="text-xs leading-none text-zinc-400">{session.user?.email || "ID: " + (session.user as any).id?.slice(-4)}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-zinc-800" />
                                    <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-gold-500 cursor-pointer">
                                        <Link href="/profile">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Mi Perfil / Cartera</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-gold-500 cursor-pointer md:hidden">
                                        <Link href="/payments/report">
                                            <Wallet className="mr-2 h-4 w-4" />
                                            <span>Recargar Saldo</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-zinc-800" />
                                    <DropdownMenuItem
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="text-red-400 focus:text-red-400 focus:bg-red-950/20 cursor-pointer"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Cerrar Sesión</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors hidden sm:block">
                                Iniciar Sesión
                            </Link>
                            <Link href="/register">
                                <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-gold-600 to-gold-400 px-6 py-2.5 text-sm font-bold text-black shadow-lg shadow-gold-500/20 transition-all hover:scale-105 hover:shadow-gold-500/40">
                                    REGISTRAR
                                </div>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}
