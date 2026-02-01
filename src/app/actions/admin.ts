"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { uploadFile } from "@/lib/storage"

export async function getLatestDraw() {
    try {
        // 1. Try to find an Active (OPEN) draw first
        const openDraw = await prisma.draw.findFirst({
            where: { status: "OPEN" },
            orderBy: { date: 'desc' }, // In case multiple are open, get latest
            include: {
                _count: {
                    select: { tickets: { where: { status: "SOLD" } } }
                }
            }
        })

        if (openDraw) return openDraw

        // 2. If no open draw, get the latest one (likely CLOSED)
        const latestDraw = await prisma.draw.findFirst({
            orderBy: { date: 'desc' },
            include: {
                _count: {
                    select: { tickets: { where: { status: "SOLD" } } }
                }
            }
        })
        return latestDraw
    } catch (error) {
        console.error("Error fetching draw:", error)
        return null
    }
}

export async function updateDrawConfig(formData: FormData) {
    console.log("updateDrawConfig called")
    try {
        const prizeTitle = formData.get("prizeTitle") as string
        const prizeDescription = formData.get("prizeDescription") as string
        const prizeAmount = parseFloat(formData.get("prizeAmount") as string)

        const dateInput = formData.get("drawDate") as string
        // Default to now + 7 days if invalid, or parse input
        const drawDate = dateInput ? new Date(dateInput) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        console.log("Processing:", { prizeTitle, prizeAmount, drawDate })

        const ticketPrice = parseFloat(formData.get("ticketPrice") as string)
        const drawId = formData.get("drawId") as string

        // Handle Image Upload
        const file = formData.get("prizeImageFile") as File
        let prizeImagePath = formData.get("currentPrizeImage") as string

        if (file && file.size > 0) {
            // Upload to Firebase
            const filename = `prizes/${Date.now()}-${file.name.replace(/\s/g, '-')}`
            try {
                prizeImagePath = await uploadFile(file, filename)
            } catch (error) {
                console.error("Upload failed, keeping old image", error)
            }
        } else if (JSON.stringify(file) === '{}' || !file) {
            const urlInput = formData.get("prizeImageUrl") as string
            if (urlInput) prizeImagePath = urlInput
        }

        if (!drawId) {
            console.log("Creating NEW draw...")
            await prisma.draw.create({
                data: {
                    date: drawDate,
                    status: "OPEN",
                    prizeTitle,
                    prizeDescription,
                    prizeAmount,
                    prizeImage: prizeImagePath,
                    ticketPrice: ticketPrice || 2.0,
                    winningNumber: null
                }
            })
            console.log("Draw created successfully")
        } else {
            console.log("Updating EXISTING draw:", drawId)
            await prisma.draw.update({
                where: { id: drawId },
                data: {
                    date: drawDate,
                    prizeTitle,
                    prizeDescription,
                    prizeAmount,
                    prizeImage: prizeImagePath,
                    ticketPrice: ticketPrice || 2.0
                }
            })
            console.log("Draw updated successfully")
        }

        revalidatePath("/")
        revalidatePath("/admin/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Error updating draw config:", error)
        return { success: false, error: error instanceof Error ? error.message : "Error desconocido al guardar" }
    }
}

export async function finalizeDraw(formData: FormData) {
    try {
        const drawId = formData.get("drawId") as string
        const winningNumber = formData.get("winningNumber") as string

        if (!winningNumber || winningNumber.length !== 4) {
            return { success: false, error: "El número debe tener 4 dígitos" }
        }

        // 1. Update Draw Status
        await prisma.draw.update({
            where: { id: drawId },
            data: {
                status: "CLOSED",
                winningNumber: winningNumber
            }
        })

        revalidatePath("/")
        revalidatePath("/admin/dashboard")
        return { success: true }

    } catch (error) {
        console.error("Finalize Draw Error:", error)
        return { success: false, error: "Failed" }
    }
}

export async function searchTicket(ticketNumber: string) {
    try {
        if (!ticketNumber) return { success: false, error: "Ingrese un número" };

        const latestDraw = await prisma.draw.findFirst({
            orderBy: { date: 'desc' },
            select: { id: true, status: true }
        });

        if (!latestDraw) return { success: false, error: "No hay sorteos activos" };

        const ticket = await prisma.ticket.findFirst({
            where: {
                number: ticketNumber,
                drawId: latestDraw.id
            },
            include: {
                user: {
                    select: {
                        name: true,
                        lastName: true,
                        phone: true,
                        email: true,
                        identification: true
                    }
                }
            }
        });

        if (!ticket) {
            return { success: true, status: "AVAILABLE", message: "Ticket No Vendido / Disponible" };
        }

        if (ticket.status === "SOLD" || ticket.userId) {
            return {
                success: true,
                status: "SOLD",
                user: ticket.user,
                purchaseDate: ticket.updatedAt
            };
        }

        return { success: true, status: "AVAILABLE", message: "Ticket Disponible" };

    } catch (error) {
        console.error("Search Ticket Error:", error);
        return { success: false, error: "Error al buscar ticket" };
    }
}

export async function getLastWinner() {
    try {
        const lastClosedDraw = await prisma.draw.findFirst({
            where: { status: "CLOSED" },
            orderBy: { date: 'desc' },
        })

        if (!lastClosedDraw || !lastClosedDraw.winningNumber) {
            return null
        }

        const winningTicket = await prisma.ticket.findFirst({
            where: {
                drawId: lastClosedDraw.id,
                number: lastClosedDraw.winningNumber
            },
            include: {
                user: {
                    select: {
                        name: true,
                        lastName: true,
                    }
                }
            }
        })

        if (!winningTicket || !winningTicket.user) {
            return {
                number: lastClosedDraw.winningNumber,
                prize: lastClosedDraw.prizeAmount,
                date: lastClosedDraw.date,
                hasWinner: false
            }
        }

        return {
            number: lastClosedDraw.winningNumber,
            prize: lastClosedDraw.prizeAmount,
            date: lastClosedDraw.date,
            hasWinner: true,
            winnerName: winningTicket.user.name || "Usuario",
            winnerInitial: winningTicket.user.lastName ? winningTicket.user.lastName[0] : "",
            ticketId: winningTicket.number
        }

    } catch (error) {
        console.error("Get Last Winner Error:", error)
        return null
    }
}

export async function getRecentSales() {
    try {
        const sales = await prisma.ticket.findMany({
            where: {
                status: "SOLD",
                user: { isNot: null }
            },
            take: 50,
            orderBy: { updatedAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                draw: { select: { date: true, prizeTitle: true } }
            }
        })
        return sales
    } catch (error) {
        console.error("Get Recent Sales Error:", error)
        return []
    }
}

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
            include: {
                _count: {
                    select: { tickets: true }
                }
            }
        })
        return users
    } catch (error) {
        console.error("Get All Users Error:", error)
        return []
    }
}

export async function getSalesSummary() {
    try {
        const salesByDraw = await prisma.ticket.groupBy({
            by: ['drawId'],
            where: {
                status: "SOLD"
            },
            _count: {
                id: true
            }
        })

        // Enrich with draw details since groupBy doesn't support relation inclusion directly in all Prisma versions in the same way, 
        // or to keep it simple we fetch draws separately or mapped.
        // Actually, let's just fetch draws and count manually or use a raw query if needed, but for small scale groupBy is fine.
        // We need the draw info (date/title) and the price to calculate total.

        const draws = await prisma.draw.findMany({
            where: {
                id: { in: salesByDraw.map(s => s.drawId).filter(id => id !== null) as string[] }
            }
        })

        const summary = salesByDraw.map(group => {
            const draw = draws.find(d => d.id === group.drawId)
            const count = group._count.id
            const total = count * (draw?.ticketPrice || 0)

            return {
                drawId: group.drawId,
                drawDate: draw?.date,
                drawTitle: draw?.prizeTitle,
                ticketCount: count,
                totalMoney: total,
                ticketPrice: draw?.ticketPrice
            }
        }).sort((a, b) => (new Date(b.drawDate as Date).getTime() - new Date(a.drawDate as Date).getTime()))

        return summary
    } catch (error) {
        console.error("Sales Summary Error:", error)
        return []
    }
}
