import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Banknote,
    Package,
    Search,
    Filter,
    Receipt,
    AlertCircle,
    CheckCircle,
    X
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminTPV = () => {
    const [selectedCategory, setSelectedCategory] = useState('totes');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('efectiu');
    const [amountReceived, setAmountReceived] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastSale, setLastSale] = useState(null);

    // Simulem dades de peces disponibles
    const [pieces, setPieces] = useState([
        // Tasses
        { id: 1, name: 'Tassa Petita 200ml', category: 'tasses', price: 6, stock: 15, image: '/api/placeholder/150/150' },
        { id: 2, name: 'Tassa Gran 350ml', category: 'tasses', price: 8, stock: 12, image: '/api/placeholder/150/150' },
        { id: 3, name: 'Tassa Temàtica', category: 'tasses', price: 10, stock: 8, image: '/api/placeholder/150/150' },

        // Plats
        { id: 4, name: 'Plat Petit 15cm', category: 'plats', price: 8, stock: 20, image: '/api/placeholder/150/150' },
        { id: 5, name: 'Plat Mitjà 20cm', category: 'plats', price: 12, stock: 15, image: '/api/placeholder/150/150' },
        { id: 6, name: 'Plat Gran 25cm', category: 'plats', price: 16, stock: 10, image: '/api/placeholder/150/150' },
        { id: 7, name: 'Plat Decoratiu', category: 'plats', price: 18, stock: 6, image: '/api/placeholder/150/150' },

        // Bols
        { id: 8, name: 'Bol Cereals', category: 'bols', price: 7, stock: 18, image: '/api/placeholder/150/150' },
        { id: 9, name: 'Bol Sopa', category: 'bols', price: 9, stock: 14, image: '/api/placeholder/150/150' },
        { id: 10, name: 'Bol Decoratiu', category: 'bols', price: 11, stock: 9, image: '/api/placeholder/150/150' },

        // Gerros
        { id: 11, name: 'Gerro Petit', category: 'gerros', price: 12, stock: 8, image: '/api/placeholder/150/150' },
        { id: 12, name: 'Gerro Mitjà', category: 'gerros', price: 18, stock: 5, image: '/api/placeholder/150/150' },
        { id: 13, name: 'Gerro Gran', category: 'gerros', price: 25, stock: 3, image: '/api/placeholder/150/150' },

        // Accessoris
        { id: 14, name: 'Imant Nevera', category: 'accessoris', price: 4, stock: 25, image: '/api/placeholder/150/150' },
        { id: 15, name: 'Portaveles', category: 'accessoris', price: 8, stock: 12, image: '/api/placeholder/150/150' },
        { id: 16, name: 'Ornament Petit', category: 'accessoris', price: 6, stock: 15, image: '/api/placeholder/150/150' },

        // Figures
        { id: 17, name: 'Gat Decoratiu', category: 'figures', price: 10, stock: 7, image: '/api/placeholder/150/150' },
        { id: 18, name: 'Gos Petit', category: 'figures', price: 8, stock: 9, image: '/api/placeholder/150/150' },
        { id: 19, name: 'Hucha Porc', category: 'figures', price: 15, stock: 4, image: '/api/placeholder/150/150' }
    ]);

    const categories = [
        { id: 'totes', name: 'Totes les peces', count: pieces.length },
        { id: 'tasses', name: 'Tasses', count: pieces.filter(p => p.category === 'tasses').length },
        { id: 'plats', name: 'Plats', count: pieces.filter(p => p.category === 'plats').length },
        { id: 'bols', name: 'Bols', count: pieces.filter(p => p.category === 'bols').length },
        { id: 'gerros', name: 'Gerros', count: pieces.filter(p => p.category === 'gerros').length },
        { id: 'accessoris', name: 'Accessoris', count: pieces.filter(p => p.category === 'accessoris').length },
        { id: 'figures', name: 'Figures', count: pieces.filter(p => p.category === 'figures').length }
    ];

    // Filtrar peces segons categoria i cerca
    const filteredPieces = pieces.filter(piece => {
        const matchesCategory = selectedCategory === 'totes' || piece.category === selectedCategory;
        const matchesSearch = piece.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch && piece.stock > 0;
    });

    // Funcions del carret
    const addToCart = (piece) => {
        const existingItem = cart.find(item => item.id === piece.id);
        if (existingItem) {
            if (existingItem.quantity < piece.stock) {
                setCart(cart.map(item =>
                    item.id === piece.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            }
        } else {
            setCart([...cart, { ...piece, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(id);
        } else {
            const piece = pieces.find(p => p.id === id);
            if (newQuantity <= piece.stock) {
                setCart(cart.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                ));
            }
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getChange = () => {
        const received = parseFloat(amountReceived) || 0;
        const total = getTotalPrice();
        return received - total;
    };

    // Processar venda
    const processSale = async () => {
        try {
            const saleData = {
                items: cart,
                total: getTotalPrice(),
                paymentMethod,
                amountReceived: paymentMethod === 'efectiu' ? parseFloat(amountReceived) : getTotalPrice(),
                change: paymentMethod === 'efectiu' ? getChange() : 0,
                timestamp: new Date().toISOString()
            };

            // TODO: Enviar al backend
            // await apiRequest('/sales', { method: 'POST', body: JSON.stringify(saleData) });

            // Actualitzar stock localment
            const updatedPieces = pieces.map(piece => {
                const cartItem = cart.find(item => item.id === piece.id);
                if (cartItem) {
                    return { ...piece, stock: piece.stock - cartItem.quantity };
                }
                return piece;
            });
            setPieces(updatedPieces);

            // Guardar última venda
            setLastSale(saleData);

            // Reset
            clearCart();
            setPaymentMethod('efectiu');
            setAmountReceived('');
            setShowPaymentModal(false);
            setShowSuccessModal(true);

            console.log('Venda processada:', saleData);
        } catch (error) {
            console.error('Error processant venda:', error);
        }
    };

    const canCompleteSale = () => {
        if (paymentMethod === 'efectiu') {
            const received = parseFloat(amountReceived) || 0;
            return received >= getTotalPrice();
        }
        return true; // Per targeta sempre es pot
    };

    return (
        <AdminLayout>
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">TPV Ràpid</h1>
                            <p className="text-sm text-gray-500">Venda directa de peces ceràmiques</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {cart.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Buidar carret
                                </button>
                            )}
                            <div className="bg-terracotta-100 px-3 py-1 rounded-lg">
                                <span className="text-sm font-medium text-terracotta-700">
                                    {getTotalItems()} articles - €{getTotalPrice().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel - Categories & Products */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Search & Filters */}
                        <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 p-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar peces..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Filter className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">Categories:</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
                            <div className="flex space-x-2 overflow-x-auto">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id
                                                ? 'bg-terracotta-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.name} ({category.count})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                {filteredPieces.map(piece => (
                                    <ProductCard
                                        key={piece.id}
                                        piece={piece}
                                        onAddToCart={addToCart}
                                        inCart={cart.find(item => item.id === piece.id)?.quantity || 0}
                                    />
                                ))}
                            </div>
                            {filteredPieces.length === 0 && (
                                <div className="text-center py-12">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No s'han trobat peces amb aquests filtres</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Shopping Cart */}
                    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                        <div className="flex-shrink-0 bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Carret ({getTotalItems()})
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {cart.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>El carret està buit</p>
                                    <p className="text-sm">Afegeix peces per començar la venda</p>
                                </div>
                            ) : (
                                <div className="p-4 space-y-3">
                                    {cart.map(item => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            onUpdateQuantity={updateQuantity}
                                            onRemove={removeFromCart}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="flex-shrink-0 border-t border-gray-200 p-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total:</span>
                                        <span>€{getTotalPrice().toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={() => setShowPaymentModal(true)}
                                        className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                                    >
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Processar Pagament
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Modal */}
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    total={getTotalPrice()}
                    paymentMethod={paymentMethod}
                    onPaymentMethodChange={setPaymentMethod}
                    amountReceived={amountReceived}
                    onAmountReceivedChange={setAmountReceived}
                    change={getChange()}
                    canComplete={canCompleteSale()}
                    onComplete={processSale}
                />

                {/* Success Modal */}
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    sale={lastSale}
                />
            </div>
        </AdminLayout>
    );
};

// Component ProductCard
const ProductCard = ({ piece, onAddToCart, inCart }) => {
    const isLowStock = piece.stock <= 5;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onAddToCart(piece)}
        >
            <div className="aspect-square bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                <img
                    src={piece.image}
                    alt={piece.name}
                    className="w-full h-full object-cover"
                />
                {inCart > 0 && (
                    <div className="absolute top-1 right-1 bg-terracotta-500 text-white text-xs px-2 py-1 rounded-full">
                        {inCart}
                    </div>
                )}
            </div>
            <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{piece.name}</h4>
            <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-terracotta-600">€{piece.price}</span>
                <div className="text-right">
                    <span className={`text-xs ${isLowStock ? 'text-red-500' : 'text-gray-500'}`}>
                        Stock: {piece.stock}
                    </span>
                    {isLowStock && (
                        <div className="text-xs text-red-500 font-medium">Baix stock!</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Component CartItem
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                <p className="text-sm text-gray-500">€{item.price} c/u</p>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                    <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                    <Plus className="w-3 h-3" />
                </button>
                <button
                    onClick={() => onRemove(item.id)}
                    className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center ml-2"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

// Component PaymentModal
const PaymentModal = ({
    isOpen,
    onClose,
    total,
    paymentMethod,
    onPaymentMethodChange,
    amountReceived,
    onAmountReceivedChange,
    change,
    canComplete,
    onComplete
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Processar Pagament</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-center">
                            <span className="text-2xl font-bold text-terracotta-600">€{total.toFixed(2)}</span>
                            <p className="text-sm text-gray-500">Total a pagar</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mètode de pagament
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => onPaymentMethodChange('efectiu')}
                                className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 ${paymentMethod === 'efectiu'
                                        ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Banknote className="w-5 h-5" />
                                <span>Efectiu</span>
                            </button>
                            <button
                                onClick={() => onPaymentMethodChange('targeta')}
                                className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 ${paymentMethod === 'targeta'
                                        ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>Targeta</span>
                            </button>
                        </div>
                    </div>

                    {paymentMethod === 'efectiu' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Import rebut
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amountReceived}
                                onChange={(e) => onAmountReceivedChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                            />
                            {change >= 0 && amountReceived && (
                                <div className="mt-2 p-2 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-700">
                                        Canvi a retornar: <span className="font-bold">€{change.toFixed(2)}</span>
                                    </p>
                                </div>
                            )}
                            {change < 0 && amountReceived && (
                                <div className="mt-2 p-2 bg-red-50 rounded-lg">
                                    <p className="text-sm text-red-700">
                                        Import insuficient: falten <span className="font-bold">€{Math.abs(change).toFixed(2)}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex space-x-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel·lar
                        </button>
                        <button
                            onClick={onComplete}
                            disabled={!canComplete}
                            className="flex-1 px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Completar Venda
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Component SuccessModal
const SuccessModal = ({ isOpen, onClose, sale }) => {
    if (!isOpen || !sale) return null;

    const printReceipt = () => {
        // TODO: Implementar impressió de tiquet
        console.log('Imprimint tiquet:', sale);
        alert('Funcionalitat d\'impressió en desenvolupament');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Venda Completada!</h3>
                    <p className="text-gray-600 mb-4">La venda s'ha processat correctament</p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Total:</span>
                                <span className="font-semibold">€{sale.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Pagament:</span>
                                <span className="capitalize">{sale.paymentMethod}</span>
                            </div>
                            {sale.paymentMethod === 'efectiu' && (
                                <>
                                    <div className="flex justify-between">
                                        <span>Rebut:</span>
                                        <span>€{sale.amountReceived.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Canvi:</span>
                                        <span>€{sale.change.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={printReceipt}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                        >
                            <Receipt className="w-4 h-4 mr-2" />
                            Imprimir Tiquet
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600"
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminTPV;