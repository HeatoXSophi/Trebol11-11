
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/Header"
import { Wallet, Ticket as TicketIcon, Clock, HandCoins, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { GoldenTicket } from "@/components/tickets/GoldenTicket"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"



async function getProfileData(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            tickets: {
                orderBy: { updatedAt: 'desc' },
                take: 100,
                include: { draw: true }
            },
            payments: {
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    })
    return user
}

export default async function ProfilePage() {
    const session = await auth()
    const userId = (session?.user as any)?.id

    if (!userId) {
        redirect("/login")
    }

    const user = await getProfileData(userId)
    if (!user) redirect("/login")

    return (
        <main className="min-h-screen bg-[#050505] text-foreground pb-20">
            <Header />

            <div className="container mt-10 space-y-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* Identification / Welcome */}
                    <div className="flex-1 space-y-2">
                        <h1 className="text-3xl font-black text-white">Hola, <span className="text-gold-500 capitalize">{user.name}</span></h1>
                        <p className="text-zinc-500">Gestiona tus tickets y saldo desde aquí.</p>
                    </div>

                    {/* Balance Card Big */}
                    <Card className="w-full md:w-96 bg-gradient-to-br from-zinc-900 to-black border-gold-500/30 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-24 bg-gold-500/10 blur-[60px] rounded-full pointer-events-none"></div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                                <Wallet className="w-4 h-4" /> Saldo Disponible
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline justify-between">
                                <span className="text-4xl font-black text-white">${user.balance.toFixed(2)}</span>
                                <span className="text-xs text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded-full border border-emerald-500/20">USD</span>
                            </div>
                            <div className="mt-6">
                                <Link href="/payments/report">
                                    <Button className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold">
                                        <HandCoins className="mr-2 h-4 w-4" />
                                        Recargar Saldo
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Tickets Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <TicketIcon className="w-5 h-5 text-gold-500" /> Mis Tickets Recientes
                        </h2>
                        <div className="space-y-3">
                            {user.tickets.length > 0 ? user.tickets.map(ticket => (
                                <Dialog key={ticket.id}>
                                    <DialogTrigger asChild>
                                        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 flex justify-between items-center group hover:border-gold-500/30 transition-colors cursor-pointer relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative z-10">
                                                <div className="font-mono text-2xl font-bold text-white tracking-widest group-hover:text-gold-400 transition-colors">
                                                    {ticket.number}
                                                </div>
                                                <div className="text-xs text-zinc-500 mt-1">
                                                    Sorteo: {new Date(ticket.draw?.date || "").toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-right relative z-10">
                                                <Badge variant={ticket.status === 'WINNER' ? 'default' : 'outline'} className={ticket.status === 'WINNER' ? "bg-gold-500 text-black border-none" : "border-zinc-700 text-zinc-400"}>
                                                    {ticket.status === 'AVAILABLE' ? 'JUGANDO' : ticket.status}
                                                </Badge>
                                                <div className="text-[10px] text-zinc-600 font-mono mt-1 uppercase flex items-center gap-1 justify-end">
                                                    <TicketIcon className="w-3 h-3" /> Ver Ticket
                                                </div>
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="bg-transparent border-none shadow-none max-w-sm p-0">
                                        <DialogTitle className="sr-only">Golden Ticket Details</DialogTitle>
                                        <GoldenTicket
                                            ticketNumber={ticket.number}
                                            drawDate={ticket.draw?.date || new Date()}
                                            price={ticket.draw?.ticketPrice || 2.0}
                                            serialCode={ticket.serialCode}
                                        />
                                    </DialogContent>
                                </Dialog>
                            )) : (
                                <div className="text-center py-10 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                                    <p className="text-zinc-500">No tienes tickets jugados aún.</p>
                                    <Link href="/">
                                        <Button variant="link" className="text-gold-500">Ir a Jugar</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Transactions Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-zinc-500" /> Historial de Pagos
                        </h2>
                        <div className="space-y-3">
                            {user.payments.length > 0 ? user.payments.map(payment => (
                                <div key={payment.id} className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${payment.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'} `}>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">Recarga de Saldo</div>
                                            <div className="text-xs text-zinc-500">{new Date(payment.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-white">+${payment.amount.toFixed(2)}</div>
                                        <span className={`text-[10px] font-bold ${payment.status === 'APPROVED' ? 'text-green-500' : 'text-yellow-600'} `}>
                                            {payment.status === 'APPROVED' ? 'COMPLETADO' : 'PENDIENTE'}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
                                    <p className="text-zinc-500 text-sm">No has realizado recargas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
