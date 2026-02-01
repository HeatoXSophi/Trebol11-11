"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function getPendingPayments() {
    try {
        const payments = await prisma.payment.findMany({
            where: { status: "PENDING" },
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        })
        return payments
    } catch (error) {
        console.error("Error fetching payments:", error)
        return []
    }
}

export async function approvePayment(paymentId: string) {
    try {
        // 1. Update payment status
        const payment = await prisma.payment.update({
            where: { id: paymentId },
            data: { status: "APPROVED" },
            include: { user: true }
        })

        // 2. Add balance to user
        await prisma.user.update({
            where: { id: payment.userId },
            data: {
                balance: { increment: payment.amount }
            }
        })

        revalidatePath("/admin/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Error approving payment:", error)
        return { success: false, error: "Failed to approve" }
    }
}

export async function rejectPayment(paymentId: string) {
    try {
        await prisma.payment.update({
            where: { id: paymentId },
            data: { status: "REJECTED" }
        })

        revalidatePath("/admin/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Error rejecting payment:", error)
        return { success: false, error: "Failed to reject" }
    }
}
