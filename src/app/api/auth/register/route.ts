import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, identification, phone } = body

        if (!name || !identification || !phone) {
            return NextResponse.json(
                { error: "Todos los campos son requeridos" },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { identification },
                    { phone }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Usuario ya registrado con esa cédula o teléfono" },
                { status: 409 }
            )
        }

        const user = await prisma.user.create({
            data: {
                name,
                identification,
                phone,
            },
        })

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
