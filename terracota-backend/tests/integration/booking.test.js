const request = require('supertest');
const app = require('../../src/app');

describe('Booking Integration Tests', () => {

    describe('POST /api/bookings', () => {
        test('should create a new booking', async () => {
            const bookingData = {
                name: 'Integration Test User',
                email: 'integration@test.com',
                phone: '666123456',
                selectedOption: 'tassa',
                date: '2025-12-25',
                time: '15:00',
                people: 1,
                totalPrice: 8.00
            };

            const response = await request(app)
                .post('/api/bookings')
                .send(bookingData)
                .expect(201);

            expect(response.body).toMatchObject({
                success: true,
                message: expect.stringContaining('Reserva creada correctament')
            });
        });

        test('should validate required fields', async () => {
            const invalidData = {
                name: 'Test',
                // Missing required fields
            };

            const response = await request(app)
                .post('/api/bookings')
                .send(invalidData)
                .expect(400);

            expect(response.body).toMatchObject({
                error: 'Validation Error'
            });
        });
    });

    describe('GET /api/bookings', () => {
        test('should return bookings list', async () => {
            const response = await request(app)
                .get('/api/bookings')
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                bookings: expect.any(Array)
            });
        });

        test('should filter by status', async () => {
            const response = await request(app)
                .get('/api/bookings?status=pending')
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                bookings: expect.any(Array)
            });
        });
    });
});