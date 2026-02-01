const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        const draw = await prisma.draw.findFirst({
            orderBy: { date: 'desc' }
        })

        if (draw) {
            console.log('Found draw:', draw.id, draw.prizeTitle)
            await prisma.draw.update({
                where: { id: draw.id },
                data: { prizeImage: '/prize-banner.png' }
            })
            console.log('Successfully updated prizeImage to /prize-banner.png')
        } else {
            console.log('No draw found to update.')
        }
    } catch (error) {
        console.error('Error updating draw:', error)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
