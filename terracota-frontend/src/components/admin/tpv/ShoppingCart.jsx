import { ShoppingCart as CartIcon, Plus, Minus, Trash2, CreditCard, Package } from 'lucide-react';
import Button from '../../ui/Button';

const ShoppingCart = ({
    items = [],
    onUpdateQuantity,
    onRemove,
    onClear,
    onCheckout,
    total = 0,
    totalItems = 0,
    processing = false,
    className = ''
}) => {
    return (
        <div className={`w-80 bg-white border-l border-gray-200 flex flex-col ${className}`}>
            {/* Header */}
            <div className="flex-shrink-0 bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <CartIcon className="w-5 h-5 mr-2" />
                        Carret ({totalItems})
                    </h3>
                    {items.length > 0 && (
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={onClear}
                            className="text-red-600 hover:text-red-700"
                        >
                            Buidar
                        </Button>
                    )}
                </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className="p-4 space-y-3">
                        {items.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemove={onRemove}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Checkout Footer */}
            {items.length > 0 && (
                <div className="flex-shrink-0 border-t border-gray-200 p-4">
                    <div className="space-y-4">
                        <CartSummary total={total} />
                        <Button
                            onClick={onCheckout}
                            disabled={processing || items.length === 0}
                            loading={processing}
                            icon={CreditCard}
                            className="w-full"
                            size="lg"
                        >
                            Processar Pagament
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Empty Cart State
const EmptyCart = () => (
    <div className="p-8 text-center text-gray-500">
        <CartIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">El carret està buit</p>
        <p className="text-sm">Afegeix peces per començar la venda</p>
    </div>
);

// Individual Cart Item
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const canIncrease = item.quantity < (item.stock || 999);
    const canDecrease = item.quantity > 1;
    const itemTotal = item.price * item.quantity;

    return (
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
            {/* Product Image */}
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Package className="w-6 h-6 text-gray-400" />
                )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">€{item.price.toFixed(2)} c/u</span>
                    <span className="text-sm font-semibold text-terracotta-600">
                        €{itemTotal.toFixed(2)}
                    </span>
                </div>
                {item.stock && item.stock <= 5 && (
                    <div className="text-xs text-orange-500 mt-1">
                        Només {item.stock} disponibles
                    </div>
                )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-1">
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={!canDecrease}
                    className="w-7 h-7 p-0 rounded-full"
                    title="Reduir quantitat"
                >
                    <Minus className="w-3 h-3" />
                </Button>

                <span className="w-8 text-center text-sm font-medium px-1">
                    {item.quantity}
                </span>

                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={!canIncrease}
                    className="w-7 h-7 p-0 rounded-full"
                    title="Augmentar quantitat"
                >
                    <Plus className="w-3 h-3" />
                </Button>

                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onRemove(item.id)}
                    className="w-7 h-7 p-0 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                    title="Eliminar del carret"
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
};

// Cart Summary
const CartSummary = ({
    total,
    subtotal,
    discount = 0,
    tax = 0,
    showBreakdown = false
}) => {
    if (showBreakdown) {
        return (
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>€{(subtotal || total).toFixed(2)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Descompte:</span>
                        <span>-€{discount.toFixed(2)}</span>
                    </div>
                )}
                {tax > 0 && (
                    <div className="flex justify-between text-gray-600">
                        <span>IVA:</span>
                        <span>€{tax.toFixed(2)}</span>
                    </div>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-terracotta-600">€{total.toFixed(2)}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-terracotta-600">€{total.toFixed(2)}</span>
        </div>
    );
};

// Quick Add Item (per si es vol afegir des de fora)
const QuickAddItem = ({ onAdd, disabled = false }) => (
    <div className="p-4 border-t border-gray-200">
        <Button
            onClick={onAdd}
            disabled={disabled}
            variant="outline"
            icon={Plus}
            className="w-full"
            size="sm"
        >
            Afegir article ràpid
        </Button>
    </div>
);

export default ShoppingCart;
export { CartSummary, CartItem, EmptyCart, QuickAddItem };