const { supabase } = require('../config/supabase');

const pieceCategoriesController = {
    // 📋 OBTENIR TOTES LES CATEGORIES (per mostrar al client)
    async getCategories(req, res, next) {
        try {
            const { data: categories, error } = await supabase
                .from('piece_categories')
                .select('*')
                .eq('active', true)
                .order('display_order', { ascending: true });

            if (error) throw error;

            res.json({
                success: true,
                categories: categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    description: category.description,
                    priceRange: `${category.price_min}€ - ${category.price_max}€`,
                    priceMin: category.price_min,
                    priceMax: category.price_max,
                    examples: category.examples || []
                }))
            });

        } catch (error) {
            console.error('❌ Error obtenint categories:', error);
            next(error);
        }
    },

    // 📊 ESTADÍSTIQUES CATEGORIES (per admin)
    async getCategoriesStats(req, res, next) {
        try {
            // Obtenir categories amb estadístiques d'ús
            const { data: categories, error } = await supabase
                .from('piece_categories')
                .select(`
                    *,
                    inventory!inner(
                        piece_name,
                        stock_quantity,
                        price
                    )
                `)
                .eq('active', true)
                .order('display_order');

            if (error) throw error;

            // Calcular estadístiques per categoria
            const categoriesWithStats = categories.map(category => {
                const inventoryItems = category.inventory || [];
                const totalStock = inventoryItems.reduce((sum, item) => sum + item.stock_quantity, 0);
                const avgPrice = inventoryItems.length > 0
                    ? inventoryItems.reduce((sum, item) => sum + parseFloat(item.price), 0) / inventoryItems.length
                    : 0;

                return {
                    id: category.id,
                    name: category.name,
                    description: category.description,
                    priceMin: category.price_min,
                    priceMax: category.price_max,
                    examples: category.examples,
                    stats: {
                        totalItems: inventoryItems.length,
                        totalStock,
                        avgPrice: avgPrice.toFixed(2),
                        lowStock: inventoryItems.filter(item => item.stock_quantity <= 5).length
                    }
                };
            });

            res.json({
                success: true,
                categories: categoriesWithStats
            });

        } catch (error) {
            console.error('❌ Error obtenint estadístiques categories:', error);
            next(error);
        }
    },

    // ✏️ CREAR NOVA CATEGORIA (admin)
    async createCategory(req, res, next) {
        try {
            const {
                name,
                description,
                priceMin,
                priceMax,
                examples,
                displayOrder
            } = req.body;

            // Validacions
            if (!name || !priceMin || !priceMax) {
                return res.status(400).json({
                    success: false,
                    error: 'Nom, preu mínim i màxim són obligatoris'
                });
            }

            if (priceMin >= priceMax) {
                return res.status(400).json({
                    success: false,
                    error: 'El preu mínim ha de ser menor que el màxim'
                });
            }

            const { data: category, error } = await supabase
                .from('piece_categories')
                .insert([{
                    name,
                    description,
                    price_min: priceMin,
                    price_max: priceMax,
                    examples: examples || [],
                    display_order: displayOrder || 999,
                    active: true
                }])
                .select()
                .single();

            if (error) throw error;

            res.status(201).json({
                success: true,
                message: 'Categoria creada correctament',
                category
            });

        } catch (error) {
            console.error('❌ Error creant categoria:', error);
            next(error);
        }
    },

    // 🔄 ACTUALITZAR CATEGORIA (admin)
    async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const {
                name,
                description,
                priceMin,
                priceMax,
                examples,
                displayOrder,
                active
            } = req.body;

            const updates = {};
            if (name !== undefined) updates.name = name;
            if (description !== undefined) updates.description = description;
            if (priceMin !== undefined) updates.price_min = priceMin;
            if (priceMax !== undefined) updates.price_max = priceMax;
            if (examples !== undefined) updates.examples = examples;
            if (displayOrder !== undefined) updates.display_order = displayOrder;
            if (active !== undefined) updates.active = active;

            // Validar preus si es canvien
            if (updates.price_min && updates.price_max && updates.price_min >= updates.price_max) {
                return res.status(400).json({
                    success: false,
                    error: 'El preu mínim ha de ser menor que el màxim'
                });
            }

            const { data: category, error } = await supabase
                .from('piece_categories')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            res.json({
                success: true,
                message: 'Categoria actualitzada correctament',
                category
            });

        } catch (error) {
            console.error('❌ Error actualitzant categoria:', error);
            next(error);
        }
    },

    // 🗑️ ELIMINAR CATEGORIA (admin)
    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;

            // Verificar si té items d'inventari associats
            const { data: inventoryItems, error: inventoryError } = await supabase
                .from('inventory')
                .select('id')
                .eq('category', id);

            if (inventoryError) throw inventoryError;

            if (inventoryItems && inventoryItems.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No es pot eliminar una categoria amb items d\'inventari associats'
                });
            }

            const { error } = await supabase
                .from('piece_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            res.json({
                success: true,
                message: 'Categoria eliminada correctament'
            });

        } catch (error) {
            console.error('❌ Error eliminant categoria:', error);
            next(error);
        }
    }
};

module.exports = pieceCategoriesController;