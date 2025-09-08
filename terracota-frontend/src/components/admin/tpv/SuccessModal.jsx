import React from 'react';
import { CheckCircle, Receipt, Printer } from 'lucide-react';
import BaseModal from '../modals/BaseModal';
import Button from '../../ui/Button';

const SuccessModal = ({ isOpen, onClose, sale }) => {
    if (!sale) return null;

    const printReceipt = () => {
        // TODO: Implementar impressió real
        console.log('Imprimint tiquet:', sale);
        alert('Funcionalitat d\'impressió en desenvolupament');
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Venda Completada"
            icon={CheckCircle}
        >
            <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Venda Processada Correctament!
                    </h3>
                    <p className="text-gray-600">
                        La transacció s'ha completat amb èxit
                    </p>
                </div>

                {/* Sale Summary */}
                <div className="bg-gray-50 p-4 rounded-lg text-left space-y-3">
                    <h4 className="font-medium text-gray-900 mb-3">Resum de la venda:</h4>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Articles:</span>
                            <span>{sale.items?.length || 0} peces</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-semibold">€{sale.total?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pagament:</span>
                            <span className="capitalize">{sale.paymentMethod}</span>
                        </div>
                        {sale.paymentMethod === 'efectiu' && (
                            <>
                                <div className="flex justify-between">
                                    <span>Rebut:</span>
                                    <span>€{sale.amountReceived?.toFixed(2)}</span>
                                </div>
                                {sale.change > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Canvi:</span>
                                        <span>€{sale.change?.toFixed(2)}</span>
                                    </div>
                                )}
                            </>
                        )}
                        <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                            <span>Data:</span>
                            <span>{new Date(sale.timestamp).toLocaleString('ca-ES')}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={printReceipt}
                        icon={Printer}
                        className="flex-1"
                    >
                        Imprimir Tiquet
                    </Button>
                    <Button
                        onClick={onClose}
                        className="flex-1"
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

export default SuccessModal;