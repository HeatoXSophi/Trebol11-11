
import { prisma } from "./src/lib/db"

async function main() {
    const draws = await prisma.draw.findMany()
    console.log("All Draws:", JSON.stringify(draws, null, 2))

    const openDraw = await prisma.draw.findFirst({
        where: { status: "OPEN" },
        orderBy: { date: 'desc' }
    })
    console.log("Found Open Draw for buying:", openDraw)
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
