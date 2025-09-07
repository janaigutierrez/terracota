const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ✅ VALIDATES PER AL NOU SISTEMA
const createBookingValidation = [
    body('name').notEmpty().withMessage('El nom és obligatori'),
    body('email').isEmail().withMessage('Email no vàlid'),
    body('phone').optional().isMobilePhone('es-ES').withMessage('Telèfon no vàlid'),
    body('date').isDate().withMessage('Data no vàlida'),
    body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora no vàlida'),
    body('people').isInt({ min: 1, max: 8 }).withMessage('Nombre de persones ha de ser entre 1 i 8'),
    body('acceptPolicy').equals('true').withMessage('Cal acceptar la política de cancel·lacions'),
    body('message').optional().isLength({ max: 500 }).withMessage('Missatge massa llarg')
];

const updateStatusValidation = [
    body('status').isIn(['confirmed', 'attended', 'completed', 'cancelled', 'no_show', 'refunded'])
        .withMessage('Status no vàlid')
];

// 📋 ROUTES PÚBLIQUES (sense auth)
// Crear nova reserva
router.post('/', createBookingValidation, bookingController.createBooking);

// Obtenir reserva per ID (per confirmació client)
router.get('/:id', bookingController.getBookingById);

// 🔐 ROUTES ADMIN (amb auth)
// Llistar totes les reserves
router.get('/', authMiddleware, bookingController.getBookings);

// Reserves d'avui (per dashboard)
router.get('/admin/today', authMiddleware, bookingController.getTodayBookings);

// Cancel·lar reserva (amb política 48h)
router.post('/:id/cancel', authMiddleware, [
    body('reason').optional().isLength({ max: 200 }).withMessage('Motiu massa llarg')
], bookingController.cancelBooking);

// Marcar com attended (quan arriben al local)
router.put('/:id/attended', authMiddleware, [
    body('attendedPeople').isInt({ min: 0, max: 8 }).withMessage('Nombre de persones no vàlid')
], bookingController.markAsAttended);

// Completar reserva (quan recullen peces)
router.put('/:id/complete', authMiddleware, [
    body('selectedPieces').isArray().withMessage('Peces seleccionades han de ser un array'),
    body('finalTotal').isDecimal({ decimal_digits: '0,2' }).withMessage('Total final no vàlid'),
    body('extraPaid').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Extra pagat no vàlid'),
    body('creditGenerated').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Crèdit generat no vàlid')
], bookingController.completeBooking);

// Actualitzar status general
router.put('/:id/status', authMiddleware, updateStatusValidation, bookingController.updateBookingStatus);

// 📊 ESTADÍSTIQUES (admin)
router.get('/stats/summary', authMiddleware, async (req, res, next) => {
    try {
        const { supabase } = require('../config/supabase');

        // Estadístiques generals
        const today = new Date().toISOString().split('T')[0];
        const thisMonth = new Date().toISOString().slice(0, 7);

        const [
            { data: todayBookings },
            { data: monthBookings },
            { data: totalBookings },
            { data: revenueData }
        ] = await Promise.all([
            supabase.from('bookings').select('*').eq('booking_date', today),
            supabase.from('bookings').select('*').like('booking_date', `${thisMonth}%`),
            supabase.from('bookings').select('id'),
            supabase.from('bookings').select('total_paid, final_total, status')
                .in('status', ['completed', 'attended', 'confirmed'])
        ]);

        const stats = {
            today: {
                total: todayBookings?.length || 0,
                confirmed: todayBookings?.filter(b => b.status === 'confirmed').length || 0,
                attended: todayBookings?.filter(b => b.status === 'attended').length || 0,
                completed: todayBookings?.filter(b => b.status === 'completed').length || 0
            },
            month: {
                total: monthBookings?.length || 0,
                revenue: monthBookings?.reduce((sum, b) => sum + parseFloat(b.final_total || b.total_paid), 0) || 0
            },
            total: {
                bookings: totalBookings?.length || 0,
                revenue: revenueData?.reduce((sum, b) => sum + parseFloat(b.final_total || b.total_paid), 0) || 0
            }
        };

        res.json({ success: true, stats });
    } catch (error) {
        next(error);
    }
});

module.exports = router;