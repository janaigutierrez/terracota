import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

const ProductGrid = ({
    products = [],
    onAddToCart,
    cartItems = [],
    loading = false
}) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 aspect-square rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No s'han trobat peces amb aquests filtres</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    inCart={cartItems.find(item => item.id === product.id)?.quantity || 0}
                />
            ))}
        </div>
    );
};

const ProductCard = ({ product, onAddToCart, inCart }) => {
    const isLowStock = product.stock <= 5;
    const isOutOfStock = product.stock === 0;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            onClick={() => !isOutOfStock && onAddToCart(product)}
        >
            <div className="aspect-square bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                )}

                {inCart > 0 && (
                    <div className="absolute top-1 right-1 bg-terracotta-500 text-white text-xs px-2 py-1 rounded-full">
                        {inCart}
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Esgotat</span>
                    </div>
                )}
            </div>

            <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{product.name}</h4>

            <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-terracotta-600">€{product.price}</span>
                <div className="text-right">
                    <span className={`text-xs ${isLowStock ? 'text-red-500' : 'text-gray-500'}`}>
                        Stock: {product.stock}
                    </span>
                    {isLowStock && !isOutOfStock && (
                        <div className="text-xs text-red-500 font-medium">Baix stock!</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductGrid;