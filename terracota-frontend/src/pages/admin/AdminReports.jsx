import { useState, useEffect } from 'react';
import { BarChart3, Calendar, Download, TrendingUp, DollarSign, Users, Package } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/admin/common/StatCard';
import LoadingSpinner from '../../components/admin/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import { isAuthenticated } from '../../utils/constants';

const AdminReports = () => {
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedReport, setSelectedReport] = useState('revenue');

    // Mock data
    const [reportsData, setReportsData] = useState({
        revenue: {
            total: 2340.75,
            growth: 15.3,
            daily: [45, 52, 38, 67, 89, 73, 56, 62, 48, 71, 85, 69, 77, 83, 91, 65, 58, 72, 89, 94, 76, 68, 81, 87, 79, 73, 88, 92, 78, 84],
            categories: [
                { name: 'Ceràmica', value: 1560.50, color: 'bg-terracotta-500' },
                { name: 'Cafeteria', value: 650.25, color: 'bg-blue-500' },
                { name: 'Accessoris', value: 130.00, color: 'bg-green-500' }
            ]
        },
        bookings: {
            total: 89,
            growth: 8.7,
            completed: 76,
            cancelled: 5,
            noShow: 8,
            byTimeSlot: [
                { time: '10:00', count: 12 },
                { time: '11:30', count: 8 },
                { time: '16:00', count: 18 },
                { time: '17:30', count: 22 },
                { time: '19:00', count: 15 }
            ]
        },
        clients: {
            total: 156,
            new: 23,
            returning: 34,
            avgSpent: 31.25,
            topClients: [
                { name: 'Laura Rodríguez', visits: 12, spent: 234.75 },
                { name: 'Maria García', visits: 8, spent: 142.50 },
                { name: 'Joan Martínez', visits: 5, spent: 96.00 }
            ]
        },
        inventory: {
            topSelling: [
                { item: 'Tasses grans', sold: 34, revenue: 340 },
                { item: 'Plats mitjans', sold: 28, revenue: 280 },
                { item: 'Bols petits', sold: 19, revenue: 133 }
            ],
            lowStock: 3,
            totalItems: 247
        }
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/admin';
            return;
        }

        setTimeout(() => {
            setLoading(false);
        }, 600);
    }, []);

    const SimpleChart = ({ data, type = 'bar', height = 200 }) => {
        const maxValue = Math.max(...data);

        return (
            <div className="space-y-2">
                <div className={`flex items-end justify-between space-x-1`} style={{ height: `${height}px` }}>
                    {data.map((value, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                            <div
                                className="bg-terracotta-500 rounded-t w-full min-w-0"
                                style={{
                                    height: `${(value / maxValue) * (height - 20)}px`,
                                    minHeight: value > 0 ? '2px' : '0px'
                                }}
                                title={`Dia ${index + 1}: €${value}`}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Dia 1</span>
                    <span>Dia 15</span>
                    <span>Dia 30</span>
                </div>
            </div>
        );
    };

    const ReportCard = ({ title, children, action }) => (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {action}
            </div>
            {children}
        </div>
    );

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner message="Generant informes..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Informes i Analítiques</h1>
                        <p className="text-sm text-gray-600">Anàlisi detallada del rendiment de Terracotta</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                        >
                            <option value="week">Última setmana</option>
                            <option value="month">Últim mes</option>
                            <option value="quarter">Últim trimestre</option>
                            <option value="year">Últim any</option>
                        </select>
                        <Button variant="outline" icon={Download}>
                            Exportar PDF
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Ingressos Totals"
                        value={`€${reportsData.revenue.total.toFixed(2)}`}
                        icon={DollarSign}
                        color="green"
                        subtitle={`+${reportsData.revenue.growth}% vs anterior`}
                    />
                    <StatCard
                        title="Reserves Totals"
                        value={reportsData.bookings.total}
                        icon={Calendar}
                        color="blue"
                        subtitle={`${reportsData.bookings.completed} completades`}
                    />
                    <StatCard
                        title="Clients Actius"
                        value={reportsData.clients.total}
                        icon={Users}
                        color="purple"
                        subtitle={`${reportsData.clients.new} nous`}
                    />
                    <StatCard
                        title="Articles Venuts"
                        value={reportsData.inventory.totalItems}
                        icon={Package}
                        color="orange"
                        subtitle={`${reportsData.inventory.lowStock} stock baix`}
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <ReportCard
                        title="Evolució Ingressos Diaris"
                        action={
                            <Button variant="outline" size="sm">
                                Veure detall
                            </Button>
                        }
                    >
                        <SimpleChart data={reportsData.revenue.daily} height={180} />
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Mitjana diària:</span>
                                <span className="font-medium">€{(reportsData.revenue.total / 30).toFixed(2)}</span>
                            </div>
                        </div>
                    </ReportCard>

                    {/* Revenue by Category */}
                    <ReportCard title="Ingressos per Categoria">
                        <div className="space-y-4">
                            {reportsData.revenue.categories.map((category, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-900">{category.name}</span>
                                        <span className="text-gray-600">€{category.value.toFixed(2)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${category.color}`}
                                            style={{
                                                width: `${(category.value / reportsData.revenue.total) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {((category.value / reportsData.revenue.total) * 100).toFixed(1)}% del total
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ReportCard>

                    {/* Top Selling Items */}
                    <ReportCard title="Articles Més Venuts">
                        <div className="space-y-3">
                            {reportsData.inventory.topSelling.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-terracotta-700">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.item}</p>
                                            <p className="text-sm text-gray-500">{item.sold} unitats venudes</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">€{item.revenue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ReportCard>

                    {/* Top Clients */}
                    <ReportCard title="Millors Clients">
                        <div className="space-y-3">
                            {reportsData.clients.topClients.map((client, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-700">#{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{client.name}</p>
                                            <p className="text-sm text-gray-500">{client.visits} visites</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">€{client.spent.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ReportCard>
                </div>

                {/* Booking Analysis */}
                <ReportCard title="Anàlisi de Reserves">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Reserves per Estat</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Completades</span>
                                    <span className="text-sm font-medium text-green-600">{reportsData.bookings.completed}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Cancel·lades</span>
                                    <span className="text-sm font-medium text-red-600">{reportsData.bookings.cancelled}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">No shows</span>
                                    <span className="text-sm font-medium text-orange-600">{reportsData.bookings.noShow}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Franges Més Populars</h4>
                            <div className="space-y-2">
                                {reportsData.bookings.byTimeSlot.map((slot, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">{slot.time}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-12 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${(slot.count / Math.max(...reportsData.bookings.byTimeSlot.map(s => s.count))) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 w-6">{slot.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ReportCard>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;