import React, { useState } from 'react';
import { Square, AlertTriangle } from 'lucide-react';
import BaseModal from '../modals/BaseModal';
import ModalFooter from '../modals/BaseModal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const CloseCashModal = ({ isOpen, onClose, cashSession, onCloseCash }) => {
    const [physicalCount, setPhysicalCount] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const expectedAmount = cashSession?.current_amount || 0;
    const countedAmount = parseFloat(physicalCount) || 0;
    const difference = countedAmount - expectedAmount;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onCloseCash({
                notes,
                physical_count: countedAmount,
                difference
            });
            onClose();
            setPhysicalCount('');
            setNotes('');
        } catch (error) {
            console.error('Error tancant caixa:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Tancar Caixa"
            icon={Square}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-700">Import esperat:</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    €{expectedAmount.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Import físic:</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    €{countedAmount.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {physicalCount && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className={`flex items-center space-x-2 ${Math.abs(difference) < 0.01
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }`}>
                                    {Math.abs(difference) >= 0.01 && (
                                        <AlertTriangle className="w-4 h-4" />
                                    )}
                                    <p className="font-medium">
                                        Diferència: {difference >= 0 ? '+' : ''}€{difference.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <Input
                        label="Recompte físic (€)"
                        type="number"
                        step="0.01"
                        min="0"
                        value={physicalCount}
                        onChange={(e) => setPhysicalCount(e.target.value)}
                        required
                        placeholder={expectedAmount.toFixed(2)}
                        hint="Compteu l'efectiu físic de la caixa"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes de tancament
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Incidències, observacions o comentaris..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {Math.abs(difference) >= 0.01 && physicalCount && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <p className="text-sm font-medium text-yellow-800">
                                Atenció: Hi ha diferència en el recompte
                            </p>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                            L'import físic no coincideix amb l'esperat. Reviseu el recompte
                            i afegiu una nota explicativa si cal.
                        </p>
                    </div>
                )}

                <ModalFooter
                    onCancel={onClose}
                    onConfirm={handleSubmit}
                    confirmText="Tancar Caixa"
                    confirmIcon={Square}
                    loading={loading}
                    confirmClassName="bg-red-600 hover:bg-red-700"
                />
            </form>
        </BaseModal>
    );
};

export default CloseCashModal;