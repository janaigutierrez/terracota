import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar,
    Users,
    Package,
    TrendingUp,
    LogOut,
    Settings,
    Bell
} from 'lucide-react';

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const [stats, setStats] = useState({
        reservesToday: 0,
        totalClients: 0,
        stockAlerts: 0,
        monthlyRevenue: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si està autenticat
        const token = localStorage.getItem('adminToken');
        const admin = localStorage.getItem('adminData');

        if (!token || !admin) {
            navigate('/admin');
            return;
        }

        setAdminData(JSON.parse(admin));
        loadDashboardData();
    }, [navigate]);

    const loadDashboardData = async () => {
        // Carregar dades del dashboard
        // TODO: Implementar quan tinguem l'endpoint
        setStats({
            reservesToday: 5,
            totalClients: 127,
            stockAlerts: 3,
            monthlyRevenue: 2340
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin');
    };

    if (!adminData) {
        return (
            <div className="min-h-screen bg-clay-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-clay-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-clay-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-terracotta-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-clay-800">
                                    Terracotta Admin
                                </h1>
                                <p className="text-sm text-clay-600">
                                    Benvingut, {adminData.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-clay-600 hover:text-terracotta-600 transition-colors">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-clay-600 hover:text-terracotta-600 transition-colors">
                                <Settings className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 bg-clay-100 hover:bg-clay-200 px-3 py-2 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm">Sortir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Reserves Avui"
                        value={stats.reservesToday}
                        icon={Calendar}
                        color="blue"
                    />
                    <StatCard
                        title="Total Clients"
                        value={stats.totalClients}
                        icon={Users}
                        color="green"
                    />
                    <StatCard
                        title="Alertes Stock"
                        value={stats.stockAlerts}
                        icon={Package}
                        color="yellow"
                    />
                    <StatCard
                        title="Ingressos Mes"
                        value={`${stats.monthlyRevenue}€`}
                        icon={TrendingUp}
                        color="purple"
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <QuickActionCard
                        title="Gestionar Reserves"
                        description="Veure i gestionar les reserves d'avui i futures"
                        icon={Calendar}
                        onClick={() => navigate('/admin/reserves')}
                    />
                    <QuickActionCard
                        title="Control d'Inventari"
                        description="Gestionar stock de peces ceràmiques"
                        icon={Package}
                        onClick={() => navigate('/admin/inventari')}
                    />
                    <QuickActionCard
                        title="Base de Clients"
                        description="Veure perfils i històric de clients"
                        icon={Users}
                        onClick={() => navigate('/admin/clients')}
                    />
                </div>
            </main>
        </div>
    );
};

// Componente StatCard
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-clay-200 p-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-clay-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-clay-800">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </motion.div>
    );
};

// Componente QuickActionCard
const QuickActionCard = ({ title, description, icon: Icon, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl shadow-sm border border-clay-200 p-6 cursor-pointer transition-all hover:shadow-md"
            onClick={onClick}
        >
            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terracotta-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-terracotta-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-clay-800 mb-2">{title}</h3>
                    <p className="text-sm text-clay-600">{description}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;