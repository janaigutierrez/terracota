require('dotenv').config({ path: '.env.test' });

// Mock de Supabase per testing
const mockSupabase = {
    from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        single: jest.fn(),
        range: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis()
    }))
};

// Mock global de supabase
jest.mock('../src/config/supabase', () => ({
    supabase: mockSupabase,
    supabaseAdmin: mockSupabase
}));

// Configuració Jest
beforeAll(() => {
    console.log('🧪 Iniciant tests Terracotta...');
});

afterAll(() => {
    console.log('✅ Tests completats!');
});

// Helper per resetear mocks
global.resetMocks = () => {
    jest.clearAllMocks();
};

module.exports = { mockSupabase };