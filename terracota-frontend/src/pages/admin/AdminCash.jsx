import { useState, useEffect } from 'react';
import { PiggyBank, Calculator, Plus, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/admin/common/StatCard';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/admin/common/LoadingSpinner';
import CashStatus from '../../components/admin/cash/CashStatus';
import CashActions from '../../components/admin/cash/CashActions';
import MovementsList from '../../components/admin/cash/MovementsList';
import OpenCashModal from '../../components/admin/cash/OpenCashModal';
import CloseCashModal from '../../components/admin/cash/CloseCashModal';
import MovementModal from '../../components/admin/cash/MovementModal';
import { useCash } from '../../hooks/useCash';
import { isAuthenticated } from '/src/utils/constants';

const AdminCash = () => {
    const {
        cashSession,
        movements,
        loading,
        error,
        openCash,
        closeCash,
        addMovement,
        getStats
    } = useCash();

    // UI State
    const [showOpenModal, setShowOpenModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showMovementModal, setShowMovementModal] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            window.location.href = '/admin';
            return;
        }
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <LoadingSpinner message="Carregant gestió de caixa..." />
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="text-center py-12">
                    <p className="text-red-600">Error: {error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Tornar a intentar
                    </Button>
                </div>
            </AdminLayout>
        );
    }

    const stats = getStats();
    const isCashOpen = cashSession?.status === 'open';

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestió de Caixa</h1>
                        <p className="text-sm text-gray-600">
                            Control d'efectiu i moviments diaris
                        </p>
                    </div>
                    <CashActions
                        isCashOpen={isCashOpen}
                        onOpenCash={() => setShowOpenModal(true)}
                        onCloseCash={() => setShowCloseModal(true)}
                        onAddMovement={() => setShowMovementModal(true)}
                    />
                </div>

                {/* Cash Status */}
                <CashStatus
                    session={cashSession}
                    isCashOpen={isCashOpen}
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Fons Actual"
                        value={`€${cashSession?.current_amount?.toFixed(2) || '0.00'}`}
                        icon={PiggyBank}
                        color="terracotta"
                    />
                    <StatCard
                        title="Entrades Avui"
                        value={`€${stats.totalIn.toFixed(2)}`}
                        icon={TrendingUp}
                        color="green"
                    />
                    <StatCard
                        title="Sortides Avui"
                        value={`€${stats.totalOut.toFixed(2)}`}
                        icon={TrendingDown}
                        color="red"
                    />
                    <StatCard
                        title="Moviments"
                        value={stats.movementCount}
                        icon={Receipt}
                        color="blue"
                    />
                </div>

                {/* Movements List */}
                <MovementsList
                    movements={movements}
                    loading={loading}
                />

                {/* Modals */}
                <OpenCashModal
                    isOpen={showOpenModal}
                    onClose={() => setShowOpenModal(false)}
                    onOpen={openCash}
                />

                <CloseCashModal
                    isOpen={showCloseModal}
                    onClose={() => setShowCloseModal(false)}
                    cashSession={cashSession}
                    onCloseCash={closeCash}
                />

                <MovementModal
                    isOpen={showMovementModal}
                    onClose={() => setShowMovementModal(false)}
                    onAdd={addMovement}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminCash;