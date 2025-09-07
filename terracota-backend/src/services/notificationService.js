const emailService = require('./emailService');
const { supabase } = require('../config/supabase');

class NotificationService {

    // Enviar notificació de reserva confirmada
    async sendBookingConfirmation(bookingId) {
        try {
            // Obtenir dades de la reserva
            const { data: booking, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    clients (*)
                `)
                .eq('id', bookingId)
                .single();

            if (error) throw error;

            // Enviar email
            await emailService.sendBookingConfirmation(booking, booking.clients);

            // Marcar com enviat
            await supabase
                .from('bookings')
                .update({ confirmation_sent: true })
                .eq('id', bookingId);

            console.log('✅ Confirmació enviada per reserva:', bookingId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error enviant confirmació:', error);
            throw error;
        }
    }

    // Enviar notificació quan peça està llesta
    async sendPieceReadyNotification(pieceId) {
        try {
            // Obtenir dades de la peça
            const { data: piece, error } = await supabase
                .from('pieces')
                .select(`
                    *,
                    clients (*),
                    bookings (*)
                `)
                .eq('id', pieceId)
                .single();

            if (error) throw error;

            // Enviar email
            await emailService.sendPieceReadyNotification(piece, piece.clients);

            // Marcar com enviat
            await supabase
                .from('pieces')
                .update({ notification_sent: true })
                .eq('id', pieceId);

            console.log('✅ Notificació peça llesta enviada:', pieceId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error enviant notificació peça llesta:', error);
            throw error;
        }
    }

    // Enviar recordatoris automàtics
    async sendDailyReminders() {
        try {
            // Obtenir reserves per demà que no tenen recordatori enviat
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            const { data: bookings, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    clients (*)
                `)
                .eq('booking_date', tomorrowStr)
                .eq('reminder_sent', false)
                .in('status', ['pending', 'confirmed']);

            if (error) throw error;

            console.log(`📅 Enviant ${bookings.length} recordatoris per demà`);

            // Enviar recordatoris
            for (const booking of bookings) {
                try {
                    await emailService.sendBookingReminder(booking, booking.clients);

                    // Marcar com enviat
                    await supabase
                        .from('bookings')
                        .update({ reminder_sent: true })
                        .eq('id', booking.id);

                    console.log(`✅ Recordatori enviat: ${booking.id}`);
                } catch (error) {
                    console.error(`❌ Error recordatori ${booking.id}:`, error);
                }
            }

            return { success: true, sent: bookings.length };

        } catch (error) {
            console.error('❌ Error enviant recordatoris diaris:', error);
            throw error;
        }
    }

    // Respondere a missatge de contacte
    async replyToContact(contactMessageId, replyText, repliedBy) {
        try {
            // Obtenir missatge original
            const { data: contactMessage, error } = await supabase
                .from('contact_messages')
                .select('*')
                .eq('id', contactMessageId)
                .single();

            if (error) throw error;

            // Enviar resposta
            await emailService.sendContactReply(contactMessage, replyText);

            // Actualitzar estat del missatge
            await supabase
                .from('contact_messages')
                .update({
                    status: 'replied',
                    replied_at: new Date().toISOString(),
                    replied_by: repliedBy,
                    reply_message: replyText
                })
                .eq('id', contactMessageId);

            console.log('✅ Resposta contacte enviada:', contactMessageId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error enviant resposta contacte:', error);
            throw error;
        }
    }
}

module.exports = new NotificationService();