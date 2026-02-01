"use client"

import * as React from "react"
import { Upload, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function PaymentUploadForm() {
    const [file, setFile] = React.useState<File | null>(null)
    const [preview, setPreview] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [error, setError] = React.useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            const objectUrl = URL.createObjectURL(selectedFile)
            setPreview(objectUrl)
        }
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!file) {
            setError("Por favor seleccione un comprobante")
            return
        }

        setIsLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)

        try {
            const response = await fetch("/api/payments/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const resData = await response.json()
                throw new Error(resData.error || "Error al subir el pago")
            }

            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Algo salió mal")
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <Card className="w-full max-w-md border-emerald-500/50 bg-emerald-500/10">
                <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="rounded-full bg-emerald-500 p-3">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-foreground">¡Pago Reportado!</h3>
                        <p className="text-muted-foreground text-sm">
                            Tu comprobante ha sido recibido. Un administrador lo verificará en breve y actualizará tu saldo.
                        </p>
                    </div>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        Subir otro pago
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Reportar Pago</CardTitle>
                <CardDescription>
                    Sube una captura de tu transferencia para recargar saldo.
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                    {/* Mockup Advice */}
                    <div className="rounded-md bg-blue-500/10 p-3 text-sm text-blue-400 border border-blue-500/20">
                        Pagomóvil: 0414-1234567 • CI: 12.345.678 • Banco Venezuela
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="identification" className="text-sm font-medium">
                            Cédula del Usuario Registrado
                        </label>
                        <Input id="identification" name="identification" placeholder="V-12345678" required disabled={isLoading} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm font-medium">
                            Monto (Bs)
                        </label>
                        <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" required disabled={isLoading} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Comprobante</label>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <label
                                htmlFor="picture"
                                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border text-center border-dashed border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="h-full object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Upload className="h-8 w-8" />
                                        <span>Haz clic para subir imagen</span>
                                    </div>
                                )}
                                <input id="picture" name="file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Reportar Pago
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
