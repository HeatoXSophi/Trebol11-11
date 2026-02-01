const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();
const TOKEN = "8501044175:AAGPjkTCQtmQZJSVKdTDVL9Ced3GCZP27yM";
let lastUpdateId = 0;

console.log("🤖 Telegram Listener ACTIVO. Esperando clics...");

function getUpdates() {
    const url = `https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`;

    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', async () => {
            try {
                const response = JSON.parse(data);
                if (response.ok && response.result.length > 0) {
                    for (const update of response.result) {
                        lastUpdateId = update.update_id;
                        if (update.callback_query) {
                            await handleCallback(update.callback_query);
                        }
                    }
                }
            } catch (e) {
                console.error("Error parsing update:", e.message);
            }
            // Poll again immediately
            getUpdates();
        });
    }).on('error', (e) => {
        console.error("Network error:", e.message);
        setTimeout(getUpdates, 5000); // Retry after 5s
    });
}

async function handleCallback(query) {
    const data = query.data; // "approve:ID"
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const [action, paymentId] = data.split(":");

    console.log(`Clic detectado: ${action} para pago ${paymentId}`);

    try {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { user: true }
        });

        if (!payment) {
            await answerCallback(query.id, "Pago no encontrado");
            return;
        }

        if (payment.status !== "PENDING") {
            await answerCallback(query.id, `Ya estaba ${payment.status}`);
            await editMessageCaption(chatId, messageId, `⚠️ Este pago ya fue PROCESADO (${payment.status})`);
            return;
        }

        if (action === "approve") {
            await prisma.payment.update({ where: { id: paymentId }, data: { status: "APPROVED" } });
            await prisma.user.update({ where: { id: payment.userId }, data: { balance: { increment: payment.amount } } });

            await editMessageCaption(chatId, messageId, `✅ *APROBADO*\nUsuario: ${payment.user.name || payment.user.email}\nMonto: $${payment.amount}`);
            await answerCallback(query.id, "✅ Aprobado y saldo cargado.");
            console.log("Pago Aprobado Localmente");

        } else if (action === "reject") {
            await prisma.payment.update({ where: { id: paymentId }, data: { status: "REJECTED" } });

            await editMessageCaption(chatId, messageId, `❌ *RECHAZADO*\nUsuario: ${payment.user.name || payment.user.email}`);
            await answerCallback(query.id, "❌ Rechazado.");
            console.log("Pago Rechazado Localmente");
        }

    } catch (error) {
        console.error("Error processing callback:", error);
    }
}

async function answerCallback(callbackQueryId, text) {
    post(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
        callback_query_id: callbackQueryId,
        text: text
    });
}

async function editMessageCaption(chatId, messageId, text) {
    post(`https://api.telegram.org/bot${TOKEN}/editMessageCaption`, {
        chat_id: chatId,
        message_id: messageId,
        caption: text,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: [] }
    });
}

function post(url, body) {
    const req = https.request(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    req.write(JSON.stringify(body));
    req.end();
}

// Start polling
getUpdates();
