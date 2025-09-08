import { useState, useEffect } from 'react';
import { Plus, Mail, Phone, Calendar, User, Edit2, Trash2, Eye } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/admin/common/StatCard';
import SearchFilter from '../../components/admin/common/SearchFilter';
import LoadingSpinner from '../../components/admin/common/LoadingSpinner';
import Button from '../../components/ui/Button';
import BaseModal from '../../components/ui/BaseModal';
import Input from '../../components/ui/Input';
import { isAuthenticated } from '../../utils/constants';

const AdminClients = () => {
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    // Mock data
    const mockClients = [
        {
            id: 1,
            name: 'Maria García López',
            email: 'maria.garcia@email.com',
            phone: '666123456',
            notes: 'Client habitual, li agraden les tasses grans',
            created_at: '2024-01-15',
            last_visit: '2024-12-28',
            total_visits: 8,
            total_spent: 142.50,
            bookings: [
                { date: '2024-12-28', status: 'completed', total: 16, pieces: ['Tassa gran', 'Plat petit'] },
                { date: '2024-11-15', status: 'completed', total: 24, pieces: ['Gerro mitjà'] },
                { date: '2024-10-03', status: 'completed', total: 18, pieces: ['Plat decoratiu'] }
            ]
        },
        {
            id: 2,
            name: 'Joan Martínez Pérez',
            email: 'joan.martinez@email.com',
            phone: '677987654',
            notes: 'Ve amb la família, sempre reserves per 4 persones',
            created_at: '2024-02-10',
            last_visit: '2024-12-20',
            total_visits: 5,
            total_spent: 96.00,
            bookings: [
                { date: '2024-12-20', status: 'completed', total: 32, pieces: ['4 plats familiars'] },
                { date: '2024-09-12', status: 'completed', total: 28, pieces: ['Figures animals'] }
            ]
        },
        {
            id: 3,
            name: 'Laura Rodríguez',
            email: 'laura.rodriguez@email.com',
            phone: '688456789',
            notes: 'Artista local, li agraden els projectes complexos',
            created_at: '2024-03-22',
            last_visit: '2024-12-15',
            total_visits: 12,
            total_spent: 234.75,
            bookings: [
                { date: '2024-12-15', status: 'completed', total: 45, pieces: ['Gerro gran artístic'] },
                { date: '2024-11-28', status: 'completed', total: 38, pieces: ['Set tasses temàtiques'] }
            ]
        }
    ];

    // Carrega clients
    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/admin';
            return;
        }

        setTimeout(() => {
            setClients(mockClients);
            setFilteredClients(mockClients);
            setLoading(false);
        }, 600);
    }, []);

    // Filtrar i ordenar clients
    useEffect(() => {
        let filtered = clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm)
        );

        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'last_visit') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredClients(filtered);
    }, [clients, searchTerm, sortBy, sortOrder]);

    // Handle add client
    const handleAddClient = () => {
        setFormData({ name: '', email: '', phone: '', notes: '' });
        setSelectedClient(null);
        setShowAddModal(true);
    };

    // Handle edit client
    const handleEditClient = (client) => {
        setFormData({
            name: client.name,
            email: client.email,
            phone: client.phone,
            notes: client.notes || ''
        });
        setSelectedClient(client);
        setShowEditModal(true);
    };

    // Handle save client
    const handleSaveClient = () => {
        if (!formData.name || !formData.email) {
            alert('Nom i email són obligatoris');
            return;
        }

        if (selectedClient) {
            // Editar
            setClients(prev => prev.map(client =>
                client.id === selectedClient.id
                    ? { ...client, ...formData }
                    : client
            ));
        } else {
            // Afegir nou
            const newClient = {
                id: Date.now(),
                ...formData,
                created_at: new Date().toISOString().split('T')[0],
                last_visit: null,
                total_visits: 0,
                total_spent: 0,
                bookings: []
            };
            setClients(prev => [...prev, newClient]);
        }

        setShowAddModal(false);
        setShowEditModal(false);
        setFormData({ name: '', email: '', phone: '', notes: '' });
        setSelectedClient(null);
    };

    // Handle delete client
    const handleDeleteClient = (clientId) => {
        if (!confirm('Estàs segur que vols eliminar aquest client?')) return;

        setClients(prev => prev.filter(client => client.id !== clientId));
    };

    // Handle view history
    const handleViewHistory = (client) => {
        setSelectedClient(client);
        setShowHistoryModal(true);
    };

    // Stats
    const stats = {
        totalClients: clients.length,
        activeClients: clients.filter(c => c.last_visit && new Date(c.last_visit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
        totalRevenue: clients.reduce((sum, c) => sum + c.total_spent, 0),
        avgSpentPerClient: clients.length ? (clients.reduce((sum, c) => sum + c.total_spent, 0) / clients.length) : 0
    };

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner message="Carregant clients..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Base de Clients</h1>
                        <p className="text-sm text-gray-600">Gestió completa de la base de clients de Terracotta</p>
                    </div>
                    <Button icon={Plus} onClick={handleAddClient}>
                        Nou Client
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Clients"
                        value={stats.totalClients}
                        icon={User}
                        color="blue"
                    />
                    <StatCard
                        title="Clients Actius"
                        value={stats.activeClients}
                        icon={Calendar}
                        color="green"
                        subtitle="Últim mes"
                    />
                    <StatCard
                        title="Facturació Total"
                        value={`€${stats.totalRevenue.toFixed(2)}`}
                        icon={Mail}
                        color="purple"
                    />
                    <StatCard
                        title="Mitjana per Client"
                        value={`€${stats.avgSpentPerClient.toFixed(2)}`}
                        icon={Phone}
                        color="gray"
                    />
                </div>

                {/* Search & Filters */}
                <SearchFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Buscar per nom, email o telèfon..."
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                    sortOptions={[
                        { value: 'name', label: 'Nom' },
                        { value: 'last_visit', label: 'Última visita' },
                        { value: 'total_spent', label: 'Total gastat' },
                        { value: 'total_visits', label: 'Número visites' }
                    ]}
                />

                {/* Clients Table */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacte</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Visita</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estadístiques</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                                {client.notes && (
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">{client.notes}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {client.email}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {client.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {client.last_visit ? new Date(client.last_visit).toLocaleDateString('ca-ES') : 'Mai'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="text-gray-900 font-medium">{client.total_visits} visites</div>
                                                <div className="text-gray-500">€{client.total_spent.toFixed(2)} total</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={Eye}
                                                    onClick={() => handleViewHistory(client)}
                                                >
                                                    Historial
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={Edit2}
                                                    onClick={() => handleEditClient(client)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={Trash2}
                                                    onClick={() => handleDeleteClient(client.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Client Modal */}
                <BaseModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    title="Afegir Nou Client"
                >
                    <div className="space-y-4">
                        <Input
                            label="Nom complet"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nom i cognoms del client"
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="client@email.com"
                            required
                        />
                        <Input
                            label="Telèfon"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="666123456"
                        />
                        <Input
                            label="Notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Preferències, observacions..."
                        />
                        <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="outline" onClick={() => setShowAddModal(false)}>
                                Cancel·lar
                            </Button>
                            <Button onClick={handleSaveClient}>
                                Guardar Client
                            </Button>
                        </div>
                    </div>
                </BaseModal>

                {/* Edit Client Modal */}
                <BaseModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    title="Editar Client"
                >
                    <div className="space-y-4">
                        <Input
                            label="Nom complet"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nom i cognoms del client"
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="client@email.com"
                            required
                        />
                        <Input
                            label="Telèfon"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="666123456"
                        />
                        <Input
                            label="Notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Preferències, observacions..."
                        />
                        <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="outline" onClick={() => setShowEditModal(false)}>
                                Cancel·lar
                            </Button>
                            <Button onClick={handleSaveClient}>
                                Guardar Canvis
                            </Button>
                        </div>
                    </div>
                </BaseModal>

                {/* History Modal */}
                <BaseModal
                    isOpen={showHistoryModal}
                    onClose={() => setShowHistoryModal(false)}
                    title={`Historial - ${selectedClient?.name}`}
                    size="lg"
                >
                    {selectedClient && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-500">Total visites</p>
                                    <p className="text-lg font-semibold">{selectedClient.total_visits}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total gastat</p>
                                    <p className="text-lg font-semibold">€{selectedClient.total_spent.toFixed(2)}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Historial de Reserves</h4>
                                <div className="space-y-3">
                                    {selectedClient.bookings?.map((booking, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(booking.date).toLocaleDateString('ca-ES')}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {booking.pieces.join(', ')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">€{booking.total}</p>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${booking.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {booking.status === 'completed' ? 'Completada' : booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </BaseModal>
            </div>
        </AdminLayout>
    );
};

export default AdminClients;