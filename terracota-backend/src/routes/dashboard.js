const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Routes dashboard
router.get('/stats', dashboardController.getStats);
router.get('/today', dashboardController.getTodayBookings);
router.get('/inventory-alerts', dashboardController.getInventoryAlerts);

// Test endpoint
router.get('/test', (req, res) => {
    res.json({
        message: 'Dashboard funcionant! 📊',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;