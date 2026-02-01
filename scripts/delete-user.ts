
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const userId = "cml1mtiaw0000rqgs0w7l95ue"
    console.log(`Deleting user with ID: ${userId}...`)

    try {
        const deleted = await prisma.user.delete({
            where: { id: userId }
        })
        console.log("User DELETED successfully:", deleted.email || deleted.identification)
    } catch (e) {
        console.error("Error deleting user (maybe already deleted):", e)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
