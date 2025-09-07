const InventoryModel = {
    tableName: 'inventory',

    schema: {
        id: 'uuid PRIMARY KEY DEFAULT uuid_generate_v4()',
        item_name: 'VARCHAR(255) NOT NULL',
        item_type: 'VARCHAR(50) NOT NULL', // bisque_piece, paint, tool, consumable
        category: 'VARCHAR(100)', // tasses, plats, pintures, pinzells, etc.
        description: 'TEXT',
        supplier: 'VARCHAR(255)',
        sku: 'VARCHAR(100) UNIQUE',
        cost_price: 'DECIMAL(8,2)',
        sale_price: 'DECIMAL(8,2)',
        stock_quantity: 'INTEGER NOT NULL DEFAULT 0',
        min_stock: 'INTEGER DEFAULT 5', // Alerta quan baixa d'aquest nivell
        max_stock: 'INTEGER DEFAULT 100',
        unit: 'VARCHAR(20) DEFAULT \'pieces\'', // pieces, liters, kg, etc.
        location: 'VARCHAR(100)', // On està guardat al taller
        last_restocked: 'TIMESTAMPTZ',
        expiry_date: 'DATE', // Per pintures i materials que caduquen
        active: 'BOOLEAN DEFAULT true',
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
    },

    validation: {
        required: ['item_name', 'item_type', 'stock_quantity'],
        item_type: ['bisque_piece', 'paint', 'tool', 'consumable'],
        unit: ['pieces', 'liters', 'kg', 'grams', 'meters']
    },

    relationships: {
        hasMany: ['inventory_movements']
    }
};