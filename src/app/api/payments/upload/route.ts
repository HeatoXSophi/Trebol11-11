import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File
        const amount = formData.get("amount") as string
        const identification = formData.get("identification") as string

        if (!file || !amount || !identification) {
            return NextResponse.json(
                { error: "Faltan datos requeridos" },
                { status: 400 }
            )
        }

        // Validate User Exists
        const user = await prisma.user.findUnique({
            where: { identification },
        })

        if (!user) {
            return NextResponse.json(
                { error: "Usuario no encontrado. Verifique la cédula." },
                { status: 404 }
            )
        }

        // Save File
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const filename = uniqueSuffix + '-' + file.name.replace(/\s/g, '_')
        const path = join(process.cwd(), "public/uploads", filename)

        await writeFile(path, buffer)
        const publicPath = `/uploads/${filename}`

        // Create Payment Record
        const payment = await prisma.payment.create({
            data: {
                amount: parseFloat(amount),
                proofImage: publicPath,
                userId: user.id,
            },
        })

        return NextResponse.json({ success: true, payment })

    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { error: "Error al procesar el pago" },
            { status: 500 }
        )
    }
}
