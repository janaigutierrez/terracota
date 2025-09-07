const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('./logger');

class DatabaseUtils {

    // Execució segura de queries amb retry
    static async safeQuery(operation, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const result = await operation();
                return result;
            } catch (error) {
                logger.logDatabaseError(`Query attempt ${attempt}`, error);

                if (attempt === retries) {
                    throw error;
                }

                // Esperar abans del retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }

    // Paginació estàndard
    static async paginate(query, page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        const countQuery = query.select('*', { count: 'exact', head: true });
        const dataQuery = query.range(offset, offset + limit - 1);

        const [countResult, dataResult] = await Promise.all([
            countQuery,
            dataQuery
        ]);

        if (countResult.error) throw countResult.error;
        if (dataResult.error) throw dataResult.error;

        const totalItems = countResult.count;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: dataResult.data,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    }

    // Cerca amb filtrers múltiples
    static buildFilters(query, filters = {}) {
        let filteredQuery = query;

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    filteredQuery = filteredQuery.in(key, value);
                } else if (typeof value === 'string' && value.includes('*')) {
                    // Wildcard search
                    const pattern = value.replace(/\*/g, '%');
                    filteredQuery = filteredQuery.like(key, pattern);
                } else {
                    filteredQuery = filteredQuery.eq(key, value);
                }
            }
        });

        return filteredQuery;
    }

    // Transacció simulada (Supabase no té transaccions natives)
    static async transaction(operations) {
        const results = [];
        const rollbackOperations = [];

        try {
            for (const operation of operations) {
                const result = await operation.execute();
                results.push(result);

                if (operation.rollback) {
                    rollbackOperations.push(operation.rollback);
                }
            }

            return results;
        } catch (error) {
            // Intentar rollback
            logger.error('Transaction failed, attempting rollback', { error: error.message });

            for (const rollback of rollbackOperations.reverse()) {
                try {
                    await rollback();
                } catch (rollbackError) {
                    logger.error('Rollback failed', { error: rollbackError.message });
                }
            }

            throw error;
        }
    }

    // Obtenir estadístiques ràpides
    static async getQuickStats() {
        try {
            const [
                clientsCount,
                bookingsCount,
                todayBookings,
                pendingPieces
            ] = await Promise.all([
                supabase.from('clients').select('*', { count: 'exact', head: true }),
                supabase.from('bookings').select('*', { count: 'exact', head: true }),
                supabase.from('bookings').select('*', { count: 'exact', head: true })
                    .eq('booking_date', new Date().toISOString().split('T')[0]),
                supabase.from('pieces').select('*', { count: 'exact', head: true })
                    .in('status', ['painting', 'drying', 'firing'])
            ]);

            return {
                totalClients: clientsCount.count || 0,
                totalBookings: bookingsCount.count || 0,
                todayBookings: todayBookings.count || 0,
                pendingPieces: pendingPieces.count || 0
            };
        } catch (error) {
            logger.logDatabaseError('Quick stats', error);
            throw error;
        }
    }

    // Health check de la base de dades
    static async healthCheck() {
        try {
            const start = Date.now();
            await supabase.from('clients').select('id').limit(1);
            const responseTime = Date.now() - start;

            return {
                status: 'healthy',
                responseTime: `${responseTime}ms`
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message
            };
        }
    }
}

module.exports = DatabaseUtils;