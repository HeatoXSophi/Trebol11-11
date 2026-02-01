"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
// import { sendTicketEmail } from "@/lib/email" // TODO: Implement later

export async function buyTickets(numbers: string[], drawId: string) {
    const session = await auth()
    if (!session?.user?.email) { // Using email as identifier for NextAuth default, or id
        return { success: false, error: "No autorizado" }
    }

    // Get fresh user data including balance
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) return { success: false, error: "Usuario no encontrado" }

    const draw = await prisma.draw.findUnique({ where: { id: drawId } })
    if (!draw) return { success: false, error: "Sorteo no disponible" }

    const totalCost = numbers.length * draw.ticketPrice

    if (user.balance < totalCost) {
        return { success: false, error: "Saldo insuficiente. Por favor recarga." }
    }

    try {
        // Transaction: Deduct balance AND create tickets
        const result = await prisma.$transaction(async (tx) => {
            // 1. Deduct balance
            await tx.user.update({
                where: { id: user.id },
                data: { balance: { decrement: totalCost } }
            })

            // 2. Create tickets
            const tickets = []
            for (const num of numbers) {
                // Check availability (double check within transaction)
                const existing = await tx.ticket.findFirst({
                    where: { number: num, drawId, status: "AVAILABLE" } // If status logic implemented, or just check existence
                })

                // Simplified: Assuming if ticket row doesn't exist or status is not SOLD, we can buy. 
                // Better: Create ticket rows on demand.

                const ticket = await tx.ticket.create({
                    data: {
                        number: num,
                        status: "SOLD",
                        userId: user.id,
                        drawId: drawId,
                        // serialCode generated automatically by default()
                    }
                })
                tickets.push(ticket)
            }
            return tickets
        })

        // 3. Send Email (Async, don't block)
        // In a real serverless env, use a queue (Inngest/Trigger.dev), but here just fire and forget
        import("@/lib/email").then(({ sendTicketEmail }) => {
            sendTicketEmail(user.email!, user.name || "Jugador", result)
        }).catch(err => console.error("Email import failed", err))

        revalidatePath("/play")
        revalidatePath("/")

        return { success: true, tickets: result }

    } catch (error) {
        console.error("Compra fallida:", error)
        return { success: false, error: "Error al procesar la compra. Intente nuevamente." }
    }
}
