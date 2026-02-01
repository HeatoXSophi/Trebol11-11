"use server"

import { prisma } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

export async function forgotPassword(formData: FormData) {
    const email = formData.get("email") as string

    if (!email) return { error: "Ingrese su correo electrónico" }

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return { success: true } // Don't reveal user existence

        const token = uuidv4()
        const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 Hour

        // Upsert token
        await prisma.verificationToken.upsert({
            where: {
                identifier_token: {
                    identifier: email,
                    token: token // This part of composite key is tricky for upsert if token changes
                }
            },
            // Better to delete old tokens first
            update: {},
            create: {
                identifier: email,
                token,
                expires
            }
        }).catch(async () => {
            // Fallback: Delete existing and create new
            await prisma.verificationToken.deleteMany({ where: { identifier: email } })
            await prisma.verificationToken.create({
                data: { identifier: email, token, expires }
            })
        })

        await sendPasswordResetEmail(email, token)
        return { success: true }

    } catch (error) {
        console.error("Forgot password error:", error)
        return { error: "Error al procesar solicitud" }
    }
}

export async function resetPassword(token: string, formData: FormData) {
    const password = formData.get("password") as string

    if (!token) return { error: "Token inválido" }
    if (!password || password.length < 6) return { error: "Contraseña debe tener al menos 6 caracteres" }

    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: { token }
        })

        if (!verificationToken) return { error: "Token inválido o expirado" }

        const hasExpired = new Date() > verificationToken.expires
        if (hasExpired) return { error: "El token ha expirado" }

        const hashedPassword = await bcrypt.hash(password, 10)

        // Update User Password
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { password: hashedPassword }
        })

        // Delete Token
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: verificationToken.identifier,
                    token: verificationToken.token
                }
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Reset password error:", error)
        return { error: "Error al restablecer contraseña" }
    }
}
