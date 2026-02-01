"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { uploadFile } from "@/lib/storage"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function createPaymentReport(formData: FormData) {
    try {
        const amount = parseFloat(formData.get("amount") as string)
        const file = formData.get("proofImage") as File

        const session = await auth()
        if (!session?.user?.email && !(session?.user as any)?.id) {
            return { success: false, error: "Usuario no autenticado" }
        }

        const userId = (session?.user as any)?.id // Assuming ID is in session (we fixed this earlier)

        let proofImagePath = ""

        if (file && file.size > 0) {
            const filename = `payments/${Date.now()}-${file.name.replace(/\s/g, '-')}`
            proofImagePath = await uploadFile(file, filename)
        }

        const payment = await prisma.payment.create({
            data: {
                amount,
                proofImage: proofImagePath,
                userId: userId,
                status: "PENDING"
            },
            include: { user: true }
        })

        // Send Telegram Notification (Fire and forget to not block UI)
        import("@/lib/telegram").then(({ sendInteractiveNotification }) => {
            const userName = payment.user.name || payment.user.email || "Usuario";
            sendInteractiveNotification(payment.id, amount.toString(), userName, proofImagePath);
        }).catch(err => console.error("Failed to load telegram lib", err));

        revalidatePath("/admin/dashboard")
        return { success: true }

    } catch (error) {
        console.error("Error creating payment:", error)
        return { success: false, error: "Error creating payment" }
    }
}
