import { NextResponse } from "next/server";

export async function GET() {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            return NextResponse.json({
                status: "ERROR",
                message: "TELEGRAM_BOT_TOKEN is missing in environment variables."
            }, { status: 500 });
        }

        // Check Webhook Status
        const url = `https://api.telegram.org/bot${token}/getWebhookInfo`;
        const res = await fetch(url);
        const webhookInfo = await res.json();

        return NextResponse.json({
            status: "OK",
            token_prefix: token.substring(0, 5) + "...",
            webhook_info: webhookInfo
        });

    } catch (error) {
        return NextResponse.json({
            status: "EXCEPTION",
            error: String(error)
        }, { status: 500 });
    }
}
