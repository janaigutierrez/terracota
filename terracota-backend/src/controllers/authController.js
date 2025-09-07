const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const authController = {
    // Login admin
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validar campos
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email i password són obligatoris'
                });
            }

            // Buscar admin
            const admin = await Admin.findByEmail(email);
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Credencials incorrectes'
                });
            }

            // Validar password
            const isValidPassword = await Admin.validatePassword(password, admin.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credencials incorrectes'
                });
            }

            // Generar JWT
            const token = jwt.sign(
                {
                    adminId: admin.id,
                    email: admin.email,
                    name: admin.name
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                message: 'Login correcte',
                token,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name
                }
            });

        } catch (error) {
            console.error('Error login:', error);
            res.status(500).json({
                success: false,
                message: 'Error intern del servidor'
            });
        }
    },

    // Verificar token
    async verifyToken(req, res) {
        try {
            // El middleware auth ja ha verificat el token
            res.json({
                success: true,
                admin: req.admin
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error verificant token'
            });
        }
    },

    // Logout (opcional - es fa al frontend)
    async logout(req, res) {
        res.json({
            success: true,
            message: 'Logout correcte'
        });
    }
};

module.exports = authController;