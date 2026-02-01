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

    if (!token || chatIds.length === 0) return [];

    const message = `💰 *Nuevo Pago Reportado*\n\n👤 *Usuario:* ${userName}\n💵 *Monto:* ${amount}\n\nRevisa el comprobante y decide:`;
    const photoUrl = `https://api.telegram.org/bot${token}/sendPhoto`;

    const sentMessages = [];

    try {
        for (const chatId of chatIds) {
            const id = chatId.trim();
            if (!id) continue;

            const res = await fetch(photoUrl, {
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
            const data = await res.json();
            if (data.ok && data.result) {
                sentMessages.push({ chatId: id, messageId: data.result.message_id });
            }
        }
    } catch (error) {
        console.error("Error sending interactive telegram msg:", error);
    }
    return sentMessages;
}

export async function updatePaymentStatusMessage(chatId: string, messageId: number, status: "APPROVED" | "REJECTED", adminName: string = "Admin") {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return;

    const url = `https://api.telegram.org/bot${token}/editMessageCaption`;

    // Status Text
    const statusIcon = status === "APPROVED" ? "✅" : "❌";
    const statusText = status === "APPROVED" ? "Aprobado" : "Rechazado";
    const color = status === "APPROVED" ? "VERDE" : "ROJO"; // Telegram markdown doesn't support color validation easily, just icons.

    const newCaption = `💰 *Pago Procesado*\n\nEstado: ${statusIcon} *${statusText}*\nAtendido por: ${adminName}`;

    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                caption: newCaption,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [] // Remove buttons
                }
            })
        });
    } catch (error) {
        console.error("Error updating telegram message:", error);
    }
}
