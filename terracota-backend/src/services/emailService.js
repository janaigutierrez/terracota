const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Email confirmació reserva
    async sendBookingConfirmation(booking, client) {
        const mailOptions = {
            from: `"Terracota Granollers" <${process.env.EMAIL_USER}>`,
            to: client.email,
            subject: '🎨 Confirmació de reserva - Terracota',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D97706;">Reserva confirmada! 🎉</h2>
                    
                    <p>Hola <strong>${client.name}</strong>,</p>
                    
                    <p>Hem rebut la teva reserva a Terracota i estem encantats de rebre't!</p>
                    
                    <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>📅 Detalls de la reserva:</h3>
                        <ul>
                            <li><strong>Data:</strong> ${new Date(booking.booking_date).toLocaleDateString('ca-ES')}</li>
                            <li><strong>Hora:</strong> ${booking.booking_time}</li>
                            <li><strong>Experiència:</strong> ${booking.piece_type}</li>
                            <li><strong>Persones:</strong> ${booking.people_count}</li>
                            <li><strong>Preu total:</strong> ${booking.total_price}€</li>
                        </ul>
                    </div>
                    
                    <h3>📍 Com arribar:</h3>
                    <p>Carrer Exemple, 123<br>08400 Granollers</p>
                    
                    <h3>📋 Què has de saber:</h3>
                    <ul>
                        <li>Arriba 10 minuts abans de l'hora</li>
                        <li>La teva peça estarà llesta en 7 dies</li>
                        <li>T'enviarem un email quan estigui preparada</li>
                        <li>Pots cancel·lar fins 24h abans</li>
                    </ul>
                    
                    <p>Si tens alguna pregunta, contesta aquest email o truca'ns al 938 45 67 89.</p>
                    
                    <p>Fins aviat! 🏺<br>
                    L'equip de Terracota</p>
                </div>
            `
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email confirmació enviat:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Error enviant email confirmació:', error);
            throw error;
        }
    }

    // Email quan la peça està llesta
    async sendPieceReadyNotification(piece, client) {
        const mailOptions = {
            from: `"Terracota Granollers" <${process.env.EMAIL_USER}>`,
            to: client.email,
            subject: '🏺 La teva obra està llesta!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D97706;">La teva obra està llesta! ✨</h2>
                    
                    <p>Hola <strong>${client.name}</strong>,</p>
                    
                    <p>Tenim bones notícies! La teva ${piece.piece_type} ja ha sortit del forn i està llesta per recollir.</p>
                    
                    <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>📦 Detalls de la peça:</h3>
                        <ul>
                            <li><strong>Tipus:</strong> ${piece.piece_type}</li>
                            <li><strong>Data pintura:</strong> ${new Date(piece.painting_date).toLocaleDateString('ca-ES')}</li>
                            <li><strong>Estat:</strong> Llesta per recollir ✅</li>
                        </ul>
                    </div>
                    
                    <h3>📍 Recollida:</h3>
                    <p><strong>Horaris:</strong><br>
                    Dimarts a Dijous: 10:00 - 20:00<br>
                    Divendres: 10:00 - 21:00<br>
                    Dissabte: 9:00 - 21:00<br>
                    Diumenge: 10:00 - 19:00<br>
                    Dilluns: Tancat</p>
                    
                    <p>Carrer Exemple, 123<br>08400 Granollers</p>
                    
                    <p><strong>⚠️ Important:</strong> Les peces es guarden durant 1 mes. Passats 30 dies, es consideraran abandonades.</p>
                    
                    <p>Estem desitjant veure't i que puguis endur-te la teva creació! 🎨</p>
                    
                    <p>Fins aviat!<br>
                    L'equip de Terracota</p>
                </div>
            `
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email peça llesta enviat:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Error enviant email peça llesta:', error);
            throw error;
        }
    }

    // Recordatori 24h abans
    async sendBookingReminder(booking, client) {
        const mailOptions = {
            from: `"Terracota Granollers" <${process.env.EMAIL_USER}>`,
            to: client.email,
            subject: '⏰ Recordatori: La teva cita a Terracota és demà',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D97706;">T'esperem demà! ⏰</h2>
                    
                    <p>Hola <strong>${client.name}</strong>,</p>
                    
                    <p>Només volem recordar-te que tens una cita a Terracota <strong>demà</strong>!</p>
                    
                    <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>📅 Detalls de la cita:</h3>
                        <ul>
                            <li><strong>Data:</strong> ${new Date(booking.booking_date).toLocaleDateString('ca-ES')}</li>
                            <li><strong>Hora:</strong> ${booking.booking_time}</li>
                            <li><strong>Experiència:</strong> ${booking.piece_type}</li>
                            <li><strong>Persones:</strong> ${booking.people_count}</li>
                        </ul>
                    </div>
                    
                    <p><strong>📍 Adreça:</strong> Carrer Exemple, 123, 08400 Granollers</p>
                    
                    <p><strong>💡 Recorda:</strong> Arriba 10 minuts abans per començar puntualment!</p>
                    
                    <p>Si necessites cancel·lar o modificar la cita, contesta aquest email o truca'ns al 938 45 67 89.</p>
                    
                    <p>Fins demà! 🎨<br>
                    L'equip de Terracota</p>
                </div>
            `
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email recordatori enviat:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Error enviant recordatori:', error);
            throw error;
        }
    }

    // Email resposta a contacte
    async sendContactReply(contactMessage, replyText) {
        const mailOptions = {
            from: `"Terracota Granollers" <${process.env.EMAIL_USER}>`,
            to: contactMessage.email,
            subject: `Re: ${contactMessage.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D97706;">Resposta a la teva consulta</h2>
                    
                    <p>Hola <strong>${contactMessage.name}</strong>,</p>
                    
                    <p>Gràcies per contactar amb nosaltres. Aquí tens la nostra resposta:</p>
                    
                    <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        ${replyText}
                    </div>
                    
                    <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D97706;">
                        <p><strong>El teu missatge original:</strong></p>
                        <p style="font-style: italic; color: #6B7280;">${contactMessage.message}</p>
                    </div>
                    
                    <p>Si tens més preguntes, no dubtis en contactar-nos!</p>
                    
                    <p>Salutacions,<br>
                    L'equip de Terracota</p>
                </div>
            `
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email resposta contacte enviat:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Error enviant resposta contacte:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();