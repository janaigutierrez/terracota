const { supabase } = require('../config/supabase');
const { validationResult } = require('express-validator');
const InventoryModel = require('../models/Inventory');

const inventoryController = {

    // 📋 LLISTAR TOT L'INVENTARI
    async getInventory(req, res, next) {
        try {
            const {
                category = 'all',
                active = 'all',
                low_stock = 'false',
                search = '',
                sort_by = 'name',
                sort_order = 'asc',
                limit = 100,
                offset = 0
            } = req.query;

            console.log('📦 Obtenint inventari:', { category, active, low_stock, search });

            let query = supabase
                .from('inventory')
                .select('*')
                .range(offset, offset + parseInt(limit) - 1);

            // Filtrar per categoria
            if (category !== 'all') {
                query = query.eq('category', category);
            }

            // Filtrar per actiu/inactiu
            if (active !== 'all') {
                query = query.eq('active', active === 'true');
            }

            // Filtrar per cerca de text
            if (search) {
                query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
            }

            // Ordenar
            const ascending = sort_order === 'asc';
            query = query.order(sort_by, { ascending });

            const { data: inventory, error } = await query;

            if (error) throw error;

            // Filtrar stock baix si cal (després de la consulta)
            let filteredInventory = inventory || [];
            if (low_stock === 'true') {
                filteredInventory = filteredInventory.filter(item =>
                    InventoryModel.methods.isLowStock(item)
                );
            }

            // Formatear dades per API
            const formattedInventory = filteredInventory.map(item =>
                InventoryModel.methods.formatForAPI(item)
            );

            // Estadístiques
            const stats = {
                total_items: filteredInventory.length,
                active_items: filteredInventory.filter(item => item.active).length,
                low_stock_items: filteredInventory.filter(item =>
                    InventoryModel.methods.isLowStock(item)
                ).length,
                total_stock_value: InventoryModel.methods.calculateStockValue(filteredInventory),
                total_stock_cost: InventoryModel.methods.calculateStockCost(filteredInventory)
            };

            res.json({
                success: true,
                inventory: formattedInventory,
                stats,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: formattedInventory.length,
                    has_more: formattedInventory.length === parseInt(limit)
                }
            });

        } catch (error) {
            console.error('❌ Error obtenint inventari:', error);
            next(error);
        }
    },

    // 📝 CREAR NOU ARTICLE
    async createItem(req, res, next) {
        try {
            console.log('➕ Creant nou article:', req.body);

            // Validar dades d'entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'Dades no vàlides',
                    details: errors.array()
                });
            }

            const {
                name,
                description,
                category,
                price,
                cost_price,
                stock,
                min_stock,
                max_stock,
                active = true
            } = req.body;

            // Generar SKU automàtic si no es proporciona
            const sku = InventoryModel.methods.generateSKU(category, name);

            // Crear article
            const { data: newItem, error: createError } = await supabase
                .from('inventory')
                .insert([{
                    name: name.trim(),
                    description: description?.trim() || null,
                    category,
                    sku,
                    price: parseFloat(price),
                    cost_price: cost_price ? parseFloat(cost_price) : null,
                    stock: parseInt(stock),
                    min_stock: parseInt(min_stock),
                    max_stock: max_stock ? parseInt(max_stock) : null,
                    active,
                    last_movement_date: new Date().toISOString().split('T')[0]
                }])
                .select()
                .single();

            if (createError) {
                console.error('❌ Error creant article:', createError);
                throw createError;
            }

            // Registrar moviment inicial d'stock
            if (stock > 0) {
                await inventoryController.registerMovement(
                    newItem.id,
                    'in',
                    stock,
                    0,
                    'initial_stock',
                    'Stock inicial en crear article'
                );
            }

            console.log('✅ Article creat:', newItem);

            res.status(201).json({
                success: true,
                message: 'Article creat correctament',
                item: InventoryModel.methods.formatForAPI(newItem)
            });

        } catch (error) {
            console.error('❌ Error creant article:', error);
            next(error);
        }
    },

    // ✏️ ACTUALITZAR ARTICLE
    async updateItem(req, res, next) {
        try {
            const { id } = req.params;
            console.log('✏️ Actualitzant article:', id, req.body);

            // Validar dades d'entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'Dades no vàlides',
                    details: errors.array()
                });
            }

            // Obtenir article actual
            const { data: currentItem, error: fetchError } = await supabase
                .from('inventory')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError || !currentItem) {
                return res.status(404).json({
                    success: false,
                    error: 'Article no trobat'
                });
            }

            const {
                name,
                description,
                category,
                price,
                cost_price,
                stock,
                min_stock,
                max_stock,
                active
            } = req.body;

            // Actualitzar article
            const { data: updatedItem, error: updateError } = await supabase
                .from('inventory')
                .update({
                    name: name?.trim() || currentItem.name,
                    description: description !== undefined ? description?.trim() : currentItem.description,
                    category: category || currentItem.category,
                    price: price !== undefined ? parseFloat(price) : currentItem.price,
                    cost_price: cost_price !== undefined ? (cost_price ? parseFloat(cost_price) : null) : currentItem.cost_price,
                    stock: stock !== undefined ? parseInt(stock) : currentItem.stock,
                    min_stock: min_stock !== undefined ? parseInt(min_stock) : currentItem.min_stock,
                    max_stock: max_stock !== undefined ? (max_stock ? parseInt(max_stock) : null) : currentItem.max_stock,
                    active: active !== undefined ? active : currentItem.active,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (updateError) {
                console.error('❌ Error actualitzant article:', updateError);
                throw updateError;
            }

            // Si s'ha canviat l'stock, registrar moviment
            if (stock !== undefined && parseInt(stock) !== currentItem.stock) {
                const stockDiff = parseInt(stock) - currentItem.stock;
                const movementType = stockDiff > 0 ? 'in' : 'out';
                const quantity = Math.abs(stockDiff);

                await inventoryController.registerMovement(
                    id,
                    movementType,
                    quantity,
                    currentItem.stock,
                    'adjustment',
                    'Ajust manual d\'stock'
                );
            }

            console.log('✅ Article actualitzat:', updatedItem);

            res.json({
                success: true,
                message: 'Article actualitzat correctament',
                item: InventoryModel.methods.formatForAPI(updatedItem)
            });

        } catch (error) {
            console.error('❌ Error actualitzant article:', error);
            next(error);
        }
    },

    // 🗑️ ELIMINAR ARTICLE
    async deleteItem(req, res, next) {
        try {
            const { id } = req.params;
            console.log('🗑️ Eliminant article:', id);

            // Verificar que l'article existeix
            const { data: item, error: fetchError } = await supabase
                .from('inventory')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError || !item) {
                return res.status(404).json({
                    success: false,
                    error: 'Article no trobat'
                });
            }

            // Verificar que no té moviments recents (opcional)
            const { data: recentMovements } = await supabase
                .from('inventory_movements')
                .select('id')
                .eq('inventory_id', id)
                .gte('movement_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Últims 30 dies
                .limit(1);

            if (recentMovements && recentMovements.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No es pot eliminar un article amb moviments recents. Pots desactivar-lo en comptes d\'eliminar-lo.'
                });
            }

            // Eliminar l'article (això eliminarà automàticament els moviments per CASCADE)
            const { error: deleteError } = await supabase
                .from('inventory')
                .delete()
                .eq('id', id);

            if (deleteError) {
                console.error('❌ Error eliminant article:', deleteError);
                throw deleteError;
            }

            console.log('✅ Article eliminat:', id);

            res.json({
                success: true,
                message: 'Article eliminat correctament'
            });

        } catch (error) {
            console.error('❌ Error eliminant article:', error);
            next(error);
        }
    },

    // 📊 REGISTRAR MOVIMENT D'STOCK
    async registerMovement(inventory_id, type, quantity, previous_stock, reason, notes, reference = null, user_id = null) {
        try {
            console.log('📊 Registrant moviment:', {
                inventory_id,
                type,
                quantity,
                previous_stock,
                reason
            });

            // Validar moviment
            const validation = InventoryModel.methods.validateMovement(previous_stock, type, quantity);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Calcular nou stock
            const new_stock = InventoryModel.methods.calculateNewStock(previous_stock, type, quantity);

            // Registrar moviment
            const { data: movement, error: movementError } = await supabase
                .from('inventory_movements')
                .insert([{
                    inventory_id,
                    type,
                    quantity,
                    previous_stock,
                    new_stock,
                    reason: reason || InventoryModel.methods.getDefaultReason(type),
                    notes,
                    reference,
                    user_id,
                    movement_date: new Date().toISOString()
                }])
                .select()
                .single();

            if (movementError) {
                console.error('❌ Error registrant moviment:', movementError);
                throw movementError;
            }

            // Actualitzar stock de l'article
            const updateData = {
                stock: new_stock,
                last_movement_date: new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString()
            };

            // Actualitzar comptadors
            if (type === 'in') {
                updateData.total_purchased = supabase.rpc('increment_total_purchased', {
                    item_id: inventory_id,
                    qty: quantity
                });
            } else if (type === 'out' && reason === 'sale') {
                updateData.total_sold = supabase.rpc('increment_total_sold', {
                    item_id: inventory_id,
                    qty: quantity
                });
                updateData.last_sale_date = new Date().toISOString().split('T')[0];
            }

            const { error: updateError } = await supabase
                .from('inventory')
                .update(updateData)
                .eq('id', inventory_id);

            if (updateError) {
                console.error('❌ Error actualitzant stock:', updateError);
                throw updateError;
            }

            console.log('✅ Moviment registrat:', movement);
            return movement;

        } catch (error) {
            console.error('❌ Error registrant moviment:', error);
            throw error;
        }
    },

    // 🔄 ENDPOINT PER MOVIMENTS (API pública)
    async addMovement(req, res, next) {
        try {
            const { id } = req.params;
            console.log('🔄 Nou moviment per article:', id, req.body);

            // Validar dades d'entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'Dades no vàlides',
                    details: errors.array()
                });
            }

            const { type, quantity, reason, notes, reference } = req.body;

            // Obtenir stock actual
            const { data: item, error: fetchError } = await supabase
                .from('inventory')
                .select('stock')
                .eq('id', id)
                .single();

            if (fetchError || !item) {
                return res.status(404).json({
                    success: false,
                    error: 'Article no trobat'
                });
            }

            // Registrar moviment
            const movement = await inventoryController.registerMovement(
                parseInt(id),
                type,
                parseInt(quantity),
                item.stock,
                reason,
                notes,
                reference,
                req.user?.id // TODO: Obtenir del token JWT
            );

            res.json({
                success: true,
                message: `Moviment registrat correctament: ${type === 'in' ? '+' : '-'}${quantity} unitats`,
                movement: InventoryModel.methods.formatMovementForAPI(movement),
                new_stock: movement.new_stock
            });

        } catch (error) {
            console.error('❌ Error afegint moviment:', error);
            next(error);
        }
    },

    // 📊 OBTENIR ARTICLE PER ID
    async getItemById(req, res, next) {
        try {
            const { id } = req.params;

            const { data: item, error } = await supabase
                .from('inventory')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !item) {
                return res.status(404).json({
                    success: false,
                    error: 'Article no trobat'
                });
            }

            res.json({
                success: true,
                item: InventoryModel.methods.formatForAPI(item)
            });

        } catch (error) {
            console.error('❌ Error obtenint article:', error);
            next(error);
        }
    },

    // ⚠️ ALERTES DE STOCK BAIX
    async getLowStockAlerts(req, res, next) {
        try {
            console.log('⚠️ Obtenint alertes stock baix');

            const { data: lowStockItems, error } = await supabase
                .from('inventory')
                .select('*')
                .eq('active', true)
                .order('stock', { ascending: true });

            if (error) throw error;

            const alerts = (lowStockItems || [])
                .filter(item => InventoryModel.methods.isLowStock(item))
                .map(item => InventoryModel.methods.formatForAPI(item));

            res.json({
                success: true,
                alerts,
                total_alerts: alerts.length
            });

        } catch (error) {
            console.error('❌ Error obtenint alertes:', error);
            next(error);
        }
    },

    // 📈 HISTÒRIAL MOVIMENTS
    async getMovements(req, res, next) {
        try {
            const {
                inventory_id,
                type = 'all',
                limit = 50,
                offset = 0
            } = req.query;

            console.log('📈 Obtenint moviments:', { inventory_id, type });

            let query = supabase
                .from('inventory_movements')
                .select(`
                    *,
                    inventory:inventory_id (name, category)
                `)
                .order('movement_date', { ascending: false })
                .range(offset, offset + parseInt(limit) - 1);

            if (inventory_id) {
                query = query.eq('inventory_id', inventory_id);
            }

            if (type !== 'all') {
                query = query.eq('type', type);
            }

            const { data: movements, error } = await query;

            if (error) throw error;

            const formattedMovements = (movements || []).map(movement => ({
                ...InventoryModel.methods.formatMovementForAPI(movement),
                item_name: movement.inventory?.name,
                item_category: movement.inventory?.category
            }));

            res.json({
                success: true,
                movements: formattedMovements,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: formattedMovements.length,
                    has_more: formattedMovements.length === parseInt(limit)
                }
            });

        } catch (error) {
            console.error('❌ Error obtenint moviments:', error);
            next(error);
        }
    },

    // 📊 ESTADÍSTIQUES GENERALS
    async getStats(req, res, next) {
        try {
            console.log('📊 Obtenint estadístiques inventari');

            // Obtenir tots els articles actius
            const { data: allItems, error: itemsError } = await supabase
                .from('inventory')
                .select('*')
                .eq('active', true);

            if (itemsError) throw itemsError;

            // Estadístiques per categoria
            const { data: categoryStats, error: categoryError } = await supabase
                .rpc('get_inventory_category_stats');

            if (categoryError) {
                console.warn('⚠️ Error obtenint stats per categoria:', categoryError);
            }

            const items = allItems || [];
            const lowStockItems = items.filter(item => InventoryModel.methods.isLowStock(item));
            const totalValue = InventoryModel.methods.calculateStockValue(items);
            const totalCost = InventoryModel.methods.calculateStockCost(items);

            const stats = {
                overview: {
                    total_items: items.length,
                    active_items: items.filter(item => item.active).length,
                    low_stock_items: lowStockItems.length,
                    out_of_stock_items: items.filter(item => item.stock === 0).length
                },
                financial: {
                    total_stock_value: totalValue,
                    total_stock_cost: totalCost,
                    potential_profit: totalValue - totalCost,
                    avg_item_value: items.length > 0 ? totalValue / items.length : 0
                },
                categories: categoryStats || [],
                alerts: {
                    critical_stock: lowStockItems.filter(item => item.stock === 0).length,
                    low_stock: lowStockItems.filter(item => item.stock > 0).length,
                    overstocked: items.filter(item => item.max_stock && item.stock > item.max_stock).length
                },
                performance: {
                    top_selling: items
                        .filter(item => item.total_sold > 0)
                        .sort((a, b) => b.total_sold - a.total_sold)
                        .slice(0, 5)
                        .map(item => InventoryModel.methods.formatForAPI(item)),
                    least_selling: items
                        .filter(item => item.total_sold === 0)
                        .slice(0, 5)
                        .map(item => InventoryModel.methods.formatForAPI(item))
                }
            };

            res.json({
                success: true,
                stats
            });

        } catch (error) {
            console.error('❌ Error obtenint estadístiques:', error);
            next(error);
        }
    },

    // 🔍 CERCAR ARTICLES
    async searchItems(req, res, next) {
        try {
            const { q, limit = 10 } = req.query;

            if (!q || q.length < 2) {
                return res.status(400).json({
                    success: false,
                    error: 'La cerca ha de tenir almenys 2 caràcters'
                });
            }

            console.log('🔍 Cercant articles:', q);

            const { data: items, error } = await supabase
                .from('inventory')
                .select('*')
                .eq('active', true)
                .or(`name.ilike.%${q}%,description.ilike.%${q}%,sku.ilike.%${q}%`)
                .order('name')
                .limit(parseInt(limit));

            if (error) throw error;

            const formattedItems = (items || []).map(item =>
                InventoryModel.methods.formatForAPI(item)
            );

            res.json({
                success: true,
                items: formattedItems,
                total: formattedItems.length,
                query: q
            });

        } catch (error) {
            console.error('❌ Error cercant articles:', error);
            next(error);
        }
    },

    // 📦 ACTUALITZAR STOCK MÚLTIPLE (per integració TPV)
    async updateMultipleStock(req, res, next) {
        try {
            const { updates } = req.body; // Array de { id, quantity, reason }
            console.log('📦 Actualitzant stock múltiple:', updates);

            if (!Array.isArray(updates) || updates.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Cal proporcionar un array d\'actualitzacions'
                });
            }

            const results = [];
            const errors = [];

            // Processar cada actualització
            for (const update of updates) {
                try {
                    const { id, quantity, reason = 'sale', reference } = update;

                    // Obtenir stock actual
                    const { data: item, error: fetchError } = await supabase
                        .from('inventory')
                        .select('stock')
                        .eq('id', id)
                        .single();

                    if (fetchError || !item) {
                        errors.push({
                            id,
                            error: 'Article no trobat'
                        });
                        continue;
                    }

                    // Registrar moviment
                    const movement = await inventoryController.registerMovement(
                        parseInt(id),
                        'out',
                        parseInt(quantity),
                        item.stock,
                        reason,
                        `Actualització automàtica: ${reason}`,
                        reference
                    );

                    results.push({
                        id,
                        previous_stock: item.stock,
                        new_stock: movement.new_stock,
                        quantity_moved: quantity
                    });

                } catch (updateError) {
                    console.error(`❌ Error actualitzant article ${update.id}:`, updateError);
                    errors.push({
                        id: update.id,
                        error: updateError.message
                    });
                }
            }

            res.json({
                success: errors.length === 0,
                message: `${results.length} articles actualitzats correctament`,
                results,
                errors: errors.length > 0 ? errors : undefined
            });

        } catch (error) {
            console.error('❌ Error actualitzant stock múltiple:', error);
            next(error);
        }
    }
};

module.exports = inventoryController;