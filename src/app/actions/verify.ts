"use server"

import { prisma } from "@/lib/db"

export async function verifyTicket(serialCode: string) {
    try {
        console.log("Verifying ticket with serial:", serialCode);
        const cleanCode = serialCode?.trim(); // Optional chain just in case

        if (!cleanCode) { // Handle empty code gracefuly
            console.warn("Empty serial code provided");
            return { success: false, error: "Código inválido (Vacío)" };
        }

        const ticket = await prisma.ticket.findUnique({
            where: { serialCode: cleanCode },
            include: {
                user: {
                    select: {
                        name: true,
                        lastName: true,
                        identification: true,
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
            console.log("Ticket not found for serial:", cleanCode);
            return { success: false, error: "Ticket no encontrado" }
        }

        console.log("Ticket verified successfully:", ticket.id);
        return { success: true, ticket }
    } catch (error) {
        console.error("Verification EXCEPTION:", error)
        // Return the actual error message for debugging purposes (remove in prod)
        return { success: false, error: `Error interno: ${String(error)}` }
    }
}
