import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar,
    Package,
    Users,
    ShoppingCart,
    DollarSign,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    LogOut,
    User,
    ChevronDown,
    Home,
    BarChart3,
    ClipboardList,
    CreditCard,
    AlertTriangle
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Simulem dades d'usuari (vindran del localStorage/context)
    const currentUser = {
        name: 'Admin',
        email: 'admin@terracotta.cat',
        avatar: null
    };

    // Navegació del sidebar
    const navigation = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            current: location.pathname === '/admin/dashboard'
        },
        {
            name: 'Reserves Avui',
            href: '/admin/reserves',
            icon: Calendar,
            current: location.pathname === '/admin/reserves',
            badge: '5' // Reserves pendents
        },
        {
            name: 'TPV Ràpid',
            href: '/admin/tpv',
            icon: ShoppingCart,
            current: location.pathname === '/admin/tpv'
        },
        {
            name: 'Inventari',
            href: '/admin/inventari',
            icon: Package,
            current: location.pathname === '/admin/inventari',
            badge: '3', // Stock alerts
            badgeColor: 'bg-red-500'
        },
        {
            name: 'Clients',
            href: '/admin/clients',
            icon: Users,
            current: location.pathname === '/admin/clients'
        },
        {
            name: 'Caixa',
            href: '/admin/caixa',
            icon: DollarSign,
            current: location.pathname === '/admin/caixa'
        },
        {
            name: 'Informes',
            href: '/admin/informes',
            icon: BarChart3,
            current: location.pathname === '/admin/informes'
        },
        {
            name: 'Configuració',
            href: '/admin/configuracio',
            icon: Settings,
            current: location.pathname === '/admin/configuracio'
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        navigate('/admin');
    };

    return (
        <div className="h-screen bg-gray-50 overflow-hidden">
            {/* Mobile sidebar backdrop */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 lg:hidden bg-gray-900/50"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.div
                animate={{
                    width: sidebarCollapsed ? '5rem' : '16rem'
                }}
                className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-sm`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center h-16 px-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-terracotta-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                        </div>
                        {!sidebarCollapsed && (
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Terracotta</h1>
                                <p className="text-xs text-gray-500">TPV Admin</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className={`ml-auto p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${sidebarCollapsed ? 'mx-auto ml-0' : ''}`}
                    >
                        <Menu className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`
                                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative
                                    ${item.current
                                        ? 'bg-terracotta-50 text-terracotta-700 border-r-2 border-terracotta-500'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${item.current ? 'text-terracotta-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                {!sidebarCollapsed && (
                                    <>
                                        <span className="ml-3 truncate">{item.name}</span>
                                        {item.badge && (
                                            <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.badgeColor || 'bg-terracotta-100 text-terracotta-700'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                                {sidebarCollapsed && item.badge && (
                                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white ${item.badgeColor || 'bg-terracotta-500'}`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="border-t border-gray-200 p-3">
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="w-full flex items-center px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-terracotta-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-terracotta-600" />
                            </div>
                            {!sidebarCollapsed && (
                                <>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                                    </div>
                                    <ChevronDown className="ml-auto w-4 h-4 text-gray-400" />
                                </>
                            )}
                        </button>

                        <AnimatePresence>
                            {userMenuOpen && !sidebarCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1"
                                >
                                    <Link
                                        to="/"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Home className="w-4 h-4 inline mr-2" />
                                        Veure web
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4 inline mr-2" />
                                        Tancar sessió
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        className="fixed inset-y-0 left-0 z-50 w-64 bg-white lg:hidden"
                    >
                        {/* Mobile header */}
                        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-terracotta-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">T</span>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900">Terracotta</h1>
                                    <p className="text-xs text-gray-500">TPV Admin</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Mobile navigation */}
                        <nav className="flex-1 px-3 py-4 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                                            group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                                            ${item.current
                                                ? 'bg-terracotta-50 text-terracotta-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 ${item.current ? 'text-terracotta-600' : 'text-gray-400'}`} />
                                        <span className="ml-3">{item.name}</span>
                                        {item.badge && (
                                            <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.badgeColor || 'bg-terracotta-100 text-terracotta-700'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile user section */}
                        <div className="border-t border-gray-200 p-3">
                            <div className="flex items-center px-3 py-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-terracotta-100 flex items-center justify-center">
                                    <User className="w-4 h-4 text-terracotta-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Link
                                    to="/"
                                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    <Home className="w-4 h-4 mr-3" />
                                    Veure web
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Tancar sessió
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className={sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}>
                {/* Top bar */}
                <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-none">
                    <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Separator */}
                        <div className="h-6 w-px bg-gray-200 lg:hidden" />

                        {/* Search */}
                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                            <div className="relative flex flex-1">
                                <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 pl-3" />
                                <input
                                    className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                    placeholder="Buscar clients, reserves..."
                                    type="search"
                                />
                            </div>
                        </div>

                        {/* Right section */}
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* Notifications */}
                            <button className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                <Bell className="h-6 w-6" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">3</span>
                                </span>
                            </button>

                            {/* Quick stats */}
                            <div className="hidden lg:flex items-center gap-4 text-sm">
                                <div className="text-center">
                                    <p className="font-medium text-gray-900">€247</p>
                                    <p className="text-xs text-gray-500">Avui</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-gray-900">8</p>
                                    <p className="text-xs text-gray-500">Reserves</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;