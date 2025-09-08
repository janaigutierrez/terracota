import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, Package, TrendingUp, AlertTriangle, Clock, ShoppingCart } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import StatCard from '../components/admin/common/StatCard';
import LoadingSpinner from '../components/admin/common/LoadingSpinner';
import Button from '../components/ui/Button';
import { isAuthenticated } from '../utils/constants';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [todayBookings, setTodayBookings] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // Mock data per testing
    const mockStats = {
        todayRevenue: 247.50,
        todayBookings: 8,
        todayCompleted: 5,
        monthlyRevenue: 2340.75,
        lowStockItems: 3,
        pendingBookings: 3,
        totalClients: 156,
        avgOrderValue: 31.25
    };

    const mockTodayBookings = [
        {
            id: 1,
            time: '10:00',
            client: 'Maria García',
            people: 2,
            status: 'confirmed',
            total: 16
        },
        {
            id: 2,
            time: '11:30',
            client: 'Família Martínez',
            people: 4,
            status: 'attended',
            total: 32
        },
        {
            id: 3,
            time: '16:00',
            client: 'Joan Pérez',
            people: 3,
            status: 'completed',
            total: 24
        }
    ];

    const mockRecentSales = [
        {
            id: 1,
            time: '14:30',
            items: ['Tassa gran', 'Plat mitjà'],
            total: 18.50,
            payment: 'targeta'
        },
        {
            id: 2,
            time: '13:15',
            items: ['Bol petit', 'Accessori'],
            total: 11.00,
            payment: 'efectiu'
        }
    ];

    const mockAlerts = [
        {
            id: 1,
            type: 'stock',
            message: 'Tasses grans - Stock baix (2 unitats)',
            priority: 'high'
        },
        {
            id: 2,
            type: 'booking',
            message: '3 reserves per confirmar demà',
            priority: 'medium'
        }
    ];

    // Simulem càrrega de dades
    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/admin';
            return;
        }

        // Simulem API call
        setTimeout(() => {
            setStats(mockStats);
            setTodayBookings(mockTodayBookings);
            setRecentSales(mockRecentSales);
            setAlerts(mockAlerts);
            setLoading(false);
        }, 800);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'text-blue-600 bg-blue-100';
            case 'attended': return 'text-yellow-600 bg-yellow-100';
            case 'completed': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed': return 'Confirmada';
            case 'attended': return 'Han arribat';
            case 'completed': return 'Completada';
            case 'cancelled': return 'Cancel·lada';
            default: return 'Desconegut';
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner message="Carregant dashboard..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-600">
                            {new Date().toLocaleDateString('ca-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="secondary" href="/admin/tpv" icon={ShoppingCart}>
                            TPV Ràpid
                        </Button>
                        <Button href="/admin/reserves" icon={Calendar}>
                            Noves Reserves
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard
                        title="Ingressos Avui"
                        value={`€${stats.todayRevenue?.toFixed(2)}`}
                        icon={DollarSign}
                        color="green"
                        subtitle={`Mitjana: €${stats.avgOrderValue?.toFixed(2)}`}
                    />
                    <StatCard
                        title="Reserves Avui"
                        value={`${stats.todayBookings}/${stats.todayCompleted}`}
                        icon={Calendar}
                        color="blue"
                        subtitle={`${stats.pendingBookings} pendents`}
                    />
                    <StatCard
                        title="Total Clients"
                        value={stats.totalClients}
                        icon={Users}
                        color="purple"
                        subtitle="Aquest mes"
                    />
                    <StatCard
                        title="Stock Alerts"
                        value={stats.lowStockItems}
                        icon={AlertTriangle}
                        color="red"
                        subtitle="Reposar aviat"
                    />
                </div>

                {/* Monthly Overview */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Resum Mensual</h2>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-terracotta-50 rounded-lg">
                            <p className="text-2xl font-bold text-terracotta-700">€{stats.monthlyRevenue?.toFixed(2)}</p>
                            <p className="text-sm text-terracotta-600">Ingressos totals</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-700">42</p>
                            <p className="text-sm text-blue-600">Reserves completades</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-700">98%</p>
                            <p className="text-sm text-green-600">Satisfacció clients</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Reserves d'Avui */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Reserves d'Avui</h2>
                            <Button variant="outline" size="sm" href="/admin/reserves">
                                Veure totes
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {todayBookings.slice(0, 4).map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center w-8 h-8 bg-terracotta-100 rounded-full">
                                            <Clock className="w-4 h-4 text-terracotta-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{booking.client}</p>
                                            <p className="text-sm text-gray-500">{booking.time} • {booking.people} persones</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">€{booking.total}</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                                            {getStatusText(booking.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vendes Recents */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Vendes Recents</h2>
                            <Button variant="outline" size="sm" href="/admin/tpv">
                                Vendre ara
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {recentSales.map((sale) => (
                                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                            <Package className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{sale.items.join(', ')}</p>
                                            <p className="text-sm text-gray-500">{sale.time} • {sale.payment}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-900">€{sale.total.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alertes */}
                {alerts.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertes i Notificacions</h2>
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <div key={alert.id} className={`flex items-center p-3 rounded-lg ${alert.priority === 'high' ? 'bg-red-50 border border-red-200' :
                                    alert.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                                        'bg-blue-50 border border-blue-200'
                                    }`}>
                                    <AlertTriangle className={`w-5 h-5 mr-3 ${alert.priority === 'high' ? 'text-red-500' :
                                        alert.priority === 'medium' ? 'text-yellow-500' :
                                            'text-blue-500'
                                        }`} />
                                    <p className="text-sm text-gray-700">{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;