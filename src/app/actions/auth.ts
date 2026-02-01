"use server"

import { signIn } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function register(prevState: string | undefined, formData: FormData) {
    try {
        const name = formData.get("name") as string
        const lastName = formData.get("lastName") as string
        const email = formData.get("email") as string
        const identification = formData.get("identification") as string
        const phone = formData.get("phone") as string
        const password = formData.get("password") as string

        if (!name || !lastName || !email || !identification || !phone || !password) {
            return "Todos los campos son requeridos."
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // 1. Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { identification },
                    { email },
                    { phone }
                ]
            }
        })

        if (existingUser) {
            // Migration: If user exists but has NO password (from Google or previous dev), update it.
            if (!existingUser.password) {
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        name: name || existingUser.name,
                        lastName: lastName || existingUser.lastName,
                        password: hashedPassword,
                        identification: identification, // OVERWRITE Google ID with Real ID
                        phone: phone || existingUser.phone,
                        email: email || existingUser.email // Ensure email is consistent
                    }
                })

                // Auto Login after update
                await signIn("credentials", {
                    identification,
                    password,
                    redirectTo: "/profile"
                })
                return
            }

            return "El usuario ya existe (Cédula, correo o teléfono duplicado)."
        }

        // 2. Create User
        await prisma.user.create({
            data: {
                name,
                lastName,
                email,
                identification,
                phone,
                password: hashedPassword,
                role: "USER"
            }
        })

        // 3. Auto Login
        await signIn("credentials", {
            identification,
            phone,
            redirectTo: "/profile"
        })

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Credenciales inválidas."
                default:
                    return "Algo salió mal."
            }
        }
        if ((error as Error).message === "NEXT_REDIRECT") {
            throw error
        }
        console.error("Auth error:", error)
        return "Error creando cuenta."
    }
}

export async function login(prevState: string | undefined, formData: FormData) {
    try {
        const identification = formData.get("identification") as string
        const password = formData.get("password") as string

        if (!identification || !password) {
            return "Ingrese cédula y contraseña."
        }

        await signIn("credentials", {
            identification,
            password,
            redirectTo: "/profile"
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Cédula o contraseña incorrectos."
                default:
                    return "Error de autenticación."
            }
        }
        // IMPORTANT: Rethrow everything else (including redirects)
        throw error
    }
}
