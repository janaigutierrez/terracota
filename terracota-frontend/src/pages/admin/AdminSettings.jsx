import { useState, useEffect } from 'react';
import { Save, User, Bell, Store, Palette, Shield, Globe } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/admin/common/LoadingSpinner';
import { isAuthenticated } from '../../utils/constants';

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    // Settings state
    const [settings, setSettings] = useState({
        // General
        businessName: 'Terracotta',
        businessEmail: 'info@terracotta.cat',
        businessPhone: '938 40 16 50',
        businessAddress: 'Carrer Principal, 123, Granollers',

        // Notifications
        emailNotifications: true,
        smsNotifications: true,
        lowStockAlerts: true,
        bookingReminders: true,
        dailyReports: false,

        // Operational
        defaultCookingTime: 7,
        maxBookingsPerSlot: 8,
        bookingAdvanceDays: 30,
        cancellationHours: 48,
        pricePerPerson: 8.00,

        // System
        backupFrequency: 'daily',
        sessionTimeout: 30,
        debugMode: false,
        maintenanceMode: false
    });

    const tabs = [
        { id: 'general', name: 'General', icon: Store },
        { id: 'notifications', name: 'Notificacions', icon: Bell },
        { id: 'operational', name: 'Operativa', icon: Palette },
        { id: 'system', name: 'Sistema', icon: Shield }
    ];

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/admin';
            return;
        }

        // Simulem càrrega configuració
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    const handleInputChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleToggleChange = (field) => {
        setSettings(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSave = async () => {
        setSaving(true);

        // Simulem guardar configuració
        setTimeout(() => {
            setSaving(false);
            alert('✅ Configuració guardada correctament!');
        }, 1000);
    };

    const ToggleSwitch = ({ checked, onChange, label, description }) => (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">{label}</label>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <button
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-terracotta-500' : 'bg-gray-200'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );

    const SettingSection = ({ title, children }) => (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner message="Carregant configuració..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Configuració</h1>
                        <p className="text-sm text-gray-600">Gestiona la configuració del sistema Terracotta</p>
                    </div>
                    <Button
                        icon={Save}
                        onClick={handleSave}
                        loading={saving}
                        disabled={saving}
                    >
                        Guardar Configuració
                    </Button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-terracotta-500 text-terracotta-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <SettingSection title="Informació del Negoci">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Nom del negoci"
                                        value={settings.businessName}
                                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                                    />
                                    <Input
                                        label="Email de contacte"
                                        type="email"
                                        value={settings.businessEmail}
                                        onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                                    />
                                    <Input
                                        label="Telèfon"
                                        value={settings.businessPhone}
                                        onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                                    />
                                    <Input
                                        label="Adreça"
                                        value={settings.businessAddress}
                                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                                    />
                                </div>
                            </SettingSection>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <SettingSection title="Preferències de Notificacions">
                                <div className="space-y-4">
                                    <ToggleSwitch
                                        checked={settings.emailNotifications}
                                        onChange={() => handleToggleChange('emailNotifications')}
                                        label="Notificacions per email"
                                        description="Rebre notificacions generals per email"
                                    />
                                    <ToggleSwitch
                                        checked={settings.smsNotifications}
                                        onChange={() => handleToggleChange('smsNotifications')}
                                        label="Notificacions SMS"
                                        description="Rebre alertes urgents per SMS"
                                    />
                                    <ToggleSwitch
                                        checked={settings.lowStockAlerts}
                                        onChange={() => handleToggleChange('lowStockAlerts')}
                                        label="Alertes de stock baix"
                                        description="Avisar quan el stock estigui per sota del mínim"
                                    />
                                    <ToggleSwitch
                                        checked={settings.bookingReminders}
                                        onChange={() => handleToggleChange('bookingReminders')}
                                        label="Recordatoris de reserves"
                                        description="Enviar recordatoris automàtics als clients"
                                    />
                                    <ToggleSwitch
                                        checked={settings.dailyReports}
                                        onChange={() => handleToggleChange('dailyReports')}
                                        label="Informes diaris"
                                        description="Rebre resum diari per email"
                                    />
                                </div>
                            </SettingSection>
                        </div>
                    )}

                    {activeTab === 'operational' && (
                        <div className="space-y-6">
                            <SettingSection title="Configuració Operativa">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Temps de cocció (dies)"
                                        type="number"
                                        value={settings.defaultCookingTime}
                                        onChange={(e) => handleInputChange('defaultCookingTime', parseInt(e.target.value))}
                                        hint="Dies necessaris per cuire les peces"
                                    />
                                    <Input
                                        label="Màxim reserves per franja"
                                        type="number"
                                        value={settings.maxBookingsPerSlot}
                                        onChange={(e) => handleInputChange('maxBookingsPerSlot', parseInt(e.target.value))}
                                        hint="Persones màximes simultànies"
                                    />
                                    <Input
                                        label="Dies antelació reserves"
                                        type="number"
                                        value={settings.bookingAdvanceDays}
                                        onChange={(e) => handleInputChange('bookingAdvanceDays', parseInt(e.target.value))}
                                        hint="Dies màxims per reservar amb antelació"
                                    />
                                    <Input
                                        label="Hores cancel·lació gratuïta"
                                        type="number"
                                        value={settings.cancellationHours}
                                        onChange={(e) => handleInputChange('cancellationHours', parseInt(e.target.value))}
                                        hint="Hores abans per cancel·lar sense cost"
                                    />
                                    <Input
                                        label="Preu per persona (€)"
                                        type="number"
                                        step="0.01"
                                        value={settings.pricePerPerson}
                                        onChange={(e) => handleInputChange('pricePerPerson', parseFloat(e.target.value))}
                                        hint="Preu base per reserva"
                                    />
                                </div>
                            </SettingSection>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <SettingSection title="Configuració del Sistema">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Freqüència de backup
                                        </label>
                                        <select
                                            value={settings.backupFrequency}
                                            onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                        >
                                            <option value="hourly">Cada hora</option>
                                            <option value="daily">Diari</option>
                                            <option value="weekly">Setmanal</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Timeout sessió (minuts)"
                                        type="number"
                                        value={settings.sessionTimeout}
                                        onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                                        hint="Temps abans de tancar sessió automàticament"
                                    />
                                </div>

                                <div className="space-y-4 pt-4">
                                    <ToggleSwitch
                                        checked={settings.debugMode}
                                        onChange={() => handleToggleChange('debugMode')}
                                        label="Mode debug"
                                        description="Activar logs detallats per debugging"
                                    />
                                    <ToggleSwitch
                                        checked={settings.maintenanceMode}
                                        onChange={() => handleToggleChange('maintenanceMode')}
                                        label="Mode manteniment"
                                        description="Bloquejar accés temporal al sistema públic"
                                    />
                                </div>
                            </SettingSection>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;