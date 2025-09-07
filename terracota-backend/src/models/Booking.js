const BookingModel = {
    tableName: 'bookings',
    schema: {
        id: 'BIGSERIAL PRIMARY KEY',
        client_id: 'BIGINT REFERENCES clients(id) ON DELETE CASCADE',

        // 📅 DATA I HORA
        booking_date: 'DATE NOT NULL',
        booking_time: 'TIME NOT NULL',
        people_count: 'INTEGER NOT NULL DEFAULT 1',

        // 💰 SISTEMA PREU FIXE
        price_per_person: 'DECIMAL(8,2) DEFAULT 8.00 NOT NULL',
        total_paid: 'DECIMAL(8,2) NOT NULL',

        // 📋 POLÍTICA CANCEL·LACIONS
        refundable_until: 'TIMESTAMPTZ NOT NULL',
        non_refundable: 'BOOLEAN DEFAULT false',

        // 🔄 GESTIÓ CANVIS
        changes_allowed: 'INTEGER DEFAULT 1',
        changes_used: 'INTEGER DEFAULT 0',
        last_change_date: 'TIMESTAMPTZ',

        // 🏺 AL LOCAL
        attended_people: 'INTEGER',
        selected_pieces: 'JSONB',
        final_total: 'DECIMAL(8,2)',
        extra_paid: 'DECIMAL(8,2) DEFAULT 0.00',
        credit_generated: 'DECIMAL(8,2) DEFAULT 0.00',

        // 📝 INFO
        notes: 'TEXT',
        special_requests: 'TEXT',

        // 🔔 NOTIFICACIONS
        confirmation_sent: 'BOOLEAN DEFAULT false',
        reminder_sent: 'BOOLEAN DEFAULT false',
        pickup_notification_sent: 'BOOLEAN DEFAULT false',

        // 💳 PAGAMENT
        payment_method: 'VARCHAR(20) DEFAULT \'online\'',
        payment_status: 'VARCHAR(20) DEFAULT \'paid\'',
        stripe_payment_intent_id: 'VARCHAR(255)',

        // 📊 ESTAT
        status: 'VARCHAR(20) DEFAULT \'confirmed\'',

        created_at: 'TIMESTAMPTZ DEFAULT NOW()',
        updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
    },

    validation: {
        required: ['client_id', 'booking_date', 'booking_time', 'people_count', 'total_paid'],

        status: ['confirmed', 'attended', 'completed', 'cancelled', 'no_show', 'refunded'],
        payment_method: ['online', 'cash', 'card'],
        payment_status: ['paid', 'refunded', 'partial'],

        people_count: { min: 1, max: 8 },
        price_per_person: 8.00 // Sempre 8€
    },

    relationships: {
        belongsTo: ['client'],
        hasMany: ['pieces']
    },

    // 🎯 MÈTODES D'UTILITAT
    methods: {
        calculateRefundableUntil(bookingDate, bookingTime) {
            const bookingDateTime = new Date(`${bookingDate} ${bookingTime}`);
            const refundableUntil = new Date(bookingDateTime.getTime() - (48 * 60 * 60 * 1000));
            return refundableUntil;
        },

        canRefund(refundableUntil) {
            return new Date() < new Date(refundableUntil);
        },

        calculateTotal(peopleCount, pricePerPerson = 8.00) {
            return (peopleCount * pricePerPerson).toFixed(2);
        },

        canChange(changesUsed, changesAllowed = 1) {
            return changesUsed < changesAllowed;
        }
    }
};

module.exports = BookingModel;