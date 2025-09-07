const ContactMessageModel = {
    tableName: 'contact_messages',

    schema: {
        id: 'uuid PRIMARY KEY DEFAULT uuid_generate_v4()',
        client_id: 'uuid REFERENCES clients(id) ON DELETE SET NULL', // Si ve d'un client existent
        name: 'VARCHAR(255) NOT NULL',
        email: 'VARCHAR(255) NOT NULL',
        phone: 'VARCHAR(20)',
        subject: 'VARCHAR(500)',
        message: 'TEXT NOT NULL',
        type: 'VARCHAR(50) DEFAULT \'general\'', // general, booking, complaint, suggestion
        status: 'VARCHAR(20) DEFAULT \'unread\'', // unread, read, replied, archived
        priority: 'VARCHAR(20) DEFAULT \'normal\'', // low, normal, high, urgent
        replied_at: 'TIMESTAMPTZ',
        replied_by: 'VARCHAR(255)', // Nom de qui ha respost
        reply_message: 'TEXT',
        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
    },

    validation: {
        required: ['name', 'email', 'message'],
        email: 'email',
        type: ['general', 'booking', 'complaint', 'suggestion'],
        status: ['unread', 'read', 'replied', 'archived'],
        priority: ['low', 'normal', 'high', 'urgent']
    },

    relationships: {
        belongsTo: ['client']
    }
};