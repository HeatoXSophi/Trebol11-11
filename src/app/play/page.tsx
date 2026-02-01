import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { GameInterface } from "@/components/game/GameInterface"

const prisma = new PrismaClient()

async function getActiveDraw() {
    return await prisma.draw.findFirst({
        where: { status: "OPEN" },
        orderBy: { date: 'desc' }
    })
}

async function getSoldNumbers(drawId: string) {
    const tickets = await prisma.ticket.findMany({
        where: { drawId },
        select: { number: true }
    })
    return tickets.map(t => t.number)
}

export default async function PlayPage() {
    const session = await auth()

    // Protect route - Redirect to login if not authenticated
    // For prototype without full login flow yet, we might skip this or use a temporary bypass if user hasn't set up auth fully.
    // But assuming user followed instructions:
    if (!session) {
        // redirect("/api/auth/signin") // Standard NextAuth signin
    }

    const draw = await getActiveDraw()

    if (!draw) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">No hay sorteos activos.</div>
    }

    const soldNumbers = await getSoldNumbers(draw.id)

    // Get User Balance
    let balance = 0
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        balance = user?.balance || 0
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <GameInterface
                draw={draw}
                soldNumbers={soldNumbers}
                userBalance={balance}
                userEmail={session?.user?.email || "Invitado"}
            />
        </main>
    )
}
