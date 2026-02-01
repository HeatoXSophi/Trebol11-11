
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Listing ALL users...")
    const users = await prisma.user.findMany()

    if (users.length === 0) {
        console.log("No users found in DB.")
    } else {
        users.forEach(u => {
            console.log(`------------------------------------------------`)
            console.log(`ID: ${u.id}`)
            console.log(`Name: ${u.name} ${u.lastName}`)
            console.log(`Email: ${u.email}`)
            console.log(`Identification (Cédula): ${u.identification}`)
            console.log(`Phone: ${u.phone}`)
        })
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
