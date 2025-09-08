import React from 'react';
import { TrendingUp, TrendingDown, Clock, User } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const MovementsList = ({ movements, loading }) => {
    if (loading) {
        return <LoadingSpinner message="Carregant moviments..." />;
    }

    if (!movements || movements.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Cap moviment avui</h3>
                    <p className="text-sm text-gray-600">
                        Els moviments de caixa apareixeran aquí
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Moviments d'Avui
                </h3>
                <p className="text-sm text-gray-600">
                    {movements.length} moviment{movements.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="divide-y divide-gray-200">
                {movements.map((movement) => (
                    <div
                        key={movement.id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${movement.type === 'in'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-600'
                                    }`}>
                                    {movement.type === 'in' ? (
                                        <TrendingUp className="w-5 h-5" />
                                    ) : (
                                        <TrendingDown className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {movement.description}
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{movement.timestamp}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <User className="w-4 h-4" />
                                            <span>{movement.user}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-lg font-semibold ${movement.type === 'in'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }`}>
                                    {movement.type === 'in' ? '+' : '-'}€{movement.amount.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovementsList;