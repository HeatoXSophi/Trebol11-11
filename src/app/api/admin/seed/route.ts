
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET() {
    try {
        // 1. Ensure Admin User Exists
        const adminExists = await prisma.user.findFirst({
            where: { role: "ADMIN" }
        })

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10)
            await prisma.user.create({
                data: {
                    name: "Super Admin",
                    lastName: "System",
                    identification: "00000000",
                    phone: "+0000000000",
                    email: "admin@system.com",
                    password: hashedPassword,
                    role: "ADMIN"
                }
            })
            console.log("Admin user created.")
        }

        // 2. Ensure Active Draw Exists
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
            return NextResponse.json({ message: "Sorteo y Admin (00000000 / admin123) creados exitosamente." })
        }

        return NextResponse.json({ message: "Ya existe un sorteo activo. (Admin check completed)" })


    } catch (error) {
        return NextResponse.json({ error: "Error seeding database" }, { status: 500 })
    }
}
