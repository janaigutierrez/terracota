import React from 'react';
import { Clock, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

const CashStatus = ({ session, isCashOpen }) => {
    if (!session) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="text-center">
                    <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Caixa Tancada</h3>
                    <p className="text-sm text-gray-600">No hi ha cap sessió de caixa oberta</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`border rounded-lg p-6 ${isCashOpen
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {isCashOpen ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                        <XCircle className="w-8 h-8 text-red-600" />
                    )}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Caixa {isCashOpen ? 'Oberta' : 'Tancada'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            Sessió del {session.date}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                        €{session.current_amount?.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Fons actual</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Data: {session.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                        Obertura: {session.opened_at}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Per: {session.opened_by}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-600">
                        Inicial: €{session.opening_amount?.toFixed(2)}
                    </span>
                </div>
                {!isCashOpen && session.closed_at && (
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                            Tancament: {session.closed_at}
                        </span>
                    </div>
                )}
            </div>

            {session.closing_notes && (
                <div className="mt-4 p-3 bg-white rounded border">
                    <p className="text-sm font-medium text-gray-700">Notes de tancament:</p>
                    <p className="text-sm text-gray-600">{session.closing_notes}</p>
                </div>
            )}
        </div>
    );
};

export default CashStatus;