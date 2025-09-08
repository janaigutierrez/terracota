import { useState, useCallback } from 'react';

export const useTPV = () => {
    const [cart, setCart] = useState([]);
    const [processing, setProcessing] = useState(false);

    // Afegir al carret
    const addToCart = useCallback((piece) => {
        const existingItem = cart.find(item => item.id === piece.id);
        if (existingItem) {
            if (existingItem.quantity < piece.stock) {
                setCart(prev => prev.map(item =>
                    item.id === piece.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            }
        } else {
            setCart(prev => [...prev, { ...piece, quantity: 1 }]);
        }
    }, [cart]);

    // Actualitzar quantitat
    const updateQuantity = useCallback((id, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(id);
        } else {
            setCart(prev => prev.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            ));
        }
    }, []);

    // Eliminar del carret
    const removeFromCart = useCallback((id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    }, []);

    // Buidar carret
    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    // Calcular total
    const getTotalPrice = useCallback(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    // Calcular total items
    const getTotalItems = useCallback(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    // Processar venda
    const processSale = useCallback(async (paymentData) => {
        try {
            setProcessing(true);

            const saleData = {
                items: cart,
                total: getTotalPrice(),
                paymentMethod: paymentData.method,
                amountReceived: paymentData.amountReceived || getTotalPrice(),
                change: paymentData.change || 0,
                timestamp: new Date().toISOString()
            };

            // TODO: Enviar al backend
            // await apiRequest('/sales', { 
            //     method: 'POST', 
            //     body: JSON.stringify(saleData) 
            // });

            // Reset cart
            clearCart();

            return { success: true, sale: saleData };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setProcessing(false);
        }
    }, [cart, getTotalPrice, clearCart]);

    // Validar pagament
    const validatePayment = useCallback((paymentMethod, amountReceived) => {
        const total = getTotalPrice();

        if (paymentMethod === 'efectiu') {
            const received = parseFloat(amountReceived) || 0;
            return {
                isValid: received >= total,
                change: received - total,
                message: received < total ? `Falten €${(total - received).toFixed(2)}` : null
            };
        }

        return { isValid: true, change: 0, message: null };
    }, [getTotalPrice]);

    return {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTotalItems,
        processSale,
        validatePayment,
        processing
    };
};