const BookingModel = {
    tableName: 'bookings',

    schema: {
        id: 'uuid PRIMARY KEY DEFAULT uuid_generate_v4()',
        client_id: 'uuid REFERENCES clients(id) ON DELETE CASCADE',
        booking_date: 'DATE NOT NULL',
        booking_time: 'TIME NOT NULL',
        people_count: 'INTEGER NOT NULL DEFAULT 1',
        piece_type: 'VARCHAR(50) NOT NULL', // tassa, plat, decorativa, grup
        total_price: 'DECIMAL(8,2) NOT NULL',
        deposit_paid: 'DECIMAL(8,2) DEFAULT 0.00',
        status: 'VARCHAR(20) DEFAULT \'pending\'', // pending, confirmed, in_progress, completed, cancelled, no_show
        notes: 'TEXT',
        special_requests: 'TEXT',
        reminder_sent: 'BOOLEAN DEFAULT false',
        confirmation_sent: 'BOOLEAN DEFAULT false',
        payment_method: 'VARCHAR(20)', // cash, card, online, bank_transfer
        payment_status: 'VARCHAR(20) DEFAULT \'pending\'', // pending, partial, paid, refunded
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
    },

    validation: {
        required: ['client_id', 'booking_date', 'booking_time', 'people_count', 'piece_type', 'total_price'],
        piece_type: ['tassa', 'plat', 'decorativa', 'grup'],
        status: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
        payment_method: ['cash', 'card', 'online', 'bank_transfer'],
        payment_status: ['pending', 'partial', 'paid', 'refunded']
    },

    relationships: {
        belongsTo: ['client'],
        hasMany: ['pieces']
    }
};
