const express = require('express');
const { body } = require('express-validator');
const pieceCategoriesController = require('../controllers/pieceCategoriesController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 📋 VALIDACIONS
const createCategoryValidation = [
    body('name').notEmpty().withMessage('El nom és obligatori'),
    body('description').optional().isLength({ max: 500 }).withMessage('Descripció massa llarga'),
    body('priceMin').isDecimal({ decimal_digits: '0,2' }).withMessage('Preu mínim no vàlid'),
    body('priceMax').isDecimal({ decimal_digits: '0,2' }).withMessage('Preu màxim no vàlid'),
    body('examples').optional().isArray().withMessage('Exemples han de ser un array'),
    body('displayOrder').optional().isInt({ min: 0 }).withMessage('Ordre de visualització no vàlid')
];

const updateCategoryValidation = [
    body('name').optional().notEmpty().withMessage('El nom no pot estar buit'),
    body('description').optional().isLength({ max: 500 }).withMessage('Descripció massa llarga'),
    body('priceMin').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Preu mínim no vàlid'),
    body('priceMax').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Preu màxim no vàlid'),
    body('examples').optional().isArray().withMessage('Exemples han de ser un array'),
    body('displayOrder').optional().isInt({ min: 0 }).withMessage('Ordre de visualització no vàlid'),
    body('active').optional().isBoolean().withMessage('Actiu ha de ser boolean')
];

// 🌐 ROUTES PÚBLIQUES
// Obtenir categories actives (per mostrar al frontend)
router.get('/', pieceCategoriesController.getCategories);

// 🔐 ROUTES ADMIN
// Obtenir categories amb estadístiques (admin)
router.get('/admin/stats', authMiddleware, pieceCategoriesController.getCategoriesStats);

// Crear nova categoria
router.post('/', authMiddleware, createCategoryValidation, pieceCategoriesController.createCategory);

// Actualitzar categoria
router.put('/:id', authMiddleware, updateCategoryValidation, pieceCategoriesController.updateCategory);

// Eliminar categoria
router.delete('/:id', authMiddleware, pieceCategoriesController.deleteCategory);

module.exports = router;