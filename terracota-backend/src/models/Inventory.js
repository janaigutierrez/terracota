const InventoryModel = {
    tableName: 'inventory',

    // 📋 SCHEMA BASE DE DADES
    schema: {
        id: 'BIGSERIAL PRIMARY KEY',

        // 📝 INFO BÀSICA
        name: 'VARCHAR(200) NOT NULL',
        description: 'TEXT',
        category: 'VARCHAR(50) NOT NULL',
        sku: 'VARCHAR(100) UNIQUE', // Codi intern (opcional)

        // 💰 PREUS
        price: 'DECIMAL(8,2) NOT NULL', // Preu venda
        cost_price: 'DECIMAL(8,2)', // Preu cost (opcional)

        // 📦 STOCK
        stock: 'INTEGER NOT NULL DEFAULT 0',
        min_stock: 'INTEGER NOT NULL DEFAULT 5', // Límit alerta
        max_stock: 'INTEGER DEFAULT 100', // Límit màxim (opcional)

        // 📊 ESTADÍSTIQUES
        total_sold: 'INTEGER DEFAULT 0', // Total venut
        total_purchased: 'INTEGER DEFAULT 0', // Total comprat

        // 🔄 ESTAT
        active: 'BOOLEAN DEFAULT true', // Actiu/inactiu
        last_movement_date: 'DATE',
        last_sale_date: 'DATE',

        // 🖼️ MEDIA (futur)
        image_url: 'VARCHAR(500)',

        // 📅 DATES
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
    },

    // 📋 SCHEMA TAULA MOVIMENTS
    movementsSchema: {
        tableName: 'inventory_movements',
        schema: {
            id: 'BIGSERIAL PRIMARY KEY',
            inventory_id: 'BIGINT REFERENCES inventory(id) ON DELETE CASCADE',

            // 📊 MOVIMENT
            type: 'VARCHAR(20) NOT NULL', // 'in', 'out', 'adjustment'
            quantity: 'INTEGER NOT NULL',
            previous_stock: 'INTEGER NOT NULL',
            new_stock: 'INTEGER NOT NULL',

            // 📝 INFO
            reason: 'VARCHAR(100)', // 'sale', 'purchase', 'breakage', etc.
            notes: 'TEXT',
            reference: 'VARCHAR(100)', // Referència externa (venda, compra...)

            // 👤 RESPONSABLE
            user_id: 'BIGINT', // Admin que fa el moviment

            // 📅 DATA
            movement_date: 'TIMESTAMPTZ DEFAULT NOW()',
            created_at: 'TIMESTAMPTZ DEFAULT NOW()'
        }
    },

    // ✅ VALIDACIONS
    validation: {
        required: ['name', 'category', 'price', 'stock', 'min_stock'],

        categories: [
            'tasses',
            'plats',
            'bols',
            'gerros',
            'accessoris',
            'figures',
            'altres'
        ],

        movementTypes: ['in', 'out', 'adjustment'],

        movementReasons: {
            'in': ['purchase', 'return', 'production', 'correction', 'gift', 'other'],
            'out': ['sale', 'breakage', 'defect', 'correction', 'gift', 'other'],
            'adjustment': ['inventory_count', 'correction', 'other']
        },

        constraints: {
            name: { minLength: 2, maxLength: 200 },
            price: { min: 0, max: 9999.99 },
            stock: { min: 0, max: 9999 },
            min_stock: { min: 0, max: 100 },
            quantity: { min: 1, max: 9999 }
        }
    },

    // 🔗 RELACIONS
    relationships: {
        hasMany: ['inventory_movements'],
        belongsTo: [] // Futur: supplier, brand...
    },

    // 🛠️ MÈTODES D'UTILITAT
    methods: {
        // Verificar si stock és baix
        isLowStock(item) {
            return item.stock <= item.min_stock;
        },

        // Calcular valor total stock
        calculateStockValue(items) {
            return items.reduce((total, item) => {
                return total + (item.stock * item.price);
            }, 0);
        },

        // Calcular cost total stock
        calculateStockCost(items) {
            return items.reduce((total, item) => {
                return total + (item.stock * (item.cost_price || 0));
            }, 0);
        },

        // Generar SKU automàtic
        generateSKU(category, name) {
            const categoryCode = category.substring(0, 3).toUpperCase();
            const nameCode = name.replace(/\s+/g, '').substring(0, 5).toUpperCase();
            const timestamp = Date.now().toString().slice(-4);
            return `${categoryCode}-${nameCode}-${timestamp}`;
        },

        // Validar moviment d'stock
        validateMovement(currentStock, type, quantity) {
            if (type === 'out' && quantity > currentStock) {
                return {
                    valid: false,
                    error: 'No es pot treure més stock del disponible'
                };
            }

            if (quantity <= 0) {
                return {
                    valid: false,
                    error: 'La quantitat ha de ser positiva'
                };
            }

            return { valid: true };
        },

        // Calcular nou stock després moviment
        calculateNewStock(currentStock, type, quantity) {
            switch (type) {
                case 'in':
                    return currentStock + quantity;
                case 'out':
                    return Math.max(0, currentStock - quantity);
                case 'adjustment':
                    return quantity; // Ajust absolut
                default:
                    return currentStock;
            }
        },

        // Obtenir raó per defecte segons tipus
        getDefaultReason(type) {
            const defaults = {
                'in': 'purchase',
                'out': 'sale',
                'adjustment': 'inventory_count'
            };
            return defaults[type] || 'other';
        },

        // Formatear article per resposta API
        formatForAPI(item) {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                category: item.category,
                sku: item.sku,
                price: parseFloat(item.price),
                cost_price: item.cost_price ? parseFloat(item.cost_price) : null,
                stock: parseInt(item.stock),
                min_stock: parseInt(item.min_stock),
                max_stock: item.max_stock ? parseInt(item.max_stock) : null,
                total_sold: parseInt(item.total_sold),
                total_purchased: parseInt(item.total_purchased),
                active: item.active,
                is_low_stock: this.isLowStock(item),
                stock_value: (item.stock * item.price).toFixed(2),
                stock_cost: item.cost_price ? (item.stock * item.cost_price).toFixed(2) : null,
                last_movement_date: item.last_movement_date,
                last_sale_date: item.last_sale_date,
                image_url: item.image_url,
                created_at: item.created_at,
                updated_at: item.updated_at
            };
        },

        // Formatear moviment per resposta API
        formatMovementForAPI(movement) {
            return {
                id: movement.id,
                inventory_id: movement.inventory_id,
                type: movement.type,
                quantity: parseInt(movement.quantity),
                previous_stock: parseInt(movement.previous_stock),
                new_stock: parseInt(movement.new_stock),
                reason: movement.reason,
                notes: movement.notes,
                reference: movement.reference,
                user_id: movement.user_id,
                movement_date: movement.movement_date,
                created_at: movement.created_at
            };
        }
    },

    // 📊 CONSULTES PREDEFINIDES
    queries: {
        // Articles amb stock baix
        lowStockQuery: `
            SELECT * FROM inventory 
            WHERE stock <= min_stock 
            AND active = true 
            ORDER BY (stock::float / min_stock::float) ASC
        `,

        // Articles més venuts
        topSellingQuery: `
            SELECT * FROM inventory 
            WHERE total_sold > 0 
            ORDER BY total_sold DESC 
            LIMIT 10
        `,

        // Moviments recents
        recentMovementsQuery: `
            SELECT im.*, i.name as item_name, i.category 
            FROM inventory_movements im
            JOIN inventory i ON im.inventory_id = i.id
            ORDER BY im.movement_date DESC
            LIMIT 50
        `,

        // Estadístiques per categoria
        categoryStatsQuery: `
            SELECT 
                category,
                COUNT(*) as total_items,
                SUM(stock) as total_stock,
                SUM(stock * price) as total_value,
                AVG(stock) as avg_stock,
                COUNT(CASE WHEN stock <= min_stock THEN 1 END) as low_stock_count
            FROM inventory 
            WHERE active = true
            GROUP BY category
            ORDER BY total_value DESC
        `
    }
};

module.exports = InventoryModel;