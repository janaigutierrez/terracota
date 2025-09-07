const express = require('express');
const router = express.Router();

// Import route modules
const bookingRoutes = require('./bookings');
const contactRoutes = require('./contact');
const dashboardRoutes = require('./dashboard');

// API info endpoint
router.get('/', (req, res) => {
    res.json({
        message: 'Terracotta API',
        version: '1.0.0',
        endpoints: {
            bookings: '/api/bookings',
            contact: '/api/contact',
            dashboard: '/api/dashboard'
        }
    });
});

// Mount routes
router.use('/bookings', bookingRoutes);
router.use('/contact', contactRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;