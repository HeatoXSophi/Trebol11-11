import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ScrollText } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="container max-w-3xl py-12 text-foreground min-h-screen">
            <Link href="/">
                <Button variant="ghost" className="mb-8 hover:bg-gold-500/10 hover:text-gold-500 transition-colors">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
            </Link>

            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="border-b border-white/10 pb-6 flex items-center gap-4">
                    <div className="rounded-full bg-gold-500/20 p-3">
                        <ScrollText className="h-8 w-8 text-gold-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">Términos y Condiciones</h1>
                        <p className="text-zinc-400">Acuerdo de uso de la plataforma TREBOL 11-11.</p>
                    </div>
                </div>

                <div className="prose prose-invert prose-gold max-w-none space-y-6 text-zinc-300">
                    <section>
                        <h3 className="text-xl font-bold text-gold-400">1. Aceptación de los Términos</h3>
                        <p>
                            Al registrarse y utilizar los servicios de TREBOL 11-11, usted acepta estar legalmente vinculado por estos términos. Si no está de acuerdo, por favor absténgase de usar la plataforma.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gold-400">2. Elegibilidad</h3>
                        <p>
                            El servicio está reservado exclusivamente para mayores de 18 años. TREBOL 11-11 se reserva el derecho de solicitar documentación de identidad (Cédula/ID) para verificar la edad antes de procesar cualquier premio.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gold-400">3. Compras y Pagos</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Todas las ventas de tickets son finales una vez que el sorteo ha sido confirmado.</li>
                            <li>Los pagos deben realizarse a través de los canales oficiales indicados en la plataforma.</li>
                            <li>TREBOL 11-11 no se hace responsable por errores en la transferencia de fondos por parte del usuario.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gold-400">4. Premios y Retiros</h3>
                        <p>
                            Los ganadores serán notificados automáticamente. Los fondos ganados se acreditarán a su Billetera TREBOL 11-11, desde donde podrán solicitar el retiro a su cuenta bancaria verificada. El tiempo de procesamiento de retiro es de 24 a 48 horas hábiles.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
