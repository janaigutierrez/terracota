import React, { useState } from 'react';
import { X, Banknote, CreditCard, Euro } from 'lucide-react';
import BaseModal from '../modals/BaseModal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const PaymentModal = ({ isOpen, onClose, total, onComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState('efectiu');
    const [amountReceived, setAmountReceived] = useState('');
    const [loading, setLoading] = useState(false);

    const change = paymentMethod === 'efectiu'
        ? (parseFloat(amountReceived) || 0) - total
        : 0;

    const canComplete = paymentMethod === 'targeta' ||
        (paymentMethod === 'efectiu' && change >= 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canComplete) return;

        setLoading(true);
        try {
            await onComplete({
                paymentMethod,
                amountReceived: paymentMethod === 'efectiu' ? parseFloat(amountReceived) : total,
                change: Math.max(0, change)
            });

            // Reset form
            setPaymentMethod('efectiu');
            setAmountReceived('');
        } catch (error) {
            console.error('Error processant pagament:', error);
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = [
        {
            id: 'efectiu',
            label: 'Efectiu',
            icon: Banknote,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            id: 'targeta',
            label: 'Targeta',
            icon: CreditCard,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        }
    ];

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Processar Pagament"
            icon={CreditCard}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Total */}
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <span className="text-3xl font-bold text-terracotta-600">
                        €{total.toFixed(2)}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">Total a pagar</p>
                </div>

                {/* Payment Methods */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Mètode de pagament
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.map((method) => {
                            const Icon = method.icon;
                            return (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${paymentMethod === method.id
                                            ? 'border-terracotta-300 bg-terracotta-50 text-terracotta-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${method.bgColor}`}>
                                        <Icon className={`w-5 h-5 ${method.color}`} />
                                    </div>
                                    <span className="font-medium">{method.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Cash Amount Input */}
                {paymentMethod === 'efectiu' && (
                    <div>
                        <Input
                            label="Import rebut (€)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            icon={Euro}
                            placeholder={total.toFixed(2)}
                            required
                        />

                        {amountReceived && (
                            <div className={`mt-3 p-3 rounded-lg ${change >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                                }`}>
                                <p className={`text-sm font-medium ${change >= 0 ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {change >= 0
                                        ? `Canvi a retornar: €${change.toFixed(2)}`
                                        : `Import insuficient: falten €${Math.abs(change).toFixed(2)}`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel·lar
                    </Button>
                    <Button
                        type="submit"
                        disabled={!canComplete || loading}
                        loading={loading}
                        className="flex-1"
                    >
                        Completar Venda
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};

export default PaymentModal;
