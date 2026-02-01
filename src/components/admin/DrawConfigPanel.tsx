"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { updateDrawConfig, getLatestDraw, finalizeDraw } from "@/app/actions/admin"
// import { toast } from "sonner" 
import { Save, Loader2 } from "lucide-react"

export function DrawConfigPanel() {
    const [loading, setLoading] = useState(false)
    const [draw, setDraw] = useState<any>(null)

    useEffect(() => {
        getLatestDraw().then(setDraw)
    }, [])

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await updateDrawConfig(formData)
        setLoading(false)
        if (res.success) {
            // alert("Configuración guardada correctamente") 
            // Better UX would be a toast, using simple alert for simplicity if no toast lib configured yet
            alert("¡Premio actualizado! Revise la página de inicio.")
            window.location.reload() // Refresh to see changes or re-fetch
        } else {
            alert("Error al guardar")
        }
    }

    return (
        <div className="space-y-6">


            {draw?.status === "CLOSED" && (
                <div className="bg-zinc-900 border border-gold-500/20 rounded-lg p-6 mb-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">El sorteo anterior finalizó</h3>
                    <p className="text-zinc-400 mb-4">Ganador: {draw.winningNumber}</p>
                    <Button
                        onClick={() => setDraw(null)}
                        className="bg-gold-600 hover:bg-gold-700 text-black font-bold"
                    >
                        + Configurar Nuevo Sorteo
                    </Button>
                </div>
            )}

            {(!draw || draw.status === "OPEN") && (
                <Card>
                    <CardHeader>
                        <CardTitle>{draw ? "Editar Sorteo Actual" : "Nuevo Sorteo"}</CardTitle>
                        <CardDescription>Configure qué se mostrará en la Landing Page (Hero Section).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleSubmit} className="space-y-4">
                            {draw && <input type="hidden" name="drawId" value={draw.id} />}

                            <div className="grid gap-2">
                                <Label htmlFor="prizeTitle">Título del Premio</Label>
                                <Input
                                    id="prizeTitle"
                                    name="prizeTitle"
                                    placeholder="Ej: Mercedes Benz AMG"
                                    defaultValue={draw?.prizeTitle || ""}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="drawDate">Fecha del Sorteo</Label>
                                <Input
                                    id="drawDate"
                                    name="drawDate"
                                    type="datetime-local"
                                    defaultValue={draw?.date ? new Date(draw.date).toISOString().slice(0, 16) : ""}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Fecha y hora límite para comprar.</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="prizeDescription">Subtítulo / Descripción</Label>
                                <Input
                                    id="prizeDescription"
                                    name="prizeDescription"
                                    placeholder="Ej: Incluye bono de $1000..."
                                    defaultValue={draw?.prizeDescription || ""}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="prizeAmount">Valor del Premio ($ USD)</Label>
                                    <Input
                                        id="prizeAmount"
                                        name="prizeAmount"
                                        type="number"
                                        step="0.01"
                                        placeholder="150000"
                                        defaultValue={draw?.prizeAmount || ""}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ticketPrice">Precio del Ticket ($ USD)</Label>
                                    <Input
                                        id="ticketPrice"
                                        name="ticketPrice"
                                        type="number"
                                        step="0.01"
                                        placeholder="2.00"
                                        defaultValue={draw?.ticketPrice || 2.0}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="prizeImageFile">Imagen del Premio</Label>
                                <Input
                                    id="prizeImageFile"
                                    name="prizeImageFile"
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                />
                                <input type="hidden" name="currentPrizeImage" value={draw?.prizeImage || ""} />
                                <input type="hidden" name="prizeImageUrl" placeholder="O pegar URL..." className="mt-2 text-xs border rounded px-2 py-1 w-full" />
                                <p className="text-xs text-muted-foreground">Sube un archivo PNG, JPG o WebP. Se mostrará en la Landing Page.</p>
                            </div>

                            {draw?.prizeImage && (
                                <div className="mt-4 rounded-lg overflow-hidden border border-zinc-800 relative h-48 w-full group">
                                    <img src={draw.prizeImage} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs p-2 text-center">Imagen Actual</div>
                                </div>
                            )}

                            <Button type="submit" disabled={loading} className="w-full bg-gold-600 hover:bg-gold-700 text-black font-bold">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {draw ? "Guardar Cambios" : "Lanzar Nuevo Sorteo"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {draw?.status === "OPEN" && (
                <Card className="border-gold-500/50 bg-gold-900/10">
                    <CardHeader>
                        <CardTitle className="text-gold-500">🏆 Finalizar Sorteo</CardTitle>
                        <CardDescription>Ingrese el número ganador para cerrar el sorteo actual.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={async (fd) => {
                            if (!confirm("¿Seguro que este es el número ganador? Esta acción es irreversible.")) return;
                            const res = await finalizeDraw(fd)
                            if (res.success) {
                                alert("Sorteo Finalizado. Ganador Registrado.")
                                window.location.reload()
                            }
                        }} className="flex gap-4 items-end">
                            <input type="hidden" name="drawId" value={draw.id} />
                            <div className="grid gap-2 flex-1">
                                <Label htmlFor="winningNumber">Número Ganador (4 Dígitos)</Label>
                                <Input
                                    id="winningNumber"
                                    name="winningNumber"
                                    placeholder="0000"
                                    maxLength={4}
                                    className="text-2xl font-mono tracking-widest text-center"
                                    required
                                />
                            </div>
                            <Button type="submit" variant="destructive" className="bg-gold-600 hover:bg-gold-700 text-black font-bold h-12">
                                Declarar Ganador
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
