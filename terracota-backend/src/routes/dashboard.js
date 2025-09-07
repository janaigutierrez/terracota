const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware d'autenticació a totes les routes del dashboard
router.use(authMiddleware);

// 📊 ESTADÍSTIQUES PRINCIPALS
router.get('/stats', dashboardController.getStats);

// 📅 RESUM DEL DIA
router.get('/today', dashboardController.getTodaySummary);

// 💰 INGRESSOS PER PERÍODE
router.get('/revenue', dashboardController.getRevenue);

// 🏺 ESTAT DE LES PECES
router.get('/pieces', dashboardController.getPiecesStatus);

module.exports = router;