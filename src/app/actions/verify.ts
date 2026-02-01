"use server"

import { prisma } from "@/lib/db"

export async function verifyTicket(serialCode: string) {
    try {
        const cleanCode = serialCode.trim();
        const ticket = await prisma.ticket.findUnique({
            where: { serialCode: cleanCode },
            include: {
                user: {
                    select: {
                        name: true,
                        lastName: true,
                        identification: true,
                        // email: false, // Don't expose private contact info publicly
                        // phone: false 
                    }
                },
                draw: {
                    select: {
                        date: true,
                        prizeTitle: true,
                        prizeAmount: true,
                        winningNumber: true,
                        status: true
                    }
                }
            }
        })

        if (!ticket) {
            return { success: false, error: "Ticket no encontrado" }
        }

        return { success: true, ticket }
    } catch (error) {
        console.error("Verification Error:", error)
        return { success: false, error: "Error de verificación" }
    }
}
