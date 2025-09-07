const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
    try {
        // Agafar token del header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'accés requerit'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar admin a la BD
        const admin = await Admin.findByEmail(decoded.email);
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Token invàlid'
            });
        }

        // Afegir admin al request
        req.admin = {
            id: admin.id,
            email: admin.email,
            name: admin.name
        };

        next();
    } catch (error) {
        console.error('Error auth middleware:', error);
        res.status(401).json({
            success: false,
            message: 'Token invàlid'
        });
    }
};

module.exports = authMiddleware;