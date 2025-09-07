import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    Phone,
    Mail,
    Euro,
    Package,
    Plus,
    Minus,
    CreditCard,
    Coffee,
    Eye,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    ChevronRight,
    RefreshCw,
    Filter,
    Search,
    DollarSign
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiRequest } from '../../utils/constants';

// TODO: ARREGLAR constants.js - problema amb URL duplicada
// Actualment: baseURL = 'http://localhost:3001' + '/bookings' = INCORRECTE
// Hauria de ser: baseURL = 'http://localhost:3001' + '/api/bookings'

const AdminReserves = () => {
    const [todayBookings, setTodayBookings] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showPieceModal, setShowPieceModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    // Estats per a selecció de peces
    const [selectedPieces, setSelectedPieces] = useState([]);
    const [finalTotal, setFinalTotal] = useState(0);
    const [extraPaid, setExtraPaid] = useState(0);
    const [creditGenerated, setCreditGenerated] = useState(0);

    // Peces disponibles (simular - després connectar amb inventari)
    const availablePieces = [
        { id: 1, name: 'Tassa Petita 200ml', price: 6, category: 'tasses' },
        { id: 2, name: 'Tassa Gran 350ml', price: 8, category: 'tasses' },
        { id: 3, name: 'Tassa Temàtica', price: 10, category: 'tasses' },
        { id: 4, name: 'Plat Petit 15cm', price: 8, category: 'plats' },
        { id: 5, name: 'Plat Mitjà 20cm', price: 12, category: 'plats' },
        { id: 6, name: 'Plat Gran 25cm', price: 16, category: 'plats' },
        { id: 7, name: 'Bol Cereals', price: 7, category: 'bols' },
        { id: 8, name: 'Bol Decoratiu', price: 11, category: 'bols' },
        { id: 9, name: 'Gerro Petit', price: 12, category: 'gerros' },
        { id: 10, name: 'Gerro Gran', price: 25, category: 'gerros' },
        { id: 11, name: 'Ornament Petit', price: 6, category: 'accessoris' },
        { id: 12, name: 'Imant Nevera', price: 4, category: 'accessoris' }
    ];

    // Carregar reserves d'avui
    const fetchTodayBookings = async () => {
        try {
            setLoading(true);
            const response = await apiRequest('/bookings/admin/today');
            if (response.success) {
                setTodayBookings(response.bookings);
                setStats(response.stats);
            }
        } catch (error) {
            console.error('Error carregant reserves:', error);
        } finally {
            setLoading(false);
        }
    };

    // Refrescar dades
    const refreshData = async () => {
        setRefreshing(true);
        await fetchTodayBookings();
        setRefreshing(false);
    };

    // Marcar com attended
    const markAsAttended = async (bookingId, attendedPeople) => {
        try {
            const response = await apiRequest(`/bookings/${bookingId}/attended`, {
                method: 'PUT',
                body: JSON.stringify({ attendedPeople })
            });

            if (response.success) {
                await refreshData();
                alert('✅ Client marcat com arribat!');
            }
        } catch (error) {
            console.error('Error marcant com attended:', error);
            alert('❌ Error marcant client com arribat');
        }
    };

    // Actualitzar status
    const updateStatus = async (bookingId, newStatus) => {
        try {
            const response = await apiRequest(`/bookings/${bookingId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });

            if (response.success) {
                await refreshData();
            }
        } catch (error) {
            console.error('Error actualitzant status:', error);
            alert('❌ Error actualitzant status');
        }
    };

    // Completar reserva
    const completeBooking = async () => {
        try {
            const response = await apiRequest(`/bookings/${selectedBooking.id}/complete`, {
                method: 'PUT',
                body: JSON.stringify({
                    selectedPieces,
                    finalTotal,
                    extraPaid,
                    creditGenerated
                })
            });

            if (response.success) {
                setShowPieceModal(false);
                setSelectedBooking(null);
                setSelectedPieces([]);
                await refreshData();
                alert('🎉 Reserva completada! Peces enviades a cocció.');
            }
        } catch (error) {
            console.error('Error completant reserva:', error);
            alert('❌ Error completant reserva');
        }
    };

    // Afegir peça seleccionada
    const addSelectedPiece = (piece, personIndex) => {
        const newPiece = {
            person: personIndex + 1,
            piece: piece.name,
            price: piece.price,
            extra: piece.price - 8 // Diferència amb els 8€ pagats
        };

        const updatedPieces = [...selectedPieces];
        updatedPieces[personIndex] = newPiece;
        setSelectedPieces(updatedPieces);

        calculateTotals(updatedPieces);
    };

    // Calcular totals
    const calculateTotals = (pieces) => {
        const totalPieces = pieces.reduce((sum, piece) => sum + (piece?.price || 0), 0);
        const totalExtra = pieces.reduce((sum, piece) => sum + Math.max(0, piece?.extra || 0), 0);
        const totalCredit = pieces.reduce((sum, piece) => sum + Math.abs(Math.min(0, piece?.extra || 0)), 0);

        setFinalTotal(totalPieces);
        setExtraPaid(totalExtra);
        setCreditGenerated(totalCredit);
    };

    // Filtrar reserves
    const filteredBookings = todayBookings.filter(booking => {
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        const matchesSearch = booking.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.clients?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/admin';
            return;
        }
        fetchTodayBookings();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 animate-spin text-terracotta-500" />
                    <span className="ml-2 text-gray-600">Carregant reserves...</span>
                </div>
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

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar per nom o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                            >
                                <option value="all">Tots els estats</option>
                                <option value="confirmed">Confirmades</option>
                                <option value="attended">Han arribat</option>
                                <option value="completed">Completades</option>
                                <option value="cancelled">Cancel·lades</option>
                                <option value="no_show">No han vingut</option>
                            </select>
                        </div>
                    </div>
                </div>

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
                                onSelectPieces={() => {
                                    setSelectedBooking(booking);
                                    setSelectedPieces(new Array(booking.people_count).fill(null));
                                    setShowPieceModal(true);
                                }}
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
                        setSelectedPieces([]);
                    }}
                    booking={selectedBooking}
                    availablePieces={availablePieces}
                    selectedPieces={selectedPieces}
                    onAddPiece={addSelectedPiece}
                    finalTotal={finalTotal}
                    extraPaid={extraPaid}
                    creditGenerated={creditGenerated}
                    onComplete={completeBooking}
                />
            </div>
        </AdminLayout>
    );
};

// Component StatCard
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        yellow: 'bg-yellow-500',
        green: 'bg-green-500',
        terracotta: 'bg-terracotta-500'
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

// Component BookingCard
const BookingCard = ({ booking, onMarkAttended, onUpdateStatus, onSelectPieces }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-yellow-100 text-yellow-800';
            case 'attended': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'no_show': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed': return 'Confirmada';
            case 'attended': return 'Han arribat';
            case 'completed': return 'Completada';
            case 'cancelled': return 'Cancel·lada';
            case 'no_show': return 'No han vingut';
            default: return status;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.clients?.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {booking.booking_time}
                            </span>
                            <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {booking.people_count} persones
                            </span>
                            <span className="flex items-center">
                                <Euro className="w-4 h-4 mr-1" />
                                {booking.total_paid}€ pagats
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {booking.clients?.email}
                    </span>
                    {booking.clients?.phone && (
                        <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {booking.clients?.phone}
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {booking.status === 'confirmed' && (
                        <button
                            onClick={() => onMarkAttended(booking.id, booking.people_count)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                            <UserCheck className="w-4 h-4" />
                            <span>Han arribat</span>
                        </button>
                    )}

                    {booking.status === 'attended' && (
                        <button
                            onClick={onSelectPieces}
                            className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                            <Package className="w-4 h-4" />
                            <span>Seleccionar peces</span>
                        </button>
                    )}

                    {booking.status === 'confirmed' && (
                        <button
                            onClick={() => onUpdateStatus(booking.id, 'no_show')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                            <UserX className="w-4 h-4" />
                            <span>No show</span>
                        </button>
                    )}
                </div>
            </div>

            {booking.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {booking.notes}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

// Component PieceSelectionModal
const PieceSelectionModal = ({
    isOpen,
    onClose,
    booking,
    availablePieces,
    selectedPieces,
    onAddPiece,
    finalTotal,
    extraPaid,
    creditGenerated,
    onComplete
}) => {
    if (!isOpen || !booking) return null;

    const groupedPieces = availablePieces.reduce((acc, piece) => {
        if (!acc[piece.category]) acc[piece.category] = [];
        acc[piece.category].push(piece);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Seleccionar Peces</h2>
                            <p className="text-sm text-gray-600">
                                {booking.clients?.name} - {booking.people_count} persones - {booking.total_paid}€ pagats
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Person Selection */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Tria peça per cada persona:</h3>
                            <div className="space-y-4">
                                {Array.from({ length: booking.people_count }, (_, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-medium mb-3">Persona {index + 1}</h4>
                                        {selectedPieces[index] ? (
                                            <div className="bg-terracotta-50 p-3 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">{selectedPieces[index].piece}</p>
                                                        <p className="text-sm text-gray-600">
                                                            €{selectedPieces[index].price}
                                                            {selectedPieces[index].extra > 0 && (
                                                                <span className="text-red-600"> (+€{selectedPieces[index].extra})</span>
                                                            )}
                                                            {selectedPieces[index].extra < 0 && (
                                                                <span className="text-green-600"> (€{Math.abs(selectedPieces[index].extra)} crèdit)</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newPieces = [...selectedPieces];
                                                            newPieces[index] = null;
                                                            // TODO: Recalcular totals
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-500">
                                                Selecciona una peça a la dreta →
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Available Pieces */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Peces disponibles:</h3>
                            <div className="space-y-4">
                                {Object.entries(groupedPieces).map(([category, pieces]) => (
                                    <div key={category}>
                                        <h4 className="font-medium text-gray-700 mb-2 capitalize">{category}</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {pieces.map(piece => (
                                                <button
                                                    key={piece.id}
                                                    onClick={() => {
                                                        const emptyIndex = selectedPieces.findIndex(p => p === null);
                                                        if (emptyIndex !== -1) {
                                                            onAddPiece(piece, emptyIndex);
                                                        }
                                                    }}
                                                    disabled={selectedPieces.findIndex(p => p === null) === -1}
                                                    className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{piece.name}</span>
                                                        <span className="font-semibold">€{piece.price}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    {selectedPieces.some(p => p !== null) && (
                        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-semibold mb-3">Resum final:</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Import inicial pagat:</span>
                                    <span>€{booking.total_paid}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total peces triades:</span>
                                    <span>€{finalTotal.toFixed(2)}</span>
                                </div>
                                {extraPaid > 0 && (
                                    <div className="flex justify-between text-red-600">
                                        <span>Extra a pagar:</span>
                                        <span>€{extraPaid.toFixed(2)}</span>
                                    </div>
                                )}
                                {creditGenerated > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Crèdit cafeteria:</span>
                                        <span>€{creditGenerated.toFixed(2)}</span>
                                    </div>
                                )}
                                <hr className="my-2" />
                                <div className="flex justify-between font-semibold">
                                    <span>Total final:</span>
                                    <span>€{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel·lar
                        </button>
                        <button
                            onClick={onComplete}
                            disabled={selectedPieces.filter(p => p !== null).length !== booking.people_count}
                            className="px-6 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Completar Reserva
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminReserves;