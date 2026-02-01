import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params
    const body = await req.json()
    const { status, adminComment } = body

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    // Transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id },
        include: { user: true }
      })

      if (!payment) {
        throw new Error("Pago no encontrado")
      }

      if (payment.status !== "PENDING") {
        throw new Error("El pago ya fue procesado")
      }

      // Update Payment
      const updatedPayment = await tx.payment.update({
        where: { id },
        data: {
          status,
          adminComment
        }
      })

      // If Approved, add balance to user
      if (status === "APPROVED") {
        await tx.user.update({
          where: { id: payment.userId },
          data: {
            balance: {
              increment: payment.amount
            }
          }
        })
      }

      return updatedPayment
    })

    return NextResponse.json({ success: true, payment: result })

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al procesar" },
      { status: 500 }
    )
  }
}
