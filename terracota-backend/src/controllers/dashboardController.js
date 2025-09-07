const { supabase } = require('../config/supabase')

const dashboardController = {
    // Estadístiques generals
    async getStats(req, res, next) {
        try {
            console.log('📊 Obtenint estadístiques...');

            // Estadístiques bàsiques
            const [
                { count: totalBookings },
                { count: totalClients },
                { count: pendingBookings },
                { count: todayBookings }
            ] = await Promise.all([
                supabase.from('bookings').select('*', { count: 'exact', head: true }),
                supabase.from('clients').select('*', { count: 'exact', head: true }),
                supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('booking_date', new Date().toISOString().split('T')[0])
            ]);

            // Ingressos total (aproximat)
            const { data: bookingsWithPrice } = await supabase
                .from('bookings')
                .select('total_price')
                .neq('status', 'cancelled');

            const totalRevenue = bookingsWithPrice?.reduce((sum, booking) => sum + parseFloat(booking.total_price || 0), 0) || 0;

            // Peces més populars
            const { data: popularPieces } = await supabase
                .from('bookings')
                .select('piece_type')
                .neq('status', 'cancelled');

            const pieceStats = popularPieces?.reduce((acc, booking) => {
                acc[booking.piece_type] = (acc[booking.piece_type] || 0) + 1;
                return acc;
            }, {}) || {};

            const mostPopularPiece = Object.entries(pieceStats).sort(([, a], [, b]) => b - a)[0];

            res.json({
                success: true,
                stats: {
                    totalBookings: totalBookings || 0,
                    totalClients: totalClients || 0,
                    pendingBookings: pendingBookings || 0,
                    todayBookings: todayBookings || 0,
                    totalRevenue: totalRevenue.toFixed(2),
                    mostPopularPiece: mostPopularPiece ? {
                        type: mostPopularPiece[0],
                        count: mostPopularPiece[1]
                    } : null
                },
                pieceStats
            });

        } catch (error) {
            console.error('❌ Error obtenint estadístiques:', error);
            next(error);
        }
    },

    // Reserves d'avui
    async getTodayBookings(req, res, next) {
        try {
            const today = new Date().toISOString().split('T')[0];
            console.log('📅 Obtenint reserves d\'avui:', today);

            const { data: bookings, error } = await supabase
                .from('bookings')
                .select(`
          *,
          clients (*),
          pieces (*)
        `)
                .eq('booking_date', today)
                .order('booking_time', { ascending: true });

            if (error) throw error;

            res.json({
                success: true,
                date: today,
                bookings: bookings || [],
                count: bookings?.length || 0
            });

        } catch (error) {
            console.error('❌ Error obtenint reserves d\'avui:', error);
            next(error);
        }
    },

    // Inventari amb alertes
    async getInventoryAlerts(req, res, next) {
        try {
            const { data: lowStock, error } = await supabase
                .from('inventory')
                .select('*')
                .filter('stock_quantity', 'lte', 'min_stock')
                .eq('active', true);

            if (error) throw error;

            res.json({
                success: true,
                alerts: lowStock || [],
                count: lowStock?.length || 0
            });

        } catch (error) {
            console.error('❌ Error obtenint alertes inventari:', error);
            next(error);
        }
    }
};

module.exports = dashboardController;