import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Eye,
    Save,
    X,
    Upload,
    Download,
    BarChart3,
    ShoppingCart,
    RefreshCw,
    Archive,
    CheckCircle,
    XCircle
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showAlerts, setShowAlerts] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMovementModal, setShowMovementModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        cost_price: '',
        stock: '',
        min_stock: '',
        description: '',
        active: true
    });

    const [movementData, setMovementData] = useState({
        type: 'in', // 'in' (entrada) o 'out' (sortida)
        quantity: '',
        reason: '',
        notes: ''
    });

    // Mock data per testing
    const mockInventory = [
        {
            id: 1,
            name: 'Tassa estàndard 300ml',
            category: 'tasses',
            price: 8.00,
            stock: 15,
            min_stock: 10,
            cost_price: 2.50,
            description: 'Tassa ceràmica per pintar, mida estàndard',
            active: true,
            last_movement: '2025-01-07',
            total_sold: 45,
            created_at: '2024-11-15',
            stock_value: 120.00
        },
        {
            id: 2,
            name: 'Plat gran 25cm',
            category: 'plats',
            price: 15.00,
            stock: 8,
            min_stock: 12,
            cost_price: 4.20,
            description: 'Plat gran ideal per decoració',
            active: true,
            last_movement: '2025-01-06',
            total_sold: 23,
            created_at: '2024-12-01',
            stock_value: 120.00
        },
        {
            id: 3,
            name: 'Bol mitjà 400ml',
            category: 'bols',
            price: 10.00,
            stock: 12,
            min_stock: 8,
            cost_price: 3.10,
            description: 'Bol versàtil per esmorzar',
            active: true,
            last_movement: '2025-01-05',
            total_sold: 34,
            created_at: '2024-11-20',
            stock_value: 120.00
        },
        {
            id: 4,
            name: 'Gerro petit 15cm',
            category: 'gerros',
            price: 18.00,
            stock: 5,
            min_stock: 6,
            cost_price: 5.40,
            description: 'Gerro decoratiu petit',
            active: true,
            last_movement: '2025-01-04',
            total_sold: 12,
            created_at: '2024-12-10',
            stock_value: 90.00
        },
        {
            id: 5,
            name: 'Imant nevera',
            category: 'accessoris',
            price: 4.00,
            stock: 3,
            min_stock: 15,
            cost_price: 1.20,
            description: 'Imant recordatori pintable',
            active: true,
            last_movement: '2025-01-07',
            total_sold: 67,
            created_at: '2024-12-01',
            stock_value: 12.00
        }
    ];

    const mockCategories = [
        { id: 'tasses', name: 'Tasses', count: 1, icon: '☕' },
        { id: 'plats', name: 'Plats', count: 1, icon: '🍽️' },
        { id: 'bols', name: 'Bols', count: 1, icon: '🥣' },
        { id: 'gerros', name: 'Gerros', count: 1, icon: '🏺' },
        { id: 'accessoris', name: 'Accessoris', count: 1, icon: '✨' },
        { id: 'figures', name: 'Figures', count: 0, icon: '🧸' }
    ];

    // Carregar dades (simulades per ara)
    const fetchInventory = async () => {
        try {
            setLoading(true);
            // TODO: Implementar endpoint backend
            // const response = await adminApiRequest(`${API_ENDPOINTS.inventory.list}?${params}`);

            // Simulem dades per ara
            setTimeout(() => {
                setInventory(mockInventory);
                setCategories([
                    { id: 'all', name: 'Totes', count: mockInventory.length, icon: '📦' },
                    ...mockCategories
                ]);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error carregant inventari:', error);
            setLoading(false);
        }
    };

    // Refrescar dades
    const refreshData = async () => {
        setRefreshing(true);
        await fetchInventory();
        setRefreshing(false);
    };

    // Crear nou article
    const createItem = async () => {
        try {
            // TODO: Implementar endpoint backend
            // const response = await adminApiRequest(API_ENDPOINTS.inventory.create, {
            //     method: 'POST',
            //     body: formData
            // });

            // Simulem creació
            const newItem = {
                id: Date.now(),
                ...formData,
                price: parseFloat(formData.price),
                cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
                stock: parseInt(formData.stock),
                min_stock: parseInt(formData.min_stock),
                total_sold: 0,
                last_movement: new Date().toISOString().split('T')[0],
                created_at: new Date().toISOString().split('T')[0],
                stock_value: parseInt(formData.stock) * parseFloat(formData.price)
            };

            setInventory([...inventory, newItem]);
            setShowAddModal(false);
            resetForm();
            alert('✅ Article creat correctament!');
        } catch (error) {
            console.error('Error creant article:', error);
            alert('❌ Error creant article');
        }
    };

    // Actualitzar article
    const updateItem = async () => {
        try {
            // TODO: Implementar endpoint backend
            // const response = await adminApiRequest(API_ENDPOINTS.inventory.update(selectedItem.id), {
            //     method: 'PUT',
            //     body: formData
            // });

            // Simulem actualització
            const updatedInventory = inventory.map(item =>
                item.id === selectedItem.id
                    ? {
                        ...item,
                        ...formData,
                        price: parseFloat(formData.price),
                        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
                        stock: parseInt(formData.stock),
                        min_stock: parseInt(formData.min_stock),
                        stock_value: parseInt(formData.stock) * parseFloat(formData.price)
                    }
                    : item
            );

            setInventory(updatedInventory);
            setShowEditModal(false);
            setSelectedItem(null);
            resetForm();
            alert('✅ Article actualitzat correctament!');
        } catch (error) {
            console.error('Error actualitzant article:', error);
            alert('❌ Error actualitzant article');
        }
    };

    // Eliminar article
    const deleteItem = async (itemId) => {
        if (!confirm('Estàs segur que vols eliminar aquest article?')) return;

        try {
            // TODO: Implementar endpoint backend
            // await adminApiRequest(API_ENDPOINTS.inventory.delete(itemId), {
            //     method: 'DELETE'
            // });

            // Simulem eliminació
            setInventory(inventory.filter(item => item.id !== itemId));
            alert('✅ Article eliminat correctament!');
        } catch (error) {
            console.error('Error eliminant article:', error);
            alert('❌ Error eliminant article');
        }
    };

    // Registrar moviment d'stock
    const registerMovement = async () => {
        try {
            const quantity = parseInt(movementData.quantity);
            const isIncoming = movementData.type === 'in';
            const newStock = isIncoming
                ? selectedItem.stock + quantity
                : selectedItem.stock - quantity;

            if (newStock < 0) {
                alert('❌ No pots treure més stock del que hi ha disponible');
                return;
            }

            // TODO: Implementar endpoint backend
            // await adminApiRequest(`/api/inventory/${selectedItem.id}/movement`, {
            //     method: 'POST',
            //     body: movementData
            // });

            // Simulem moviment
            const updatedInventory = inventory.map(item =>
                item.id === selectedItem.id
                    ? {
                        ...item,
                        stock: newStock,
                        last_movement: new Date().toISOString().split('T')[0],
                        stock_value: newStock * item.price
                    }
                    : item
            );

            setInventory(updatedInventory);
            setShowMovementModal(false);
            setSelectedItem(null);
            setMovementData({ type: 'in', quantity: '', reason: '', notes: '' });
            alert(`✅ Moviment registrat: ${isIncoming ? '+' : '-'}${quantity} unitats`);
        } catch (error) {
            console.error('Error registrant moviment:', error);
            alert('❌ Error registrant moviment');
        }
    };

    // Funcions auxiliars
    const resetForm = () => {
        setFormData({
            name: '',
            category: '',
            price: '',
            cost_price: '',
            stock: '',
            min_stock: '',
            description: '',
            active: true
        });
    };

    const openEditModal = (item) => {
        setSelectedItem(item);
        setFormData({
            name: item.name,
            category: item.category,
            price: item.price.toString(),
            cost_price: item.cost_price ? item.cost_price.toString() : '',
            stock: item.stock.toString(),
            min_stock: item.min_stock.toString(),
            description: item.description || '',
            active: item.active
        });
        setShowEditModal(true);
    };

    const openMovementModal = (item) => {
        setSelectedItem(item);
        setShowMovementModal(true);
    };

    // Filtrar i ordenar inventari
    const filteredInventory = inventory
        .filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesAlerts = !showAlerts || item.stock <= item.min_stock;
            return matchesCategory && matchesSearch && matchesAlerts;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    // Estadístiques
    const stats = {
        totalItems: inventory.length,
        lowStock: inventory.filter(item => item.stock <= item.min_stock).length,
        totalValue: inventory.reduce((sum, item) => sum + (item.stock * item.price), 0),
        totalCost: inventory.reduce((sum, item) => sum + (item.stock * (item.cost_price || 0)), 0)
    };

    useEffect(() => {
        // TODO: Afegir verificació d'autenticació quan tinguis el utils
        // if (!isAuthenticated()) {
        //     window.location.href = '/admin';
        //     return;
        // }
        fetchInventory();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 animate-spin text-terracotta-500" />
                    <span className="ml-2 text-gray-600">Carregant inventari...</span>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Control d'Inventari</h1>
                        <p className="text-sm text-gray-600">Gestió completa del stock de peces ceràmiques</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowAlerts(!showAlerts)}
                            className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${showAlerts
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-white border-gray-300 text-gray-700'
                                }`}
                        >
                            <AlertTriangle className="w-4 h-4" />
                            <span>Stock Baix ({stats.lowStock})</span>
                        </button>
                        <button
                            onClick={refreshData}
                            disabled={refreshing}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>Actualitzar</span>
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Afegir Article</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Articles"
                        value={stats.totalItems}
                        icon={Package}
                        color="blue"
                    />
                    <StatCard
                        title="Stock Baix"
                        value={stats.lowStock}
                        icon={AlertTriangle}
                        color="red"
                    />
                    <StatCard
                        title="Valor Stock"
                        value={`€${stats.totalValue.toFixed(2)}`}
                        icon={TrendingUp}
                        color="green"
                    />
                    <StatCard
                        title="Cost Stock"
                        value={`€${stats.totalCost.toFixed(2)}`}
                        icon={BarChart3}
                        color="gray"
                    />
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Buscar articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.icon} {category.name} ({category.count})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Ordenar:</span>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-');
                                    setSortBy(field);
                                    setSortOrder(order);
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                            >
                                <option value="name-asc">Nom A-Z</option>
                                <option value="name-desc">Nom Z-A</option>
                                <option value="stock-asc">Stock ↑</option>
                                <option value="stock-desc">Stock ↓</option>
                                <option value="price-asc">Preu ↑</option>
                                <option value="price-desc">Preu ↓</option>
                                <option value="last_movement-desc">Actualització ↓</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Article</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-900">Categoria</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Stock</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Preu</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Valor</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-900">Estat</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-900">Accions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            No s'han trobat articles amb aquests filtres
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map(item => (
                                        <InventoryRow
                                            key={item.id}
                                            item={item}
                                            onEdit={() => openEditModal(item)}
                                            onDelete={() => deleteItem(item.id)}
                                            onMovement={() => openMovementModal(item)}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modals */}
                <AddEditModal
                    isOpen={showAddModal}
                    onClose={() => {
                        setShowAddModal(false);
                        resetForm();
                    }}
                    title="Afegir Nou Article"
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories.filter(cat => cat.id !== 'all')}
                    onSubmit={createItem}
                />

                <AddEditModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedItem(null);
                        resetForm();
                    }}
                    title="Editar Article"
                    formData={formData}
                    setFormData={setFormData}
                    categories={categories.filter(cat => cat.id !== 'all')}
                    onSubmit={updateItem}
                    isEdit={true}
                />

                <MovementModal
                    isOpen={showMovementModal}
                    onClose={() => {
                        setShowMovementModal(false);
                        setSelectedItem(null);
                        setMovementData({ type: 'in', quantity: '', reason: '', notes: '' });
                    }}
                    item={selectedItem}
                    movementData={movementData}
                    setMovementData={setMovementData}
                    onSubmit={registerMovement}
                />
            </div>
        </AdminLayout>
    );
};

// Component StatCard
const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        red: 'bg-red-500',
        green: 'bg-green-500',
        gray: 'bg-gray-500'
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

// Component InventoryRow
const InventoryRow = ({ item, onEdit, onDelete, onMovement }) => {
    const isLowStock = item.stock <= item.min_stock;
    const categoryEmojis = {
        tasses: '☕',
        plats: '🍽️',
        bols: '🥣',
        gerros: '🏺',
        accessoris: '✨',
        figures: '🧸'
    };

    return (
        <tr className={`hover:bg-gray-50 ${isLowStock ? 'bg-red-50' : ''}`}>
            <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className="inline-flex items-center space-x-1 text-sm text-gray-700 capitalize">
                    <span>{categoryEmojis[item.category]}</span>
                    <span>{item.category}</span>
                </span>
            </td>
            <td className="py-3 px-4 text-right">
                <div className="flex flex-col items-end">
                    <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.stock}
                    </span>
                    <span className="text-xs text-gray-500">
                        Mín: {item.min_stock}
                    </span>
                </div>
            </td>
            <td className="py-3 px-4 text-right">
                <span className="font-medium text-gray-900">€{item.price.toFixed(2)}</span>
            </td>
            <td className="py-3 px-4 text-right">
                <span className="font-medium text-gray-900">
                    €{(item.stock_value || (item.stock * item.price)).toFixed(2)}
                </span>
            </td>
            <td className="py-3 px-4 text-center">
                {isLowStock ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Stock baix
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        OK
                    </span>
                )}
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center justify-center space-x-2">
                    <button
                        onClick={onMovement}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Moviment d'stock"
                    >
                        <TrendingUp className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onEdit}
                        className="text-gray-600 hover:text-gray-700 p-1"
                        title="Editar"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

// Component AddEditModal
const AddEditModal = ({ isOpen, onClose, title, formData, setFormData, categories, onSubmit, isEdit = false }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg max-w-md w-full"
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de l'article
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                            placeholder="Tassa petita 200ml"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoria
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                            required
                        >
                            <option value="">Selecciona categoria</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.icon} {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preu venda (€)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                placeholder="8.00"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cost (€) - opcional
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.cost_price}
                                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                placeholder="2.50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock actual
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                placeholder="10"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock mínim (alerta)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.min_stock}
                                onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                placeholder="5"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripció
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                            rows="3"
                            placeholder="Descripció de l'article..."
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="rounded border-gray-300 text-terracotta-600 focus:ring-terracotta-500"
                        />
                        <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                            Article actiu (visible al TPV)
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel·lar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>{isEdit ? 'Actualitzar' : 'Crear'}</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// Component MovementModal
const MovementModal = ({ isOpen, onClose, item, movementData, setMovementData, onSubmit }) => {
    if (!isOpen || !item) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    const isOutgoing = movementData.type === 'out';
    const quantity = parseInt(movementData.quantity) || 0;
    const newStock = isOutgoing ? item.stock - quantity : item.stock + quantity;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg max-w-md w-full"
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Moviment d'Stock</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-600">Stock actual:</span>
                            <span className="font-medium text-gray-900">{item.stock} unitats</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipus de moviment
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMovementData({ ...movementData, type: 'in' })}
                                    className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 ${movementData.type === 'in'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <TrendingUp className="w-5 h-5" />
                                    <span>Entrada</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMovementData({ ...movementData, type: 'out' })}
                                    className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 ${movementData.type === 'out'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <TrendingDown className="w-5 h-5" />
                                    <span>Sortida</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantitat
                            </label>
                            <input
                                type="number"
                                min="1"
                                max={movementData.type === 'out' ? item.stock : undefined}
                                value={movementData.quantity}
                                onChange={(e) => setMovementData({ ...movementData, quantity: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                placeholder="1"
                                required
                            />
                            {movementData.type === 'out' && quantity > item.stock && (
                                <p className="text-red-600 text-sm mt-1">
                                    No pots treure més stock del disponible
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Motiu
                            </label>
                            <select
                                value={movementData.reason}
                                onChange={(e) => setMovementData({ ...movementData, reason: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                required
                            >
                                <option value="">Selecciona motiu</option>
                                {movementData.type === 'in' ? (
                                    <>
                                        <option value="purchase">Compra proveïdor</option>
                                        <option value="return">Devolució client</option>
                                        <option value="production">Producció pròpia</option>
                                        <option value="correction">Correcció inventari</option>
                                        <option value="other">Altres</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="sale">Venda</option>
                                        <option value="breakage">Trencada</option>
                                        <option value="defect">Defecte</option>
                                        <option value="correction">Correcció inventari</option>
                                        <option value="other">Altres</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes (opcional)
                            </label>
                            <textarea
                                value={movementData.notes}
                                onChange={(e) => setMovementData({ ...movementData, notes: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                rows="3"
                                placeholder="Informació adicional..."
                            />
                        </div>

                        {movementData.quantity && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Nou stock:</span>
                                    <span className={`font-medium ${newStock < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {newStock} unitats
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel·lar
                            </button>
                            <button
                                type="submit"
                                disabled={newStock < 0}
                                className="px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>Registrar Moviment</span>
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminInventory;