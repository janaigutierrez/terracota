import { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertTriangle, Package, TrendingUp, BarChart3 } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/admin/common/StatCard';
import SearchFilter from '../../components/admin/common/SearchFilter';
import InventoryTable from '../../components/admin/inventory/InventoryTable';
import LoadingSpinner from '../../components/admin/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import { useInventory } from '../../hooks/useInventory';
import { isAuthenticated } from '/src/utils/constants';

const AdminInventory = () => {
    const {
        inventory,
        categories,
        loading,
        error,
        createItem,
        updateItem,
        deleteItem,
        registerMovement,
        filterInventory,
        getStats,
        refetch
    } = useInventory();

    // UI State
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showAlerts, setShowAlerts] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMovementModal, setShowMovementModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Refrescar dades
    const refreshData = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // Filtrar inventari
    const filteredInventory = filterInventory(inventory, {
        category: selectedCategory,
        search: searchTerm,
        showAlerts,
        sortBy,
        sortOrder
    });

    // Estadístiques
    const stats = getStats();

    // Handle edit
    const handleEdit = (item) => {
        setSelectedItem(item);
        setShowEditModal(true);
    };

    // Handle delete
    const handleDelete = async (itemId) => {
        if (!confirm('Estàs segur que vols eliminar aquest article?')) return;

        const result = await deleteItem(itemId);
        if (result.success) {
            alert('✅ Article eliminat correctament!');
        } else {
            alert('❌ Error eliminant article');
        }
    };

    // Handle movement
    const handleMovement = (item) => {
        setSelectedItem(item);
        setShowMovementModal(true);
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
                <LoadingSpinner message="Carregant inventari..." />
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <p className="text-red-600">Error: {error}</p>
                    <Button onClick={refetch} className="mt-4">
                        Tornar a intentar
                    </Button>
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
                        <Button
                            variant={showAlerts ? 'danger' : 'outline'}
                            icon={AlertTriangle}
                            onClick={() => setShowAlerts(!showAlerts)}
                        >
                            Stock Baix ({stats.lowStock})
                        </Button>
                        <Button
                            variant="secondary"
                            icon={RefreshCw}
                            onClick={refreshData}
                            loading={refreshing}
                            disabled={refreshing}
                        >
                            Actualitzar
                        </Button>
                        <Button
                            icon={Plus}
                            onClick={() => setShowAddModal(true)}
                        >
                            Afegir Article
                        </Button>
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

                {/* Search & Filters */}
                <SearchFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                    searchPlaceholder="Buscar articles..."
                />

                {/* Inventory Table */}
                <InventoryTable
                    items={filteredInventory}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMovement={handleMovement}
                />

                {/* TODO: Modals - També es poden extreure com components */}
                {/* AddEditModal, MovementModal, etc. */}
            </div>
        </AdminLayout>
    );
};

export default AdminInventory;