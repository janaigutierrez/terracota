import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Euro } from 'lucide-react';
import BaseModal from '../modals/BaseModal';
import ModalFooter from '../modals/BaseModal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const MovementModal = ({ isOpen, onClose, onAdd }) => {
    const [type, setType] = useState('in');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const movementTypes = [
        {
            value: 'in',
            label: 'Entrada',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            examples: 'Venda efectiu, canvi inicial, altres ingressos'
        },
        {
            value: 'out',
            label: 'Sortida',
            icon: TrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            examples: 'Compres, canvi a clients, despeses'
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onAdd({
                type,
                amount: parseFloat(amount),
                description
            });

            onClose();
            setAmount('');
            setDescription('');
            setType('in');
        } catch (error) {
            console.error('Error afegint moviment:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedType = movementTypes.find(t => t.value === type);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Afegir Moviment"
            icon={Plus}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tipus de moviment
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {movementTypes.map((movementType) => {
                            const Icon = movementType.icon;
                            return (
                                <button
                                    key={movementType.value}
                                    type="button"
                                    onClick={() => setType(movementType.value)}
                                    className={`p-4 border rounded-lg text-left transition-all ${type === movementType.value
                                            ? 'border-terracotta-300 bg-terracotta-50 ring-2 ring-terracotta-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${movementType.bgColor}`}>
                                            <Icon className={`w-5 h-5 ${movementType.color}`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {movementType.label}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {movementType.examples}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <Input
                    label="Import (€)"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    icon={Euro}
                    required
                    placeholder="0.00"
                />

                <Input
                    label="Descripció"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder={`Descripció del ${selectedType?.label.toLowerCase()}...`}
                    hint="Descriu breument el motiu del moviment"
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Vista prèvia:</strong> {selectedType?.label} de €{amount || '0.00'}
                        {description && ` - ${description}`}
                    </p>
                </div>

                <ModalFooter
                    onCancel={onClose}
                    onConfirm={handleSubmit}
                    confirmText="Afegir Moviment"
                    confirmIcon={Plus}
                    loading={loading}
                    confirmClassName="bg-terracotta-600 hover:bg-terracotta-700"
                />
            </form>
        </BaseModal>
    );
};

export default MovementModal;