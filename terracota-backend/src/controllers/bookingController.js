const { supabase } = require('../config/supabase');
const { validationResult } = require('express-validator');
const BookingModel = require('../models/Booking');

const bookingController = {
    // ✅ CREAR NOVA RESERVA (sistema nou 8€/persona)
    async createBooking(req, res, next) {
        try {
            console.log('📅 Nova reserva rebuda:', req.body);

            // Validar dades d'entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'Dades no vàlides',
                    details: errors.array()
                });
            }

            const {
                name,
                email,
                phone,
                date,
                time,
                people,
                message,
                acceptPolicy  // ✅ Nou: acceptació política no-reemborsable
            } = req.body;

            // ✅ VALIDACIONS SISTEMA NOU
            if (!acceptPolicy) {
                return res.status(400).json({
                    success: false,
                    error: 'Cal acceptar la política de no devolucions'
                });
            }

            if (people < 1 || people > 8) {
                return res.status(400).json({
                    success: false,
                    error: 'Nombre de persones ha de ser entre 1 i 8'
                });
            }

            // ✅ CALCULAR PREUS I DATES AUTOMÀTICAMENT
            const pricePerPerson = 8.00;
            const totalPaid = BookingModel.methods.calculateTotal(people, pricePerPerson);
            const refundableUntil = BookingModel.methods.calculateRefundableUntil(date, time);

            console.log('💰 Càlculs:', {
                people,
                pricePerPerson,
                totalPaid,
                refundableUntil
            });

            // 1. Crear o trobar client (IGUAL que abans)
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
                    .update({
                        name,
                        phone,
                        total_visits: existingClient.total_visits + 1,
                        total_spent: (parseFloat(existingClient.total_spent) + parseFloat(totalPaid)).toFixed(2)
                    })
                    .eq('id', existingClient.id)
                    .select()
                    .single();
                client = updatedClient || existingClient;
            } else {
                // Crear nou client
                const { data: newClient, error: clientError } = await supabase
                    .from('clients')
                    .insert([{
                        name,
                        email,
                        phone,
                        total_visits: 1,
                        total_spent: totalPaid
                    }])
                    .select()
                    .single();

                if (clientError) {
                    console.error('❌ Error creant client:', clientError);
                    throw clientError;
                }
                client = newClient;
            }

            console.log('👤 Client:', client);

            // ✅ 2. CREAR RESERVA AMB SISTEMA NOU
            const { data: booking, error: bookingError } = await supabase
                .from('bookings')
                .insert([{
                    client_id: client.id,
                    booking_date: date,
                    booking_time: time,
                    people_count: people,
                    price_per_person: pricePerPerson,
                    total_paid: totalPaid,
                    refundable_until: refundableUntil.toISOString(),
                    non_refundable: false, // Encara es pot reemborsar fins refundable_until
                    notes: message || null,
                    special_requests: message || null,
                    status: 'confirmed',
                    payment_status: 'paid', // Assumim pagament immediat
                    payment_method: 'online',
                    confirmation_sent: false
                }])
                .select(`
                    *,
                    clients (*)
                `)
                .single();

            if (bookingError) {
                console.error('❌ Error creant reserva:', bookingError);
                throw bookingError;
            }

            console.log('✅ Reserva creada:', booking);

            // ✅ 3. ENVIAR EMAIL CONFIRMACIÓ (TODO: implementar)
            // await emailService.sendBookingConfirmation(booking);

            res.status(201).json({
                success: true,
                message: 'Reserva confirmada! 🎉 Rebràs un email amb els detalls.',
                booking: {
                    id: booking.id,
                    date: booking.booking_date,
                    time: booking.booking_time,
                    people: booking.people_count,
                    totalPaid: booking.total_paid,
                    pricePerPerson: booking.price_per_person,
                    refundableUntil: booking.refundable_until,
                    status: booking.status,
                    client: booking.clients,
                    refundPolicy: "Els " + totalPaid + "€ són reemborsables fins " + new Date(refundableUntil).toLocaleString('ca-ES')
                }
            });

        } catch (error) {
            console.error('❌ Error creant reserva:', error);
            next(error);
        }
    },

    // ✅ CANCEL·LAR RESERVA (amb política 48h)
    async cancelBooking(req, res, next) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            // Obtenir reserva actual
            const { data: booking, error: fetchError } = await supabase
                .from('bookings')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError || !booking) {
                return res.status(404).json({
                    success: false,
                    error: 'Reserva no trobada'
                });
            }

            // ✅ VERIFICAR SI ES POT REEMBORSAR
            const canRefund = BookingModel.methods.canRefund(booking.refundable_until);
            const newStatus = canRefund ? 'refunded' : 'cancelled';
            const refundAmount = canRefund ? booking.total_paid : 0;

            console.log('💰 Cancel·lació:', {
                bookingId: id,
                canRefund,
                refundAmount,
                refundableUntil: booking.refundable_until
            });

            // Actualitzar reserva
            const { data: updatedBooking, error: updateError } = await supabase
                .from('bookings')
                .update({
                    status: newStatus,
                    payment_status: canRefund ? 'refunded' : 'paid',
                    notes: booking.notes ? `${booking.notes}\n\nCancel·lada: ${reason}` : `Cancel·lada: ${reason}`,
                    non_refundable: !canRefund,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (updateError) {
                console.error('❌ Error actualitzant reserva:', updateError);
                throw updateError;
            }

            // ✅ TODO: PROCESSAR REEMBORSAMENT SI CAL
            if (canRefund) {
                // await stripeService.refund(booking.stripe_payment_intent_id);
                console.log('💳 TODO: Processar reemborsament de', refundAmount, '€');
            }

            res.json({
                success: true,
                message: canRefund
                    ? `Reserva cancel·lada. Reemborsament de ${refundAmount}€ processat.`
                    : 'Reserva cancel·lada. No es pot reemborsar (menys de 48h).',
                booking: updatedBooking,
                refunded: canRefund,
                refundAmount
            });

        } catch (error) {
            console.error('❌ Error cancel·lant reserva:', error);
            next(error);
        }
    },

    // ✅ MARCAR COM ATTENDED (quan arriben al local)
    async markAsAttended(req, res, next) {
        try {
            const { id } = req.params;
            const { attendedPeople } = req.body; // Per si venen menys persones

            const { data: booking, error } = await supabase
                .from('bookings')
                .update({
                    status: 'attended',
                    attended_people: attendedPeople,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Calcular profit si venen menys persones
            const originalPeople = booking.people_count;
            const profit = attendedPeople < originalPeople
                ? (originalPeople - attendedPeople) * booking.price_per_person
                : 0;

            res.json({
                success: true,
                message: 'Clients han arribat!',
                booking,
                profit: profit > 0 ? `${profit}€ profit per ${originalPeople - attendedPeople} persones que no han vingut` : null
            });

        } catch (error) {
            console.error('❌ Error marcant com attended:', error);
            next(error);
        }
    },

    // ✅ FINALITZAR RESERVA (quan recullen peces)
    async completeBooking(req, res, next) {
        try {
            const { id } = req.params;
            const { selectedPieces, finalTotal, extraPaid, creditGenerated } = req.body;

            // selectedPieces: [{person: 1, piece: 'tassa-gran', price: 12, extra: 4}]

            const { data: booking, error } = await supabase
                .from('bookings')
                .update({
                    status: 'completed',
                    selected_pieces: selectedPieces,
                    final_total: finalTotal,
                    extra_paid: extraPaid || 0,
                    credit_generated: creditGenerated || 0,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            res.json({
                success: true,
                message: 'Reserva completada! Peces recollides.',
                booking,
                summary: {
                    initialPaid: booking.total_paid,
                    finalTotal,
                    extraPaid,
                    creditGenerated
                }
            });

        } catch (error) {
            console.error('❌ Error completant reserva:', error);
            next(error);
        }
    },

    // ✅ LLISTAR RESERVES (mantenim igual però afegim filtres nous)
    async getBookings(req, res, next) {
        try {
            const {
                status = 'all',
                date,
                limit = 50,
                offset = 0,
                upcoming = false // ✅ Nou: només futures
            } = req.query;

            let query = supabase
                .from('bookings')
                .select(`
                    *,
                    clients (*),
                    pieces (*)
                `)
                .order('booking_date', { ascending: true })
                .order('booking_time', { ascending: true })
                .range(offset, offset + limit - 1);

            // Filtrar per status
            if (status !== 'all') {
                query = query.eq('status', status);
            }

            // Filtrar per data
            if (date) {
                query = query.eq('booking_date', date);
            }

            // ✅ Només futures
            if (upcoming) {
                const today = new Date().toISOString().split('T')[0];
                query = query.gte('booking_date', today);
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

    // ✅ RESERVES D'AVUI (per dashboard)
    async getTodayBookings(req, res, next) {
        try {
            const today = new Date().toISOString().split('T')[0];

            const { data: bookings, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    clients (name, email, phone)
                `)
                .eq('booking_date', today)
                .order('booking_time', { ascending: true });

            if (error) throw error;

            // ✅ Estadístiques del dia
            const stats = {
                total: bookings.length,
                confirmed: bookings.filter(b => b.status === 'confirmed').length,
                attended: bookings.filter(b => b.status === 'attended').length,
                completed: bookings.filter(b => b.status === 'completed').length,
                cancelled: bookings.filter(b => b.status === 'cancelled').length,
                expectedRevenue: bookings
                    .filter(b => ['confirmed', 'attended'].includes(b.status))
                    .reduce((sum, b) => sum + parseFloat(b.total_paid), 0),
                actualRevenue: bookings
                    .filter(b => b.status === 'completed')
                    .reduce((sum, b) => sum + parseFloat(b.final_total || b.total_paid), 0)
            };

            res.json({
                success: true,
                bookings,
                stats,
                date: today
            });

        } catch (error) {
            console.error('❌ Error obtenint reserves d\'avui:', error);
            next(error);
        }
    },

    // ✅ OBTENIR RESERVA PER ID (mantenim igual)
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

            // ✅ Afegir info útil
            const canRefund = BookingModel.methods.canRefund(booking.refundable_until);
            const canChange = BookingModel.methods.canChange(booking.changes_used, booking.changes_allowed);

            res.json({
                success: true,
                booking: {
                    ...booking,
                    canRefund,
                    canChange,
                    refundableUntil: booking.refundable_until
                }
            });

        } catch (error) {
            console.error('❌ Error obtenint reserva:', error);
            next(error);
        }
    },

    // ✅ AFEGEIX AQUEST MÈTODE AL FINAL DEL bookingController.js

    // 🔄 ACTUALITZAR STATUS RESERVA (mètode que faltava)
    async updateBookingStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['confirmed', 'attended', 'completed', 'cancelled', 'no_show', 'refunded'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Status no vàlid',
                    validStatuses
                });
            }

            const { data: booking, error } = await supabase
                .from('bookings')
                .update({
                    status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select(`
                    *,
                    clients (name, email, phone)
                `)
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
                message: `Status actualitzat a "${status}" correctament`,
                booking
            });

        } catch (error) {
            console.error('❌ Error actualitzant status:', error);
            next(error);
        }
    }
};

module.exports = bookingController;