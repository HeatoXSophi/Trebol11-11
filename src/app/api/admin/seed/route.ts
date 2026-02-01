import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
    try {
        const activeDraw = await prisma.draw.findFirst({
            where: { status: "OPEN" }
        })

        if (!activeDraw) {
            await prisma.draw.create({
                data: {
                    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                    winningNumber: null,
                    prizeImage: "https://placehold.co/600x400/gold/black?text=Premio+Mayor",
                    prizeTitle: "Gran Premio Inaugural",
                    prizeAmount: 1000.00,
                    ticketPrice: 5.00,
                    status: "OPEN"
                }
            })
            return NextResponse.json({ message: "Sorteo creado exitosamente." })
        }

        return NextResponse.json({ message: "Ya existe un sorteo activo." })
    } catch (error) {
        return NextResponse.json({ error: "Error seeding database" }, { status: 500 })
    }
}
