"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function getUserBalance() {
    const session = await auth()
    if (!session || !session.user) return null

    // Prefer ID if available, fallback to email
    const userId = (session.user as any).id
    const userEmail = session.user.email

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { email: userEmail as string }
                ]
            },
            select: { balance: true }
        })
        return user?.balance || 0
    } catch (error) {
        return 0
    }
}
}

export async function getUnavailableTickets() {
    try {
        const draw = await prisma.draw.findFirst({
            where: { status: "OPEN" },
            orderBy: { date: 'desc' }
        })

        if (!draw) return []

        const soldTickets = await prisma.ticket.findMany({
            where: {
                drawId: draw.id,
                OR: [
                    { status: "SOLD" },
                    { userId: { not: null } }
                ]
            },
            select: { number: true }
        })

        return soldTickets.map(t => t.number)
    } catch (error) {
        console.error("Error fetching unavailable tickets:", error)
        return []
    }
}

export async function buyTickets(numbers: string[]) {
    const session = await auth()
    if (!session || !session.user) return { success: false, error: "No autorizado" }

    const userId = (session.user as any).id

    if (!numbers || numbers.length === 0) return { success: false, error: "Seleccione tickets" }

    try {
        // 1. Get Active Draw
        const draw = await prisma.draw.findFirst({
            where: { status: "OPEN" },
            orderBy: { date: 'desc' }
        })

        if (!draw) return { success: false, error: "No hay sorteos abiertos" }

        // 2. Validate Balance
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) return { success: false, error: "Usuario no encontrado" }

        const totalCost = numbers.length * draw.ticketPrice

        if (user.balance < totalCost) {
            return { success: false, error: `Saldo insuficiente. Requiere $${totalCost}` }
        }

        // 3. Process Purchase (Sequential to ensure atomic-like behavior per ticket)
        // Check availability first
        const existing = await prisma.ticket.findMany({
            where: {
                drawId: draw.id,
                number: { in: numbers },
                OR: [
                    { status: "SOLD" },
                    { userId: { not: null } }
                ]
            }
        })

        if (existing.length > 0) {
            return { success: false, error: `El número ${existing[0].number} ya no está disponible.` }
        }

        // DB Transaction: Deduct Balance + Create Tickets
        await prisma.$transaction(async (tx) => {
            // Deduct
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: totalCost } }
            })

            // Create/Assign Tickets
            for (const num of numbers) {
                // Check if ticket record exists (pre-generated) or create new
                // For this app, we create on demand or update if placeholder exists.
                // Simplified: Upsert logic or just Create if we assume dynamic generation.
                // Let's assume dynamic generation for simplicity unless schema says otherwise.
                // Schema has @unique([number, drawId]), so we are good.

                await tx.ticket.create({
                    data: {
                        number: num,
                        drawId: draw.id,
                        userId: userId,
                        status: "SOLD",
                        serialCode: `${draw.id.slice(0, 4).toUpperCase()}-${num}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`.toUpperCase() // Generate readable unique serial
                    }
                })
            }
        })

        // Fire and forget notification
        import("@/lib/telegram").then(({ sendAdminNotification }) => {
            const userName = user.name || user.email || "Usuario";
            const msg = `🎟️ *Nuevos Tickets Vendidos*\n\n👤 *Usuario:* ${userName}\n🔢 *Cantidad:* ${numbers.length}\n💰 *Total:* $${totalCost}\n🎫 *Números:* ${numbers.join(", ")}`;
            sendAdminNotification(msg);
        }).catch(console.error);

        return { success: true, message: "¡Compra Exitosa!" }

    } catch (error) {
        console.error("Buy Tickets Error:", error)
        return { success: false, error: "Error al procesar la compra." }
    }
}
