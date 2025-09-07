const ClientModel = {
    tableName: 'clients',

    schema: {
        id: 'uuid PRIMARY KEY DEFAULT uuid_generate_v4()',
        name: 'VARCHAR(255) NOT NULL',
        email: 'VARCHAR(255) UNIQUE NOT NULL',
        phone: 'VARCHAR(20)',
        date_of_birth: 'DATE',
        preferences: 'JSONB', // Ex: {"favorite_pieces": ["tassa", "plat"], "dietary_restrictions": []}
        notes: 'TEXT',
        total_visits: 'INTEGER DEFAULT 0',
        total_spent: 'DECIMAL(10,2) DEFAULT 0.00',
        loyalty_points: 'INTEGER DEFAULT 0',
        status: 'VARCHAR(20) DEFAULT \'active\'', // active, inactive, banned
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
    },

    validation: {
        required: ['name', 'email'],
        email: 'email',
        phone: 'phone',
        status: ['active', 'inactive', 'banned']
    },

    relationships: {
        hasMany: ['bookings', 'pieces', 'contact_messages']
    }
};