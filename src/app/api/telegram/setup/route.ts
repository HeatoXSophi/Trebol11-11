import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            return NextResponse.json({ error: "No Token" }, { status: 400 });
        }

        // Get the host from the request to build the webhook URL dynamically
        const host = req.headers.get("host");
        const protocol = host?.includes("localhost") ? "http" : "https";
        const webhookUrl = `${protocol}://${host}/api/telegram/webhook`;

        const url = `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`;

        const res = await fetch(url);
        const data = await res.json();

        return NextResponse.json({
            webhookUrl,
            telegramResponse: data
        });

    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
