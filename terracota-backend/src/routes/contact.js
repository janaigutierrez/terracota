const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');
const router = express.Router();

// Validació formulari contacte
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('El nom ha de tenir entre 2 i 255 caràcters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email no vàlid'),

    body('phone')
        .optional()
        .isMobilePhone('es-ES')
        .withMessage('Telèfon no vàlid'),

    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('El missatge ha de tenir entre 10 i 2000 caràcters')
];

// Crear missatge de contacte
router.post('/', contactValidation, async (req, res, next) => {
    try {
        console.log('📧 Nou missatge de contacte:', req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                details: errors.array()
            });
        }

        const { name, email, phone, subject, message } = req.body;

        const { data, error } = await supabase
            .from('contact_messages')
            .insert([{
                name,
                email,
                phone: phone || null,
                subject: subject || 'Consulta general',
                message,
                status: 'unread'
            }])
            .select()
            .single();

        if (error) {
            console.error('Error guardant missatge:', error);
            throw error;
        }

        console.log('✅ Missatge guardat:', data);

        res.status(201).json({
            success: true,
            message: 'Missatge enviat correctament! 📧',
            id: data.id
        });

    } catch (error) {
        console.error('❌ Error processant contacte:', error);
        next(error);
    }
});

// Llistar missatges (admin)
router.get('/', async (req, res, next) => {
    try {
        const { status = 'all', limit = 20, offset = 0 } = req.query;

        let query = supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status !== 'all') {
            query = query.eq('status', status);
        }

        const { data: messages, error } = await query;
        if (error) throw error;

        res.json({
            success: true,
            messages: messages || [],
            total: messages?.length || 0,
            hasMore: messages?.length === parseInt(limit)
        });

    } catch (error) {
        console.error('❌ Error obtenint missatges:', error);
        next(error);
    }
});

module.exports = router;
