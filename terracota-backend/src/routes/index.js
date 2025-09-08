// terracota-backend/src/routes/index.js - VERSIÓ CORREGIDA

const express = require('express');
const authRoutes = require('./auth');
const bookingRoutes = require('./bookings');
const contactRoutes = require('./contact');
const dashboardRoutes = require('./dashboard');
const inventoryRoutes = require('./inventory'); // ✅ AFEGIT
const pieceCategoriesRoutes = require('./pieceCategories');

const router = express.Router();

// 🌐 ROUTES PÚBLIQUES
router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/contact', contactRoutes);
router.use('/piece-categories', pieceCategoriesRoutes);

// 🔐 ROUTES ADMIN
router.use('/dashboard', dashboardRoutes);
router.use('/inventory', inventoryRoutes); // ✅ AFEGIT

// 📊 HEALTH CHECK
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Terracotta API funcionant correctament! 🏺',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        features: [
            'Sistema 8€/persona',
            'Política cancel·lacions 48h',
            'Categories de peces',
            'Dashboard admin',
            'Inventari complet', // ✅ AFEGIT
            'Notificacions automàtiques'
        ]
    });
});

// 🎯 ENDPOINT INFORMATIU
router.get('/info', (req, res) => {
    res.json({
        success: true,
        api: 'Terracotta Backend API',
        description: 'API per ceramiqueria paint-your-own pottery + cafeteria',
        location: 'Granollers, Catalunya',
        endpoints: {
            public: [
                'POST /api/bookings - Crear reserva',
                'GET /api/bookings/:id - Obtenir reserva',
                'GET /api/piece-categories - Categories disponibles',
                'POST /api/contact - Enviar missatge'
            ],
            admin: [
                'POST /api/auth/login - Login admin',
                'GET /api/dashboard/* - Estadístiques',
                'GET /api/bookings - Gestionar reserves',
                'POST /api/bookings/:id/cancel - Cancel·lar',
                'PUT /api/bookings/:id/attended - Marcar assistència',
                'PUT /api/bookings/:id/complete - Completar',
                'GET /api/inventory - Llistar inventari', // ✅ AFEGIT
                'POST /api/inventory - Crear article', // ✅ AFEGIT
                'PUT /api/inventory/:id - Actualitzar article', // ✅ AFEGIT
                'DELETE /api/inventory/:id - Eliminar article', // ✅ AFEGIT
                'POST /api/inventory/:id/movement - Moviment stock', // ✅ AFEGIT
                'POST /api/piece-categories - Gestionar categories'
            ]
        },
        businessModel: {
            pricePerPerson: '8€',
            cancellationPolicy: '48h abans - reemborsament complet',
            paymentMethods: ['online', 'cash', 'card'],
            maxPeople: 8
        }
    });
});

// 404 Handler
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint no trobat',
        availableEndpoints: [
            'GET /api/health',
            'GET /api/info',
            'POST /api/bookings',
            'GET /api/piece-categories',
            'POST /api/contact',
            'POST /api/auth/login',
            'GET /api/inventory', // ✅ AFEGIT
            'POST /api/inventory' // ✅ AFEGIT
        ]
    });
});

module.exports = router;