import { Package, Edit, Trash2, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../../ui/Button';

const InventoryTable = ({
    items = [],
    onEdit,
    onDelete,
    onMovement,
    loading = false
}) => {
    const categoryEmojis = {
        tasses: '☕',
        plats: '🍽️',
        bols: '🥣',
        gerros: '🏺',
        accessoris: '✨',
        figures: '🧸'
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="animate-pulse p-6">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Article</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Categoria</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-900">Stock</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-900">Preu</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-900">Valor</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-900">Estat</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-900">Accions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500">
                                    No s'han trobat articles amb aquests filtres
                                </td>
                            </tr>
                        ) : (
                            items.map(item => (
                                <InventoryRow
                                    key={item.id}
                                    item={item}
                                    categoryEmojis={categoryEmojis}
                                    onEdit={() => onEdit?.(item)}
                                    onDelete={() => onDelete?.(item.id)}
                                    onMovement={() => onMovement?.(item)}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const InventoryRow = ({ item, categoryEmojis, onEdit, onDelete, onMovement }) => {
    const isLowStock = item.stock <= item.min_stock;

    return (
        <tr className={`hover:bg-gray-50 ${isLowStock ? 'bg-red-50' : ''}`}>
            <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className="inline-flex items-center space-x-1 text-sm text-gray-700 capitalize">
                    <span>{categoryEmojis[item.category]}</span>
                    <span>{item.category}</span>
                </span>
            </td>
            <td className="py-3 px-4 text-right">
                <div className="flex flex-col items-end">
                    <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.stock}
                    </span>
                    <span className="text-xs text-gray-500">
                        Mín: {item.min_stock}
                    </span>
                </div>
            </td>
            <td className="py-3 px-4 text-right">
                <span className="font-medium text-gray-900">€{item.price.toFixed(2)}</span>
            </td>
            <td className="py-3 px-4 text-right">
                <span className="font-medium text-gray-900">
                    €{(item.stock_value || (item.stock * item.price)).toFixed(2)}
                </span>
            </td>
            <td className="py-3 px-4 text-center">
                {isLowStock ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Stock baix
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        OK
                    </span>
                )}
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="ghost"
                        size="xs"
                        icon={TrendingUp}
                        onClick={onMovement}
                        title="Moviment d'stock"
                    />
                    <Button
                        variant="ghost"
                        size="xs"
                        icon={Edit}
                        onClick={onEdit}
                        title="Editar"
                    />
                    <Button
                        variant="ghost"
                        size="xs"
                        icon={Trash2}
                        onClick={onDelete}
                        title="Eliminar"
                        className="text-red-600 hover:text-red-700"
                    />
                </div>
            </td>
        </tr>
    );
};

export default InventoryTable;