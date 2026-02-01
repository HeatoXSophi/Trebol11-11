"use server"

import { prisma } from "@/lib/db"

export async function getTicketStatus(drawId?: string) {
    try {
        // If no drawId provided, find the first OPEN draw
        let targetDrawId = drawId;

        if (!targetDrawId) {
            // Find all OPEN draws
            const openDraws = await prisma.draw.findMany({
                where: { status: "OPEN" },
                select: { id: true },
                orderBy: { date: 'asc' }
            });

            // Try to find one with existing tickets
            for (const draw of openDraws) {
                const ticketCount = await prisma.ticket.count({
                    where: { drawId: draw.id }
                });
                if (ticketCount > 0) {
                    targetDrawId = draw.id;
                    break;
                }
            }

            // Fallback: Use the first one if none have tickets (e.g. new draw)
            if (!targetDrawId && openDraws.length > 0) {
                targetDrawId = openDraws[0].id;
            }
        }

        if (!targetDrawId) {
            return { success: false, message: "No active draw found" };
        }

        // Fetch all tickets for this draw
        const tickets = await prisma.ticket.findMany({
            where: { drawId: targetDrawId },
            select: {
                number: true,
                status: true,
                serialCode: true,
                user: {
                    select: {
                        name: true,
                        lastName: true,
                        identification: true,
                        email: true,
                        phone: true,
                        payments: {
                            take: 1,
                            orderBy: { createdAt: 'desc' },
                            select: { proofImage: true }
                        }
                    }
                },
                updatedAt: true
            }
        });

        // Transform to a map for O(1) lookup on the frontend
        // Key: ticket number (string "0000"- "9999")
        const ticketMap: Record<string, any> = {};

        tickets.forEach(t => {
            ticketMap[t.number] = {
                status: t.status,
                user: t.user,
                serialCode: t.serialCode,
                updatedAt: t.updatedAt
            };
        });

        return { success: true, tickets: ticketMap, drawId: targetDrawId };

    } catch (error) {
        console.error("Error fetching ticket status:", error);
        return { success: false, message: "Failed to fetch ticket data" };
    }
}
