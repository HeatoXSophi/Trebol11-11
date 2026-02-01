
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("--- DEBUGGING DATABASE ---")

    // 1. Check Draws
    const draws = await prisma.draw.findMany()
    console.log(`Found ${draws.length} draws:`)
    draws.forEach(d => console.log(` - ID: ${d.id}, Status: ${d.status}, Date: ${d.date}`))

    // 2. Check Specific Ticket 7324
    for (const draw of draws) {
        if (draw.status === 'OPEN') {
            console.log(`\nChecking OPEN Draw: ${draw.id}`)
            const ticket = await prisma.ticket.findFirst({
                where: { drawId: draw.id, number: "7324" },
                include: {
                    user: {
                        include: {
                            payments: {
                                take: 1,
                                orderBy: { createdAt: 'desc' }
                            }
                        }
                    }
                }
            })

            if (ticket) {
                console.log("FOUND TICKET 7324:")
                console.dir(ticket, { depth: null })
            } else {
                console.log("Ticket 7324 not found in this draw.")
            }
        }
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
