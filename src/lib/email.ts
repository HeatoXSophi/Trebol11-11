import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketEmail(userEmail: string, userName: string, tickets: any[]) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("Resend API Key missing. Skipping email.");
        return;
    }

    try {
        const ticketListHtml = tickets.map(t => `
            <div style="border: 1px solid #d4af37; padding: 10px; margin-bottom: 10px; border-radius: 8px; background-color: #fcfcfc;">
                <div style="font-size: 24px; font-weight: bold; color: #000;">#${t.number}</div>
                <div style="font-size: 12px; color: #666;">Serial: ${t.serialCode}</div>
            </div>
        `).join('');

        await resend.emails.send({
            from: 'Lotería Transparente <onboarding@resend.dev>', // Use verified domain in prod
            to: userEmail,
            subject: '🎟️ Tus Tickets Dorados - Trebol 11-11',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #d4af37;">¡Felicidades, ${userName}!</h1>
                    <p>Has asegurado tus tickets para el próximo sorteo.</p>
                    <p>Aquí tienes tus números de la suerte:</p>
                    
                    <div style="margin-top: 20px;">
                        ${ticketListHtml}
                    </div>

                    <p style="margin-top: 30px; font-size: 12px; color: #888;">
                        Guarda este correo como comprobante. Buena suerte.
                    </p>
                </div>
            `
        });
        console.log(`Email sent to ${userEmail}`);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}
