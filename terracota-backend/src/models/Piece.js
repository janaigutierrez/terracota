const PieceModel = {
    tableName: 'pieces',

    schema: {
        id: 'uuid PRIMARY KEY DEFAULT uuid_generate_v4()',
        booking_id: 'uuid REFERENCES bookings(id) ON DELETE CASCADE',
        client_id: 'uuid REFERENCES clients(id) ON DELETE CASCADE',
        piece_type: 'VARCHAR(50) NOT NULL',
        description: 'TEXT', // Descripció de la peça pintada
        colors_used: 'JSONB', // ["blau", "vermell", "groc"]
        status: 'VARCHAR(20) DEFAULT \'painting\'', // painting, drying, firing, ready, collected
        painting_date: 'TIMESTAMPTZ DEFAULT NOW()',
        firing_start_date: 'TIMESTAMPTZ',
        firing_end_date: 'TIMESTAMPTZ',
        ready_date: 'TIMESTAMPTZ',
        collection_date: 'TIMESTAMPTZ',
        notification_sent: 'BOOLEAN DEFAULT false',
        firing_temperature: 'INTEGER', // Temperatura de cocció
        firing_batch: 'VARCHAR(50)', // Identificador del lot de cocció
        quality_check: 'VARCHAR(20)', // passed, failed, needs_repair
        notes: 'TEXT',
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
    },

    validation: {
        required: ['booking_id', 'client_id', 'piece_type'],
        piece_type: ['tassa', 'plat', 'bol', 'gerro', 'decorativa', 'altre'],
        status: ['painting', 'drying', 'firing', 'ready', 'collected'],
        quality_check: ['passed', 'failed', 'needs_repair']
    },

    relationships: {
        belongsTo: ['booking', 'client']
    }
};
