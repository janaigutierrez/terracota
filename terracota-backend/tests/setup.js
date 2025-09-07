require('dotenv').config({ path: '.env.test' });

// Mock de Supabase per testing
const mockSupabaseResponse = {
    data: null,
    error: null,
    count: 0
};

const mockSupabaseQuery = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(mockSupabaseResponse),
    range: jest.fn().mockResolvedValue(mockSupabaseResponse),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis()
};

const mockSupabase = {
    from: jest.fn(() => mockSupabaseQuery)
};

// Mock global de supabase
jest.mock('../src/config/supabase', () => ({
    supabase: mockSupabase,
    supabaseAdmin: mockSupabase
}));

// Mock nodemailer per defecte
jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: jest.fn().mockResolvedValue({
            messageId: 'test-message-id',
            response: '250 Message queued'
        })
    }))
}));

// Mock console.log per evitar spam en tests
const originalConsole = console.log;
console.log = jest.fn();

// Configuració Jest
beforeAll(() => {
    console.log('🧪 Iniciant tests Terracotta...');
});

afterAll(() => {
    console.log('✅ Tests completats!');
    // Restaurar console.log original
    console.log = originalConsole;
});

beforeEach(() => {
    // Reset tots els mocks abans de cada test
    jest.clearAllMocks();
});

// Helper per resetear mocks (mantenim per compatibilitat)
global.resetMocks = () => {
    jest.clearAllMocks();
};

// Helper per configurar respostes mock
global.mockSupabaseResponse = (data, error = null, count = null) => {
    const response = { data, error };
    if (count !== null) response.count = count;

    mockSupabaseQuery.single.mockResolvedValue(response);
    mockSupabaseQuery.range.mockResolvedValue(response);
    return response;
};

// Helper per simular errors de Supabase
global.mockSupabaseError = (errorCode, message = 'Test error') => {
    const error = { code: errorCode, message };
    mockSupabaseQuery.single.mockResolvedValue({ data: null, error });
    mockSupabaseQuery.range.mockResolvedValue({ data: null, error });
    return error;
};

// Export per usar en tests
module.exports = {
    mockSupabase,
    mockSupabaseQuery,
    mockSupabaseResponse: (data, error, count) => mockSupabaseResponse(data, error, count),
    mockSupabaseError: (code, message) => mockSupabaseError(code, message)
};