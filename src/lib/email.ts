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

export async function sendPasswordResetEmail(email: string, token: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("Resend API Key missing. Skipping email.");
        return;
    }

    const resetLink = `https://trebol11-11.com/reset-password?token=${token}`;

    try {
        await resend.emails.send({
            from: 'Soporte Trebol <support@resend.dev>',
            to: email,
            subject: '🔑 Restablecer Contraseña',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #d4af37;">Recuperación de Cuenta</h1>
                    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón:</p>
                    
                    <a href="${resetLink}" style="display: inline-block; background-color: #d4af37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
                        Restablecer Contraseña
                    </a>

                    <p style="font-size: 12px; color: #888;">Si no solicitaste esto, ignora este mensaje. El enlace expira en 1 hora.</p>
                </div>
            `
        });
        console.log(`Reset email sent to ${email}`);
    } catch (error) {
        console.error("Failed to send reset email:", error);
    }
}
