
import { useState, useEffect } from 'react';
import { Calendar, RefreshCw, Clock, CheckCircle, DollarSign } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/admin/common/StatCard';
import SearchFilter from '../../components/admin/common/SearchFilter';
import BookingCard from '../../components/admin/reserves/BookingCard';
import PieceSelectionModal from '../../components/admin/reserves/pieceSelectionModal';
import LoadingSpinner from '../../components/admin/common/LoadingSpinner';
import { useBookings } from '../../hooks/useBookings';
import { isAuthenticated } from '../../utils/constants';

const AdminReserves = () => {
    const {
        todayBookings,
        stats,
        loading,
        refreshing,
        selectedBooking,
        setSelectedBooking,
        filterStatus,
        setFilterStatus,
        searchTerm,
        setSearchTerm,
        markAsAttended,
        updateStatus,
        completeBooking,
        refreshData,
        filteredBookings
    } = useBookings();

    const [showPieceModal, setShowPieceModal] = useState(false);

    const handleSelectPieces = (booking) => {
        setSelectedBooking(booking);
        setShowPieceModal(true);
    };

    const handleCompletBooking = async (bookingData) => {
        try {
            await completeBooking(bookingData);
            setShowPieceModal(false);
            setSelectedBooking(null);
        } catch (error) {
            console.error('Error completant reserva:', error);
        }
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/admin';
            return;
        }
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner message="Carregant reserves..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Reserves d'Avui</h1>
                        <p className="text-sm text-gray-600">
                            {new Date().toLocaleDateString('ca-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <button
                        onClick={refreshData}
                        disabled={refreshing}
                        className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span>Actualitzar</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Reserves"
                        value={stats.total || 0}
                        icon={Calendar}
                        color="blue"
                    />
                    <StatCard
                        title="Confirmades"
                        value={stats.confirmed || 0}
                        icon={Clock}
                        color="yellow"
                    />
                    <StatCard
                        title="Completades"
                        value={stats.completed || 0}
                        icon={CheckCircle}
                        color="green"
                    />
                    <StatCard
                        title="Ingressos Esperats"
                        value={`€${(stats.expectedRevenue || 0).toFixed(2)}`}
                        icon={DollarSign}
                        color="terracotta"
                    />
                </div>

                {/* Search & Filters */}
                <SearchFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Buscar per nom o email..."
                    filterValue={filterStatus}
                    onFilterChange={setFilterStatus}
                    filterOptions={[
                        { value: 'all', label: 'Tots els estats' },
                        { value: 'confirmed', label: 'Confirmades' },
                        { value: 'attended', label: 'Han arribat' },
                        { value: 'completed', label: 'Completades' },
                        { value: 'cancelled', label: 'Cancel·lades' },
                        { value: 'no_show', label: 'No han vingut' }
                    ]}
                />

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No hi ha reserves per avui amb aquests filtres</p>
                        </div>
                    ) : (
                        filteredBookings.map(booking => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onMarkAttended={markAsAttended}
                                onUpdateStatus={updateStatus}
                                onSelectPieces={() => handleSelectPieces(booking)}
                            />
                        ))
                    )}
                </div>

                {/* Piece Selection Modal */}
                <PieceSelectionModal
                    isOpen={showPieceModal}
                    onClose={() => {
                        setShowPieceModal(false);
                        setSelectedBooking(null);
                    }}
                    booking={selectedBooking}
                    onComplete={handleCompletBooking}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminReserves;
