import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db"
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// This handle responds to Telegram Webhook updates (like button clicks)
// Note: In production you should verify the secret token in headers
export async function POST(req: NextRequest) {
    try {
        const update = await req.json();

        // Handle Callback Query (Button Click)
        if (update.callback_query) {
            const query = update.callback_query;
            const data = query.data; // e.g., "approve:payment_id"
            const chatId = query.message.chat.id;
            const messageId = query.message.message_id;

            const [action, paymentId] = data.split(":");

            if (!paymentId) {
                return NextResponse.json({ ok: true });
            }

            // Find Payment
            const payment = await prisma.payment.findUnique({
                where: { id: paymentId },
                include: { user: true }
            });

            if (!payment) {
                await answerCallback(query.id, "Pago no encontrado");
                return NextResponse.json({ ok: true });
            }

            if (payment.status !== "PENDING") {
                await answerCallback(query.id, "Este pago ya fue procesado");
                // Update message to reflect status
                await editMessageCaption(chatId, messageId, `⚠️ Este pago ya está ${payment.status === 'APPROVED' ? 'APROBADO' : 'RECHAZADO'}`);
                return NextResponse.json({ ok: true });
            }

            if (action === "approve") {
                // APPROVE LOGIC
                // 1. Update Payment Status
                await prisma.payment.update({
                    where: { id: paymentId },
                    data: { status: "APPROVED" }
                });

                // 2. Add Balance to User
                await prisma.user.update({
                    where: { id: payment.userId },
                    data: { balance: { increment: payment.amount } }
                });

                // 3. Feedback to Admin
                await editMessageCaption(chatId, messageId, `✅ *PAGO APROBADO*\n\nUsuario: ${payment.user.name || payment.user.email}\nMonto: $${payment.amount}\nSaldo actualizado.`);
                await answerCallback(query.id, "Pago aprobado correctamente");

            } else if (action === "reject") {
                // REJECT LOGIC
                await prisma.payment.update({
                    where: { id: paymentId },
                    data: { status: "REJECTED" }
                });

                await editMessageCaption(chatId, messageId, `❌ *PAGO RECHAZADO*\n\nUsuario: ${payment.user.name || payment.user.email}\nMonto: $${payment.amount}`);
                await answerCallback(query.id, "Pago rechazado");
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Telegram Webhook Error:", error);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

async function answerCallback(callbackQueryId: string, text: string) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            callback_query_id: callbackQueryId,
            text: text
        })
    });
}

async function editMessageCaption(chatId: number, messageId: number, text: string) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageCaption`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            caption: text,
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [] } // Remove buttons
        })
    });
}
