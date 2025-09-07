const { supabase } = require('../config/supabase');

class InventoryService {

    // Obtenir alertes de stock baix
    async getLowStockAlerts() {
        try {
            const { data: items, error } = await supabase
                .from('inventory')
                .select('*')
                .filter('stock_quantity', 'lte', 'min_stock')
                .eq('active', true)
                .order('stock_quantity', { ascending: true });

            if (error) throw error;

            return {
                success: true,
                alerts: items,
                count: items.length
            };

        } catch (error) {
            console.error('❌ Error obtenint alertes stock:', error);
            throw error;
        }
    }

    // Actualitzar stock després d'una venda
    async updateStock(itemId, quantityUsed, notes = '') {
        try {
            // Obtenir item actual
            const { data: item, error: fetchError } = await supabase
                .from('inventory')
                .select('*')
                .eq('id', itemId)
                .single();

            if (fetchError) throw fetchError;

            const newQuantity = item.stock_quantity - quantityUsed;

            // Actualitzar stock
            const { data: updatedItem, error: updateError } = await supabase
                .from('inventory')
                .update({
                    stock_quantity: newQuantity,
                    updated_at: new Date().toISOString()
                })
                .eq('id', itemId)
                .select()
                .single();

            if (updateError) throw updateError;

            // Registrar moviment d'inventari
            await this.recordInventoryMovement(itemId, 'out', quantityUsed, notes);

            console.log(`📦 Stock actualitzat: ${item.item_name} (${newQuantity})`);

            return {
                success: true,
                item: updatedItem,
                newQuantity,
                isLowStock: newQuantity <= item.min_stock
            };

        } catch (error) {
            console.error('❌ Error actualitzant stock:', error);
            throw error;
        }
    }

    // Registrar moviment d'inventari
    async recordInventoryMovement(itemId, type, quantity, notes = '') {
        try {
            const { data, error } = await supabase
                .from('inventory_movements')
                .insert([{
                    inventory_id: itemId,
                    movement_type: type, // 'in' o 'out'
                    quantity: quantity,
                    notes: notes,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            return { success: true, movement: data };

        } catch (error) {
            console.error('❌ Error registrant moviment inventari:', error);
            throw error;
        }
    }

    // Reposar stock
    async restockItem(itemId, quantity, cost = null, notes = '') {
        try {
            // Obtenir item actual
            const { data: item, error: fetchError } = await supabase
                .from('inventory')
                .select('*')
                .eq('id', itemId)
                .single();

            if (fetchError) throw fetchError;

            const newQuantity = item.stock_quantity + quantity;

            // Actualitzar stock
            const updateData = {
                stock_quantity: newQuantity,
                last_restocked: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            if (cost) {
                updateData.cost_price = cost;
            }

            const { data: updatedItem, error: updateError } = await supabase
                .from('inventory')
                .update(updateData)
                .eq('id', itemId)
                .select()
                .single();

            if (updateError) throw updateError;

            // Registrar moviment
            await this.recordInventoryMovement(itemId, 'in', quantity, notes);

            console.log(`📦 Stock reposat: ${item.item_name} (+${quantity} = ${newQuantity})`);

            return {
                success: true,
                item: updatedItem,
                newQuantity
            };

        } catch (error) {
            console.error('❌ Error reposant stock:', error);
            throw error;
        }
    }
}

module.exports = new InventoryService();