import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // 1. Check Env Vars
        const envCheck = {
            hasPostgresUrl: !!process.env.POSTGRES_PRISMA_URL,
            hasCloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
            nodeEnv: process.env.NODE_ENV
        }

        // 2. Check Database Connection
        let dbStatus = "Unknown"
        let userCount = -1
        try {
            userCount = await prisma.user.count()
            dbStatus = "Connected"
        } catch (e) {
            dbStatus = "Error: " + (e instanceof Error ? e.message : String(e))
        }

        return NextResponse.json({
            status: dbStatus === "Connected" ? "OK" : "ERROR",
            database: {
                status: dbStatus,
                userCount
            },
            environment: envCheck,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        return NextResponse.json({
            status: "CRITICAL_ERROR",
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
