const emailService = require('../../src/services/emailService');

// Mock nodemailer correcte
jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: jest.fn().mockResolvedValue({
            messageId: 'test-message-id',
            response: '250 Message queued'
        })
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
        jest.clearAllMocks();
    });

    describe('sendBookingConfirmation', () => {
        test('should send booking confirmation email', async () => {
            const result = await emailService.sendBookingConfirmation(mockBooking, mockClient);

            expect(result.success).toBe(true);
            expect(result.messageId).toBe('test-message-id');
        });

        test('should handle email send errors', async () => {
            // Mock error
            const nodemailer = require('nodemailer');
            nodemailer.createTransport().sendMail.mockRejectedValue(
                new Error('SMTP Error')
            );

            const result = await emailService.sendBookingConfirmation(mockBooking, mockClient);

            expect(result.success).toBe(false);
            expect(result.error).toContain('SMTP Error');
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

    describe('sendContactMessage', () => {
        test('should send contact form message', async () => {
            const contactData = {
                name: 'Test User',
                email: 'test@example.com',
                subject: 'Test Subject',
                message: 'Test message content'
            };

            const result = await emailService.sendContactMessage(contactData);

            expect(result.success).toBe(true);
            expect(result.messageId).toBe('test-message-id');
        });
    });
});