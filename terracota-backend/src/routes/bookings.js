const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Validació per crear reserva
const createBookingValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('El nom ha de tenir entre 2 i 255 caràcters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email no vàlid'),

    body('phone')
        .isMobilePhone('es-ES')
        .withMessage('Telèfon no vàlid'),

    body('selectedOption')
        .isIn(['tassa', 'plat', 'decorativa', 'grup'])
        .withMessage('Opció de peça no vàlida'),

    body('date')
        .isISO8601()
        .toDate()
        .withMessage('Data no vàlida'),

    body('time')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Hora no vàlida (format HH:MM)'),

    body('people')
        .isInt({ min: 1, max: 10 })
        .withMessage('Número de persones ha de ser entre 1 i 10'),

    body('totalPrice')
        .isFloat({ min: 0 })
        .withMessage('Preu total ha de ser positiu')
];

// Routes públiques (frontend)
router.post('/', createBookingValidation, bookingController.createBooking);

// Routes admin
router.get('/', bookingController.getBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/status', bookingController.updateBookingStatus);

module.exports = router;