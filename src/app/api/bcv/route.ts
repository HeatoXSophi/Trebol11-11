import { NextResponse } from 'next/server'
import { getBCVRate } from '@/lib/bcv'

export async function GET() {
    try {
        const rate = await getBCVRate()
        return NextResponse.json({ rate })
    } catch (error) {
        return NextResponse.json({ rate: 45.00 }, { status: 200 }) // Fallback safe
    }
}
