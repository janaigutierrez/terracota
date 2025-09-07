const bookingController = require('../../src/controllers/bookingController');
const { mockSupabase } = require('../setup');

describe('BookingController', () => {
    let req, res, next;

    beforeEach(() => {
        resetMocks();

        req = {
            body: {},
            params: {},
            query: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        next = jest.fn();
    });

    describe('createBooking', () => {
        test('should create booking successfully', async () => {
            // Mock dades vàlides
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                phone: '666123456',
                selectedOption: 'tassa',
                date: '2025-12-25',
                time: '15:00',
                people: 2,
                totalPrice: 16.00
            };

            // Mock validació
            require('express-validator').validationResult = jest.fn(() => ({
                isEmpty: () => true
            }));

            // Mock resposta Supabase
            mockSupabase.from().select().eq().single.mockResolvedValue({
                data: null, // No client existent
                error: null
            });

            mockSupabase.from().insert().select().single.mockResolvedValue({
                data: { id: '123', name: 'Test User', email: 'test@example.com' },
                error: null
            });

            mockSupabase.from().insert().select().single.mockResolvedValue({
                data: {
                    id: '456',
                    client_id: '123',
                    booking_date: '2025-12-25',
                    booking_time: '15:00',
                    piece_type: 'tassa',
                    people_count: 2,
                    total_price: 16.00,
                    status: 'pending',
                    clients: { id: '123', name: 'Test User', email: 'test@example.com' }
                },
                error: null
            });

            await bookingController.createBooking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: expect.stringContaining('Reserva creada correctament')
                })
            );
        });

        test('should handle validation errors', async () => {
            // Mock validació amb errors
            require('express-validator').validationResult = jest.fn(() => ({
                isEmpty: () => false,
                array: () => [{ field: 'email', msg: 'Email no vàlid' }]
            }));

            await bookingController.createBooking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Validation Error'
                })
            );
        });
    });

    describe('getBookings', () => {
        test('should return bookings list', async () => {
            const mockBookings = [
                { id: '1', client_id: '123', booking_date: '2025-12-25' },
                { id: '2', client_id: '456', booking_date: '2025-12-26' }
            ];

            mockSupabase.from().select().order().range.mockResolvedValue({
                data: mockBookings,
                error: null
            });

            await bookingController.getBookings(req, res, next);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    bookings: mockBookings
                })
            );
        });
    });
});