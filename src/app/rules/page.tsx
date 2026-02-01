import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function RulesPage() {
    return (
        <div className="container max-w-3xl py-12 text-foreground min-h-screen">
            <Link href="/">
                <Button variant="ghost" className="mb-8 hover:bg-gold-500/10 hover:text-gold-500 transition-colors">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Volver al Inicio
                </Button>
            </Link>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="border-b border-white/10 pb-6">
                    <h1 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600">Reglas del Sorteo</h1>
                    <p className="text-xl text-zinc-400">Transparencia y condiciones del juego TREBOL 11-11.</p>
                </div>

                <div className="grid gap-6">
                    <div className="rounded-xl border border-gold-500/20 bg-gradient-to-br from-zinc-900 to-black p-6 hover:border-gold-500/40 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="rounded-full bg-gold-500/20 p-2 mt-1">
                                <AlertTriangle className="h-6 w-6 text-gold-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Condición de Juego (80%)</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    El sorteo <strong>solo se llevará a cabo si se ha vendido al menos el 80% de los tickets disponibles</strong> para la fecha programada. Esta medida asegura que el pozo de premios esté garantizado.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6">
                        <div className="flex items-start gap-4">
                            <div className="rounded-full bg-blue-500/20 p-2 mt-1">
                                <CheckCircle2 className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Mecánica de Rollover (Pospuesto)</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Si no se alcanza la meta del 80% de ventas:
                                </p>
                                <ul className="mt-2 list-disc pl-5 space-y-1 text-zinc-400">
                                    <li>El sorteo <strong>sigue activo</strong> hasta completar el porcentaje requerido.</li>
                                    <li><strong>Su ticket mantiene validez total:</strong> Jugará con el mismo número y serial que compró.</li>
                                    <li>No necesita canjear ni comprar un nuevo ticket; el sistema lo mueve automáticamente a la nueva fecha.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6">
                        <div className="flex items-start gap-4">
                            <div className="rounded-full bg-red-500/20 p-2 mt-1">
                                <CheckCircle2 className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Anulación de Tickets Jugados</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Una vez que el sorteo se realiza oficialmente (al cumplirse la meta de ventas), los tickets participantes quedan marcados como <strong>JUGADOS</strong> y no podrán ser utilizados en sorteos futuros.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Determinación del Ganador</h3>
                        <ul className="list-disc list-inside space-y-2 text-zinc-400">
                            <li>El ganador se determina basándose en los resultados de la lotería <strong>Super Gana</strong>.</li>
                            <li>Específicamente se toma el resultado del sorteo de las <strong>10:00 PM</strong> por ser el horario estelar.</li>
                            <li>Si su número de ticket coincide exactamente con los últimos 4 dígitos del sorteo oficial, ¡usted gana!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
