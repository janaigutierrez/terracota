const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/verify (protected)
router.get('/verify', authMiddleware, authController.verifyToken);

// POST /api/auth/logout (protected)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;