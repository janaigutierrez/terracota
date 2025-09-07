const bookingController = require('../../src/controllers/bookingController');
const { mockSupabase } = require('../setup');

// Mock express-validator correcte
jest.mock('express-validator', () => ({
    validationResult: jest.fn(),
    body: jest.fn(() => ({
        isEmail: jest.fn().mockReturnThis(),
        isLength: jest.fn().mockReturnThis(),
        notEmpty: jest.fn().mockReturnThis(),
        isNumeric: jest.fn().mockReturnThis(),
        isISO8601: jest.fn().mockReturnThis(),
        withMessage: jest.fn().mockReturnThis()
    }))
}));

describe('BookingController', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();

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

            // Mock validació sense errors
            const { validationResult } = require('express-validator');
            validationResult.mockReturnValue({
                isEmpty: () => true,
                array: () => []
            });

            // Mock resposta Supabase - buscar client existent
            mockSupabase.from().select().eq().single.mockResolvedValueOnce({
                data: null, // No client existent
                error: { code: 'PGRST116' } // Not found
            });

            // Mock crear nou client
            mockSupabase.from().insert().select().single.mockResolvedValueOnce({
                data: {
                    id: '123',
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '666123456'
                },
                error: null
            });

            // Mock crear reserva
            mockSupabase.from().insert().select().single.mockResolvedValueOnce({
                data: {
                    id: '456',
                    client_id: '123',
                    booking_date: '2025-12-25',
                    booking_time: '15:00',
                    piece_type: 'tassa',
                    people_count: 2,
                    total_price: 16.00,
                    status: 'pending',
                    clients: {
                        id: '123',
                        name: 'Test User',
                        email: 'test@example.com'
                    }
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
            const { validationResult } = require('express-validator');
            validationResult.mockReturnValue({
                isEmpty: () => false,
                array: () => [
                    { field: 'email', msg: 'Email no vàlid' },
                    { field: 'name', msg: 'Nom és obligatori' }
                ]
            });

            await bookingController.createBooking(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Validation Error',
                    details: expect.any(Array)
                })
            );
        });

        test('should handle database errors', async () => {
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

            // Mock validació OK
            const { validationResult } = require('express-validator');
            validationResult.mockReturnValue({
                isEmpty: () => true
            });

            // Mock error base de dades
            mockSupabase.from().select().eq().single.mockRejectedValue(
                new Error('Database connection failed')
            );

            await bookingController.createBooking(req, res, next);

            expect(next).toHaveBeenCalledWith(
                expect.any(Error)
            );
        });
    });

    describe('getBookings', () => {
        test('should return bookings list', async () => {
            const mockBookings = [
                {
                    id: '1',
                    client_id: '123',
                    booking_date: '2025-12-25',
                    clients: { name: 'Test User 1' }
                },
                {
                    id: '2',
                    client_id: '456',
                    booking_date: '2025-12-26',
                    clients: { name: 'Test User 2' }
                }
            ];

            mockSupabase.from().select().order().range.mockResolvedValue({
                data: mockBookings,
                error: null,
                count: 2
            });

            await bookingController.getBookings(req, res, next);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    bookings: mockBookings,
                    pagination: expect.any(Object)
                })
            );
        });

        test('should filter by status', async () => {
            req.query.status = 'pending';

            const mockBookings = [
                {
                    id: '1',
                    status: 'pending',
                    clients: { name: 'Test User' }
                }
            ];

            mockSupabase.from().select().eq().order().range.mockResolvedValue({
                data: mockBookings,
                error: null,
                count: 1
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

    describe('getBookingById', () => {
        test('should return specific booking', async () => {
            req.params.id = '123';

            const mockBooking = {
                id: '123',
                booking_date: '2025-12-25',
                clients: { name: 'Test User' }
            };

            mockSupabase.from().select().eq().single.mockResolvedValue({
                data: mockBooking,
                error: null
            });

            await bookingController.getBookingById(req, res, next);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    booking: mockBooking
                })
            );
        });

        test('should handle booking not found', async () => {
            req.params.id = '999';

            mockSupabase.from().select().eq().single.mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' }
            });

            await bookingController.getBookingById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: 'Reserva no trobada'
                })
            );
        });
    });

    describe('updateBooking', () => {
        test('should update booking successfully', async () => {
            req.params.id = '123';
            req.body = {
                status: 'confirmed',
                notes: 'Actualització de test'
            };

            const updatedBooking = {
                id: '123',
                status: 'confirmed',
                notes: 'Actualització de test'
            };

            mockSupabase.from().update().eq().select().single.mockResolvedValue({
                data: updatedBooking,
                error: null
            });

            await bookingController.updateBooking(req, res, next);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    booking: updatedBooking
                })
            );
        });
    });

    describe('deleteBooking', () => {
        test('should delete booking successfully', async () => {
            req.params.id = '123';

            mockSupabase.from().delete().eq().mockResolvedValue({
                error: null
            });

            await bookingController.deleteBooking(req, res, next);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Reserva eliminada correctament'
                })
            );
        });
    });
});