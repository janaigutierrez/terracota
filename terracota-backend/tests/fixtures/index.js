const testFixtures = {

    // Client de test
    validClient: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '666123456'
    },

    invalidClient: {
        name: '',
        email: 'invalid-email',
        phone: '123'
    },

    // Reserva de test
    validBooking: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '666123456',
        selectedOption: 'tassa',
        date: '2025-12-25',
        time: '15:00',
        people: 1,
        totalPrice: 8.00
    },

    invalidBooking: {
        name: '',
        email: 'invalid',
        selectedOption: 'invalid',
        date: '2020-01-01', // Data en el passat
        time: '25:00', // Hora invàlida
        people: 0
    },

    // Peça de test
    validPiece: {
        piece_type: 'tassa',
        description: 'Tassa blava amb flors',
        colors_used: ['blau', 'blanc', 'groc'],
        status: 'painting'
    },

    // Missatge de contacte
    validContactMessage: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '666123456',
        subject: 'Test Subject',
        message: 'Aquest és un missatge de test'
    },

    // Item d'inventari
    validInventoryItem: {
        item_name: 'Tassa bisque',
        item_type: 'bisque_piece',
        category: 'tasses',
        stock_quantity: 50,
        min_stock: 10,
        cost_price: 2.50,
        sale_price: 8.00
    }
};

module.exports = testFixtures;