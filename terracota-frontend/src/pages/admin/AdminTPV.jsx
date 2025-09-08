import { useState } from 'react';
import { Search, Filter, ShoppingCart as CartIcon } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import ProductGrid from '../../components/admin/tpv/ProductGrid';
import ShoppingCart from '../../components/admin/tpv/ShoppingCart';
import CategoryFilter from '../../components/admin/common/CategoryFilter';
import PaymentModal from '../../components/admin/tpv/PaymentModal';
import SuccessModal from '../../components/admin/tpv/SuccessModal';
import { useTPV } from '../../hooks/useTPV';

const AdminTPV = () => {
    const {
        pieces,
        cart,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchTerm,
        setSearchTerm,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTotalItems,
        filteredPieces,
        processSale
    } = useTPV();

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastSale, setLastSale] = useState(null);

    const handleProcessSale = async (paymentData) => {
        try {
            const saleResult = await processSale(paymentData);
            setLastSale(saleResult);
            setShowPaymentModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error processant venda:', error);
        }
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
                        <CategoryFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />

                        {/* Products Grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <ProductGrid
                                products={filteredPieces}
                                onAddToCart={addToCart}
                                cartItems={cart}
                            />
                        </div>
                    </div>

                    {/* Right Panel - Shopping Cart */}
                    <ShoppingCart
                        items={cart}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeFromCart}
                        onClear={clearCart}
                        onCheckout={() => setShowPaymentModal(true)}
                        total={getTotalPrice()}
                        totalItems={getTotalItems()}
                    />
                </div>

                {/* Modals */}
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    total={getTotalPrice()}
                    onComplete={handleProcessSale}
                />

                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    sale={lastSale}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminTPV;