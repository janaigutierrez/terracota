import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../utils/constants';

export const useBookings = (dateFilter = 'today') => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // UI State
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data per testing
    const mockBookings = [
        {
            id: 1,
            booking_date: new Date().toISOString().split('T')[0],
            booking_time: '10:00',
            people_count: 2,
            total_paid: 16,
            status: 'confirmed',
            clients: {
                name: 'Maria García',
                email: 'maria@email.com',
                phone: '666123456'
            },
            notes: 'Aniversari de parella',
            attended_people: null,
            selected_pieces: null,
            final_total: null,
            extra_paid: null,
            credit_generated: null
        },
        {
            id: 2,
            booking_date: new Date().toISOString().split('T')[0],
            booking_time: '16:30',
            people_count: 4,
            total_paid: 32,
            status: 'attended',
            clients: {
                name: 'Família Martínez',
                email: 'martinez@email.com',
                phone: '677987654'
            },
            notes: null,
            attended_people: 4,
            selected_pieces: null,
            final_total: null,
            extra_paid: null,
            credit_generated: null
        },
        {
            id: 3,
            booking_date: new Date().toISOString().split('T')[0],
            booking_time: '18:00',
            people_count: 3,
            total_paid: 24,
            status: 'completed',
            clients: {
                name: 'Joan Pérez',
                email: 'joan@email.com',
                phone: '688456789'
            },
            notes: null,
            attended_people: 3,
            selected_pieces: [
                { person: 1, piece: 'tassa-gran', price: 10 },
                { person: 2, piece: 'plat-mitjà', price: 8 },
                { person: 3, piece: 'bol-petit', price: 6 }
            ],
            final_total: 24,
            extra_paid: 0,
            credit_generated: 0
        }
    ];

    // Carregar reserves
    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Implementar endpoint backend real
            // const response = await apiRequest(`/bookings/admin/${dateFilter}`);

            // Simulem dades
            setTimeout(() => {
                setBookings(mockBookings);
                setStats({
                    total: mockBookings.length,
                    confirmed: mockBookings.filter(b => b.status === 'confirmed').length,
                    attended: mockBookings.filter(b => b.status === 'attended').length,
                    completed: mockBookings.filter(b => b.status === 'completed').length,
                    cancelled: mockBookings.filter(b => b.status === 'cancelled').length,
                    no_show: mockBookings.filter(b => b.status === 'no_show').length,
                    expectedRevenue: mockBookings.reduce((sum, b) => sum + b.total_paid, 0)
                });
                setLoading(false);
            }, 500);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, [dateFilter]);

    // Refrescar dades
    const refreshData = useCallback(async () => {
        setRefreshing(true);
        await fetchBookings();
        setRefreshing(false);
    }, [fetchBookings]);

    // Marcar com attended
    const markAsAttended = useCallback(async (bookingId, attendedPeople) => {
        try {
            // TODO: API call
            setBookings(prev => prev.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: 'attended', attended_people: attendedPeople }
                    : booking
            ));

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    // Actualitzar status
    const updateStatus = useCallback(async (bookingId, newStatus) => {
        try {
            setBookings(prev => prev.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: newStatus }
                    : booking
            ));
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    // Completar reserva amb peces
    const completeBooking = useCallback(async (completionData) => {
        try {
            const { bookingId, selectedPieces, finalTotal, extraPaid, creditGenerated } = completionData;

            setBookings(prev => prev.map(booking =>
                booking.id === bookingId
                    ? {
                        ...booking,
                        status: 'completed',
                        selected_pieces: selectedPieces,
                        final_total: finalTotal,
                        extra_paid: extraPaid,
                        credit_generated: creditGenerated
                    }
                    : booking
            ));

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    // Filtrar reserves
    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        const matchesSearch = !searchTerm || (
            booking.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.clients?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesStatus && matchesSearch;
    });

    // Alias per compatibilitat
    const todayBookings = filteredBookings;

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return {
        // Data
        bookings,
        todayBookings,
        filteredBookings,
        stats,
        loading,
        error,
        refreshing,

        // UI State
        selectedBooking,
        setSelectedBooking,
        filterStatus,
        setFilterStatus,
        searchTerm,
        setSearchTerm,

        // Actions
        markAsAttended,
        updateStatus,
        completeBooking,
        refreshData,
        refetch: fetchBookings
    };
};