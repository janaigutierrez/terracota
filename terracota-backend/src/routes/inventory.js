const express = require('express');
const { body, query, param } = require('express-validator');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/auth');
const InventoryModel = require('../models/Inventory');

const router = express.Router();

// 🔐 TOTES LES ROUTES REQUEREIXEN AUTENTICACIÓ ADMIN
router.use(authMiddleware);

// ✅ VALIDACIONS
const createItemValidation = [
    body('name')
        .notEmpty()
        .withMessage('El nom és obligatori')
        .isLength({ min: 2, max: 200 })
        .withMessage('El nom ha de tenir entre 2 i 200 caràcters')
        .trim(),

    body('category')
        .isIn(InventoryModel.validation.categories)
        .withMessage('Categoria no vàlida'),

    body('price')
        .isFloat({ min: 0, max: 9999.99 })
        .withMessage('El preu ha de ser un número entre 0 i 9999.99'),

    body('cost_price')
        .optional()
        .isFloat({ min: 0, max: 9999.99 })
        .withMessage('El preu de cost ha de ser un número entre 0 i 9999.99'),

    body('stock')
        .isInt({ min: 0, max: 9999 })
        .withMessage('L\'stock ha de ser un número entre 0 i 9999'),

    body('min_stock')
        .isInt({ min: 0, max: 100 })
        .withMessage('L\'stock mínim ha de ser un número entre 0 i 100'),

    body('max_stock')
        .optional()
        .isInt({ min: 1, max: 9999 })
        .withMessage('L\'stock màxim ha de ser un número entre 1 i 9999'),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripció no pot superar els 1000 caràcters')
        .trim(),

    body('active')
        .optional()
        .isBoolean()
        .withMessage('Actiu ha de ser true o false')
];

const updateItemValidation = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 200 })
        .withMessage('El nom ha de tenir entre 2 i 200 caràcters')
        .trim(),

    body('category')
        .optional()
        .isIn(InventoryModel.validation.categories)
        .withMessage('Categoria no vàlida'),

    body('price')
        .optional()
        .isFloat({ min: 0, max: 9999.99 })
        .withMessage('El preu ha de ser un número entre 0 i 9999.99'),

    body('cost_price')
        .optional()
        .isFloat({ min: 0, max: 9999.99 })
        .withMessage('El preu de cost ha de ser un número entre 0 i 9999.99'),

    body('stock')
        .optional()
        .isInt({ min: 0, max: 9999 })
        .withMessage('L\'stock ha de ser un número entre 0 i 9999'),

    body('min_stock')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('L\'stock mínim ha de ser un número entre 0 i 100'),

    body('max_stock')
        .optional()
        .isInt({ min: 1, max: 9999 })
        .withMessage('L\'stock màxim ha de ser un número entre 1 i 9999'),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripció no pot superar els 1000 caràcters')
        .trim(),

    body('active')
        .optional()
        .isBoolean()
        .withMessage('Actiu ha de ser true o false')
];

const movementValidation = [
    body('type')
        .isIn(InventoryModel.validation.movementTypes)
        .withMessage('Tipus de moviment no vàlid (in, out, adjustment)'),

    body('quantity')
        .isInt({ min: 1, max: 9999 })
        .withMessage('La quantitat ha de ser un número entre 1 i 9999'),

    body('reason')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('El motiu no pot superar els 100 caràcters')
        .trim(),

    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Les notes no poden superar els 500 caràcters')
        .trim(),

    body('reference')
        .optional()
        .isLength({ max: 100 })
        .withMessage('La referència no pot superar els 100 caràcters')
        .trim()
];

const queryValidation = [
    query('category')
        .optional()
        .custom(value => {
            if (value === 'all') return true;
            return InventoryModel.validation.categories.includes(value);
        })
        .withMessage('Categoria no vàlida'),

    query('active')
        .optional()
        .isIn(['true', 'false', 'all'])
        .withMessage('Actiu ha de ser true, false o all'),

    query('low_stock')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('Low stock ha de ser true o false'),

    query('sort_by')
        .optional()
        .isIn(['name', 'category', 'price', 'stock', 'min_stock', 'total_sold', 'created_at', 'updated_at'])
        .withMessage('Sort by no vàlid'),

    query('sort_order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order ha de ser asc o desc'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Limit ha de ser entre 1 i 1000'),

    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset ha de ser 0 o superior'),

    query('search')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('La cerca ha de tenir entre 1 i 100 caràcters')
        .trim()
];

const idValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID ha de ser un número positiu')
];

// 📋 ROUTES PRINCIPALS

// Llistar inventari amb filtres
router.get('/', queryValidation, inventoryController.getInventory);

// Obtenir article per ID
router.get('/:id', idValidation, inventoryController.getItemById);

// Crear nou article
router.post('/', createItemValidation, inventoryController.createItem);

// Actualitzar article
router.put('/:id', idValidation, updateItemValidation, inventoryController.updateItem);

// Eliminar article
router.delete('/:id', idValidation, inventoryController.deleteItem);

// 🔄 MOVIMENTS D'STOCK

// Afegir moviment
router.post('/:id/movement', idValidation, movementValidation, inventoryController.addMovement);

// Llistar moviments
router.get('/movements/history', [
    query('inventory_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Inventory ID ha de ser un número positiu'),

    query('type')
        .optional()
        .custom(value => {
            if (value === 'all') return true;
            return InventoryModel.validation.movementTypes.includes(value);
        })
        .withMessage('Tipus de moviment no vàlid'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 500 })
        .withMessage('Limit ha de ser entre 1 i 500'),

    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset ha de ser 0 o superior')
], inventoryController.getMovements);

// 📊 UTILITATS I ESTADÍSTIQUES

// Alertes stock baix
router.get('/alerts/low-stock', inventoryController.getLowStockAlerts);

// Estadístiques generals
router.get('/stats/overview', inventoryController.getStats);

// Cercar articles
router.get('/search/items', [
    query('q')
        .notEmpty()
        .withMessage('Query de cerca és obligatori')
        .isLength({ min: 2, max: 100 })
        .withMessage('La cerca ha de tenir entre 2 i 100 caràcters')
        .trim(),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit ha de ser entre 1 i 50')
], inventoryController.searchItems);

// 🔄 OPERACIONS ESPECIALS

// Actualitzar stock múltiple (per integració TPV)
router.post('/bulk/update-stock', [
    body('updates')
        .isArray({ min: 1, max: 50 })
        .withMessage('Updates ha de ser un array d\'1 a 50 elements'),

    body('updates.*.id')
        .isInt({ min: 1 })
        .withMessage('Cada update ha de tenir un ID vàlid'),

    body('updates.*.quantity')
        .isInt({ min: 1, max: 9999 })
        .withMessage('Cada update ha de tenir una quantitat vàlida'),

    body('updates.*.reason')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('El motiu no pot superar els 100 caràcters'),

    body('updates.*.reference')
        .optional()
        .isLength({ max: 100 })
        .withMessage('La referència no pot superar els 100 caràcters')
], inventoryController.updateMultipleStock);

// 📊 ENDPOINTS D'INTEGRACIÓ

// Categories disponibles
router.get('/meta/categories', (req, res) => {
    const categoriesWithInfo = InventoryModel.validation.categories.map(category => {
        const emojis = {
            'tasses': '☕',
            'plats': '🍽️',
            'bols': '🥣',
            'gerros': '🏺',
            'accessoris': '✨',
            'figures': '🧸',
            'altres': '📦'
        };

        return {
            id: category,
            name: category.charAt(0).toUpperCase() + category.slice(1),
            emoji: emojis[category] || '📦'
        };
    });

    res.json({
        success: true,
        categories: categoriesWithInfo
    });
});

// Motius de moviment per tipus
router.get('/meta/movement-reasons', (req, res) => {
    res.json({
        success: true,
        reasons: InventoryModel.validation.movementReasons
    });
});

// Informació del model
router.get('/meta/model-info', (req, res) => {
    res.json({
        success: true,
        model: {
            categories: InventoryModel.validation.categories,
            movement_types: InventoryModel.validation.movementTypes,
            movement_reasons: InventoryModel.validation.movementReasons,
            constraints: InventoryModel.validation.constraints
        }
    });
});

// 🚨 MIDDLEWARE D'ERROR PER VALIDACIONS
router.use((error, req, res, next) => {
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Error de validació',
            details: error.details
        });
    }
    next(error);
});

module.exports = router;