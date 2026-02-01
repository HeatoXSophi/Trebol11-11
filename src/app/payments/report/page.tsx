import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PaymentReportForm } from "@/components/payments/PaymentReportForm"

export default async function PaymentReportPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none"></div>

            <Card className="w-full max-w-lg bg-zinc-950 border-white/10 relative z-10 shadow-2xl">
                <Link href="/profile" passHref>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-4 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>

                <CardHeader className="text-center pb-2 pt-12">
                    <CardTitle className="text-2xl font-black text-white">Reportar Pago</CardTitle>
                    <CardDescription className="text-zinc-400">Adjunta tu comprobante para recargar saldo</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="text-white text-center">Cargando formulario...</div>}>
                        <PaymentReportForm />
                    </Suspense>
                </CardContent>
            </Card>
        </main>
    )
}
