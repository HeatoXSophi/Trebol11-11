export async function sendAdminNotification(message: string, imageUrl?: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatIds = process.env.TELEGRAM_ADMIN_CHAT_ID?.split(",") || [];

    if (!token || chatIds.length === 0) {
        console.warn("Telegram credentials not missing in .env");
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const photoUrl = `https://api.telegram.org/bot${token}/sendPhoto`;

        for (const chatId of chatIds) {
            const id = chatId.trim();
            if (!id) continue;

            if (imageUrl) {
                await fetch(photoUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: id,
                        photo: imageUrl,
                        caption: message,
                        parse_mode: "Markdown"
                    })
                });
            } else {
                await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: id,
                        text: message,
                        parse_mode: "Markdown"
                    })
                });
            }
        }
    } catch (error) {
        console.error("Error sending Telegram notification:", error);
    }
}

export async function sendInteractiveNotification(paymentId: string, amount: string, userName: string, imageUrl: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatIds = process.env.TELEGRAM_ADMIN_CHAT_ID?.split(",") || [];

    if (!token || chatIds.length === 0) return;

    const message = `💰 *Nuevo Pago Reportado*\n\n👤 *Usuario:* ${userName}\n💵 *Monto:* ${amount}\n\nRevisa el comprobante y decide:`;
    const photoUrl = `https://api.telegram.org/bot${token}/sendPhoto`;

    try {
        for (const chatId of chatIds) {
            const id = chatId.trim();
            if (!id) continue;

            await fetch(photoUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: id,
                    photo: imageUrl,
                    caption: message,
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "✅ Aprobar", callback_data: `approve:${paymentId}` },
                                { text: "❌ Rechazar", callback_data: `reject:${paymentId}` }
                            ]
                        ]
                    }
                })
            });
        }
    } catch (error) {
        console.error("Error sending interactive telegram msg:", error);
    }
}
