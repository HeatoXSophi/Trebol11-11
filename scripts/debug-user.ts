
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const email = "pablogonzalez1515@gmail.com"
    console.log(`Checking for user: ${email}`)

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { identification: email } // In case they somehow saved email as ID
            ]
        }
    })

    if (user) {
        console.log("User Found:")
        console.log("ID:", user.id)
        console.log("Name:", user.name)
        console.log("Email:", user.email)
        console.log("Identification:", user.identification)
        console.log("Has Password:", !!user.password)
        console.log("Password Hash Start:", user.password ? user.password.substring(0, 10) : "null")
    } else {
        console.log("User NOT FOUND in database.")
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
