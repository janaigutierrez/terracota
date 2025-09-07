describe('Dashboard Integration Tests', () => {

    describe('GET /api/dashboard/stats', () => {
        test('should return dashboard statistics', async () => {
            const response = await request(app)
                .get('/api/dashboard/stats')
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                stats: expect.objectContaining({
                    totalBookings: expect.any(Number),
                    totalClients: expect.any(Number),
                    pendingBookings: expect.any(Number),
                    todayBookings: expect.any(Number),
                    totalRevenue: expect.any(String)
                })
            });
        });
    });

    describe('GET /api/dashboard/today', () => {
        test('should return today\'s bookings', async () => {
            const response = await request(app)
                .get('/api/dashboard/today')
                .expect(200);

            expect(response.body).toMatchObject({
                success: true,
                date: expect.any(String),
                bookings: expect.any(Array),
                count: expect.any(Number)
            });
        });
    });
});
