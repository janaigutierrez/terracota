const { supabase } = require('../config/supabase');

const dashboardController = {
    // 📊 ESTADÍSTIQUES PRINCIPALS DASHBOARD
    async getStats(req, res, next) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const thisMonth = new Date().toISOString().slice(0, 7);
            const startOfMonth = `${thisMonth}-01`;

            // Queries paral·leles per rendiment
            const [
                { data: todayBookings },
                { data: monthBookings },
                { data: totalClients },
                { data: lowStockItems },
                { data: pendingPieces }
            ] = await Promise.all([
                // Reserves d'avui
                supabase
                    .from('bookings')
                    .select('*, clients(name)')
                    .eq('booking_date', today)
                    .order('booking_time'),

                // Reserves del mes
                supabase
                    .from('bookings')
                    .select('total_paid, final_total, status')
                    .gte('booking_date', startOfMonth),

                // Total clients
                supabase
                    .from('clients')
                    .select('id')
                    .eq('status', 'active'),

                // Stock baix
                supabase
                    .from('inventory')
                    .select('piece_name, stock_quantity, min_stock')
                    .eq('active', true)
                    .lt('stock_quantity', 'min_stock'),

                // Peces pendents de cuinar/entregar
                supabase
                    .from('pieces')
                    .select('status')
                    .in('status', ['painting', 'cooking'])
            ]);

            // Calcular estadístiques d'avui
            const todayStats = {
                total: todayBookings?.length || 0,
                confirmed: todayBookings?.filter(b => b.status === 'confirmed').length || 0,
                attended: todayBookings?.filter(b => b.status === 'attended').length || 0,
                completed: todayBookings?.filter(b => b.status === 'completed').length || 0,
                cancelled: todayBookings?.filter(b => ['cancelled', 'no_show'].includes(b.status)).length || 0,
                expectedRevenue: todayBookings
                    ?.filter(b => ['confirmed', 'attended'].includes(b.status))
                    .reduce((sum, b) => sum + parseFloat(b.total_paid), 0) || 0,
                actualRevenue: todayBookings
                    ?.filter(b => b.status === 'completed')
                    .reduce((sum, b) => sum + parseFloat(b.final_total || b.total_paid), 0) || 0
            };

            // Calcular estadístiques del mes
            const monthStats = {
                totalBookings: monthBookings?.length || 0,
                revenue: monthBookings
                    ?.filter(b => ['completed', 'attended'].includes(b.status))
                    .reduce((sum, b) => sum + parseFloat(b.final_total || b.total_paid), 0) || 0,
                avgBookingValue: monthBookings?.length > 0
                    ? (monthBookings.reduce((sum, b) => sum + parseFloat(b.total_paid), 0) / monthBookings.length).toFixed(2)
                    : 0
            };

            // Alertes
            const alerts = {
                stockAlerts: lowStockItems?.length || 0,
                pendingPieces: pendingPieces?.length || 0,
                lowStockItems: lowStockItems?.map(item => ({
                    name: item.piece_name,
                    current: item.stock_quantity,
                    minimum: item.min_stock
                })) || []
            };

            res.json({
                success: true,
                dashboard: {
                    today: todayStats,
                    month: monthStats,
                    totals: {
                        clients: totalClients?.length || 0
                    },
                    alerts,
                    lastUpdated: new Date().toISOString()
                }
            });

        } catch (error) {
            console.error('❌ Error obtenint estadístiques dashboard:', error);
            next(error);
        }
    },

    // 📅 RESUM DEL DIA ACTUAL
    async getTodaySummary(req, res, next) {
        try {
            const today = new Date().toISOString().split('T')[0];

            const { data: bookings, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    clients (
                        name,
                        email,
                        phone
                    )
                `)
                .eq('booking_date', today)
                .order('booking_time', { ascending: true });

            if (error) throw error;

            // Agrupar per franges horàries
            const timeSlots = {};
            bookings?.forEach(booking => {
                const hour = booking.booking_time.slice(0, 2);
                const slot = `${hour}:00`;

                if (!timeSlots[slot]) {
                    timeSlots[slot] = [];
                }

                timeSlots[slot].push({
                    id: booking.id,
                    clientName: booking.clients.name,
                    clientPhone: booking.clients.phone,
                    people: booking.people_count,
                    totalPaid: booking.total_paid,
                    status: booking.status,
                    time: booking.booking_time,
                    canRefund: new Date() < new Date(booking.refundable_until),
                    notes: booking.notes
                });
            });

            // Calcular métriques del dia
            const metrics = {
                totalBookings: bookings?.length || 0,
                totalPeople: bookings?.reduce((sum, b) => sum + b.people_count, 0) || 0,
                expectedRevenue: bookings?.reduce((sum, b) => sum + parseFloat(b.total_paid), 0) || 0,
                statusCounts: {
                    confirmed: bookings?.filter(b => b.status === 'confirmed').length || 0,
                    attended: bookings?.filter(b => b.status === 'attended').length || 0,
                    completed: bookings?.filter(b => b.status === 'completed').length || 0,
                    cancelled: bookings?.filter(b => ['cancelled', 'no_show'].includes(b.status)).length || 0
                }
            };

            res.json({
                success: true,
                today: {
                    date: today,
                    metrics,
                    timeSlots,
                    bookings: bookings || []
                }
            });

        } catch (error) {
            console.error('❌ Error obtenint resum del dia:', error);
            next(error);
        }
    },

    // 💰 INGRESSOS PER PERÍODE
    async getRevenue(req, res, next) {
        try {
            const { period = 'month', startDate, endDate } = req.query;

            let query = supabase
                .from('bookings')
                .select('booking_date, total_paid, final_total, status, people_count')
                .in('status', ['completed', 'attended', 'confirmed']);

            // Filtrar per període
            if (period === 'week') {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                query = query.gte('booking_date', weekAgo.toISOString().split('T')[0]);
            } else if (period === 'month') {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                query = query.gte('booking_date', monthAgo.toISOString().split('T')[0]);
            } else if (startDate && endDate) {
                query = query.gte('booking_date', startDate).lte('booking_date', endDate);
            }

            const { data: bookings, error } = await query.order('booking_date');
            if (error) throw error;

            // Agrupar per dia
            const dailyRevenue = {};
            bookings?.forEach(booking => {
                const date = booking.booking_date;
                const revenue = parseFloat(booking.final_total || booking.total_paid);

                if (!dailyRevenue[date]) {
                    dailyRevenue[date] = {
                        date,
                        revenue: 0,
                        bookings: 0,
                        people: 0
                    };
                }

                dailyRevenue[date].revenue += revenue;
                dailyRevenue[date].bookings += 1;
                dailyRevenue[date].people += booking.people_count;
            });

            const revenueData = Object.values(dailyRevenue).sort((a, b) => a.date.localeCompare(b.date));

            // Calcular totals
            const totals = {
                revenue: revenueData.reduce((sum, day) => sum + day.revenue, 0),
                bookings: revenueData.reduce((sum, day) => sum + day.bookings, 0),
                people: revenueData.reduce((sum, day) => sum + day.people, 0),
                avgDailyRevenue: revenueData.length > 0
                    ? (revenueData.reduce((sum, day) => sum + day.revenue, 0) / revenueData.length).toFixed(2)
                    : 0
            };

            res.json({
                success: true,
                period,
                revenue: {
                    daily: revenueData,
                    totals
                }
            });

        } catch (error) {
            console.error('❌ Error obtenint ingressos:', error);
            next(error);
        }
    },

    // 🏺 ESTAT PECES EN PRODUCCIÓ
    async getPiecesStatus(req, res, next) {
        try {
            const { data: pieces, error } = await supabase
                .from('pieces')
                .select(`
                    *,
                    bookings (
                        booking_date,
                        clients (name, phone)
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Agrupar per estat
            const statusGroups = {
                painting: pieces?.filter(p => p.status === 'painting') || [],
                cooking: pieces?.filter(p => p.status === 'cooking') || [],
                ready: pieces?.filter(p => p.status === 'ready') || [],
                delivered: pieces?.filter(p => p.status === 'delivered') || []
            };

            // Calcular estadístiques
            const stats = {
                total: pieces?.length || 0,
                pending: statusGroups.painting.length + statusGroups.cooking.length,
                readyForPickup: statusGroups.ready.length,
                overdue: statusGroups.ready.filter(p => {
                    const readyDate = new Date(p.ready_date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return readyDate < weekAgo;
                }).length
            };

            res.json({
                success: true,
                pieces: {
                    byStatus: statusGroups,
                    stats
                }
            });

        } catch (error) {
            console.error('❌ Error obtenint estat peces:', error);
            next(error);
        }
    }
};

module.exports = dashboardController;