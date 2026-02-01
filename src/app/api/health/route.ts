import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // 1. Check Env Vars with specific details
        const envCheck = {
            DATABASE_URL: !!process.env.POSTGRES_PRISMA_URL ? "OK" : "MISSING",
            CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME ? "OK" : "MISSING",
            CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
            CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING",
            TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN ? "OK" : "MISSING",
            TELEGRAM_CHAT_ID: !!process.env.TELEGRAM_ADMIN_CHAT_ID ? "OK" : "MISSING",
            NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET ? "OK" : "MISSING",
            NEXTAUTH_URL: !!process.env.NEXTAUTH_URL ? "OK" : "MISSING",
            NODE_ENV: process.env.NODE_ENV
        }

        // 2. Check Database Connection
        let dbStatus = "Unknown"
        let userCount = -1
        let adminExists = false
        try {
            userCount = await prisma.user.count()
            const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
            adminExists = !!admin
            dbStatus = "Connected"
        } catch (e) {
            dbStatus = "Error: " + (e instanceof Error ? e.message : String(e))
        }

        return NextResponse.json({
            system_status: dbStatus === "Connected" ? "ONLINE" : "OFFLINE",
            timestamp: new Date().toISOString(),
            database: {
                connection: dbStatus,
                users_registered: userCount,
                admin_account_exists: adminExists
            },
            environment_variables: envCheck
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            status: "CRITICAL_ERROR",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
