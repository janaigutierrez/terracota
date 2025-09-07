const { supabase } = require('../config/supabase');
const { validationResult } = require('express-validator');

const bookingController = {
    // Crear nova reserva (des del frontend)
    async createBooking(req, res, next) {
        try {
            console.log('📅 Nova reserva rebuda:', req.body);

            // Validar dades d'entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation Error',
                    details: errors.array()
                });
            }

            const {
                name,
                email,
                phone,
                selectedOption,
                date,
                time,
                people,
                message,
                totalPrice
            } = req.body;

            // 1. Crear o trobar client
            let client;
            const { data: existingClient } = await supabase
                .from('clients')
                .select('*')
                .eq('email', email)
                .single();

            if (existingClient) {
                client = existingClient;
                // Actualitzar dades si han canviat
                const { data: updatedClient } = await supabase
                    .from('clients')
                    .update({ name, phone })
                    .eq('id', existingClient.id)
                    .select()
                    .single();
                client = updatedClient || existingClient;
            } else {
                // Crear nou client
                const { data: newClient, error: clientError } = await supabase
                    .from('clients')
                    .insert([{ name, email, phone }])
                    .select()
                    .single();

                if (clientError) {
                    console.error('Error creant client:', clientError);
                    throw clientError;
                }
                client = newClient;
            }

            console.log('👤 Client:', client);

            // 2. Crear reserva
            const { data: booking, error: bookingError } = await supabase
                .from('bookings')
                .insert([{
                    client_id: client.id,
                    booking_date: date,
                    booking_time: time,
                    people_count: people,
                    piece_type: selectedOption,
                    total_price: totalPrice,
                    notes: message || null,
                    status: 'pending'
                }])
                .select(`
          *,
          clients (*)
        `)
                .single();

            if (bookingError) {
                console.error('Error creant reserva:', bookingError);
                throw bookingError;
            }

            console.log('📅 Reserva creada:', booking);

            // 3. Crear entrada a taula pieces
            const { error: pieceError } = await supabase
                .from('pieces')
                .insert([{
                    booking_id: booking.id,
                    status: 'painting'
                }]);

            if (pieceError) {
                console.error('Error creant peça:', pieceError);
                // No fallem per això, seguim endavant
            }

            res.status(201).json({
                success: true,
                message: 'Reserva creada correctament! 🎉',
                booking: {
                    id: booking.id,
                    date: booking.booking_date,
                    time: booking.booking_time,
                    piece_type: booking.piece_type,
                    people: booking.people_count,
                    total_price: booking.total_price,
                    status: booking.status,
                    client: booking.clients
                }
            });

        } catch (error) {
            console.error('❌ Error creant reserva:', error);
            next(error);
        }
    },

    // Llistar reserves (per admin)
    async getBookings(req, res, next) {
        try {
            const {
                status = 'all',
                date,
                limit = 50,
                offset = 0
            } = req.query;

            let query = supabase
                .from('bookings')
                .select(`
          *,
          clients (*),
          pieces (*)
        `)
                .order('booking_date', { ascending: true })
                .range(offset, offset + limit - 1);

            // Filtrar per status
            if (status !== 'all') {
                query = query.eq('status', status);
            }

            // Filtrar per data
            if (date) {
                query = query.eq('booking_date', date);
            }

            const { data: bookings, error } = await query;
            if (error) throw error;

            res.json({
                success: true,
                bookings,
                total: bookings.length,
                hasMore: bookings.length === parseInt(limit)
            });

        } catch (error) {
            console.error('❌ Error obtenint reserves:', error);
            next(error);
        }
    },

    // Obtenir reserva per ID
    async getBookingById(req, res, next) {
        try {
            const { id } = req.params;

            const { data: booking, error } = await supabase
                .from('bookings')
                .select(`
          *,
          clients (*),
          pieces (*)
        `)
                .eq('id', id)
                .single();

            if (error) throw error;

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    error: 'Reserva no trobada'
                });
            }

            res.json({
                success: true,
                booking
            });

        } catch (error) {
            console.error('❌ Error obtenint reserva:', error);
            next(error);
        }
    },

    // Actualitzar status reserva
    async updateBookingStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Status no vàlid',
                    validStatuses
                });
            }

            const { data: booking, error } = await supabase
                .from('bookings')
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            res.json({
                success: true,
                message: 'Status actualitzat correctament',
                booking
            });

        } catch (error) {
            console.error('❌ Error actualitzant status:', error);
            next(error);
        }
    }
};

module.exports = bookingController;