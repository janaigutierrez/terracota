import React, { useState } from 'react';
import { Play, Euro } from 'lucide-react';
import BaseModal from '../modals/BaseModal';
import ModalFooter from '../modals/BaseModal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const OpenCashModal = ({ isOpen, onClose, onOpen }) => {
    const [openingAmount, setOpeningAmount] = useState('100.00');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onOpen(parseFloat(openingAmount));
            onClose();
            setOpeningAmount('100.00');
        } catch (error) {
            console.error('Error obrint caixa:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Obrir Caixa"
            icon={Play}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-sm text-gray-600">
                    <p>Esteu a punt d'obrir una nova sessió de caixa.</p>
                    <p>Introduïu l'import inicial d'efectiu disponible.</p>
                </div>

                <Input
                    label="Import inicial (€)"
                    type="number"
                    step="0.01"
                    min="0"
                    value={openingAmount}
                    onChange={(e) => setOpeningAmount(e.target.value)}
                    icon={Euro}
                    required
                    placeholder="100.00"
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm font-medium text-blue-800">
                            Recordatori
                        </p>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                        Compteu l'efectiu físic de la caixa abans d'obrir la sessió.
                        Aquest import ha de coincidir amb els diners reals disponibles.
                    </p>
                </div>

                <ModalFooter
                    onCancel={onClose}
                    onConfirm={handleSubmit}
                    confirmText="Obrir Caixa"
                    confirmIcon={Play}
                    loading={loading}
                    confirmClassName="bg-green-600 hover:bg-green-700"
                />
            </form>
        </BaseModal>
    );
};

export default OpenCashModal;