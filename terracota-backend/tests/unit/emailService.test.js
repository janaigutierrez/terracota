const emailService = require('../../src/services/emailService');

// Mock nodemailer
jest.mock('nodemailer', () => ({
    createTransporter: jest.fn(() => ({
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
    }))
}));

describe('EmailService', () => {
    const mockClient = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com'
    };

    const mockBooking = {
        id: '456',
        booking_date: '2025-12-25',
        booking_time: '15:00',
        piece_type: 'tassa',
        people_count: 2,
        total_price: 16.00
    };

    beforeEach(() => {
        resetMocks();
    });

    describe('sendBookingConfirmation', () => {
        test('should send booking confirmation email', async () => {
            const result = await emailService.sendBookingConfirmation(mockBooking, mockClient);

            expect(result.success).toBe(true);
            expect(result.messageId).toBe('test-message-id');
        });
    });

    describe('sendPieceReadyNotification', () => {
        test('should send piece ready notification', async () => {
            const mockPiece = {
                id: '789',
                piece_type: 'plat',
                painting_date: '2025-12-20'
            };

            const result = await emailService.sendPieceReadyNotification(mockPiece, mockClient);

            expect(result.success).toBe(true);
            expect(result.messageId).toBe('test-message-id');
        });
    });

    describe('sendBookingReminder', () => {
        test('should send booking reminder', async () => {
            const result = await emailService.sendBookingReminder(mockBooking, mockClient);

            expect(result.success).toBe(true);
            expect(result.messageId).toBe('test-message-id');
        });
    });
});