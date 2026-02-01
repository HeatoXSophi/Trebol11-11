import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Lock } from "lucide-react"

export default function PrivacyPage() {
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
                        <Lock className="h-8 w-8 text-gold-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">Política de Privacidad</h1>
                        <p className="text-zinc-400">Cómo protegemos sus datos en TREBOL 11-11.</p>
                    </div>
                </div>

                <div className="prose prose-invert prose-gold max-w-none space-y-6 text-zinc-300">
                    <p className="lead text-lg text-white">
                        En TREBOL 11-11, la privacidad y seguridad de nuestros usuarios es primordial. Esta política detalla qué información recopilamos y cómo la utilizamos para garantizar una experiencia transparente y segura.
                    </p>

                    <section>
                        <h3 className="text-xl font-bold text-gold-400">1. Información Recopilada</h3>
                        <p>
                            Recopilamos información personal necesaria para la gestión de su cuenta y la validación de premios, incluyendo:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Nombre completo y número de Cédula de Identidad (para verificación de edad y legalidad).</li>
                            <li>Número de teléfono (para notificaciones de seguridad y premios).</li>
                            <li>Datos de transacciones (comprobantes de pago y tickets generados).</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gold-400">2. Uso de la Información</h3>
                        <p>
                            Sus datos se utilizan exclusivamente para:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Procesar la compra de tickets y acreditación de saldo.</li>
                            <li>Notificarle si ha ganado un sorteo.</li>
                            <li>Mejorar la seguridad de la plataforma y prevenir fraudes.</li>
                            <li>Cumplir con las regulaciones legales vigentes.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gold-400">3. Protección de Datos</h3>
                        <p>
                            Implementamos medidas de seguridad de nivel bancario. Sus contraseñas están encriptadas y el acceso a la base de datos está estrictamente restringido. No compartimos ni vendemos su información a terceros.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold text-gold-400">4. Derechos del Usuario</h3>
                        <p>
                            Usted tiene derecho a solicitar la revisión, corrección o eliminación de sus datos personales de nuestros registros en cualquier momento, contactando a soporte@trebol11-11.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
