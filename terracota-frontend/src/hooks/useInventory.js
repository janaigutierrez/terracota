import { useState, useEffect, useCallback } from 'react';
import { adminApiRequest, API_ENDPOINTS } from '../utils/constants';

export const useInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data - després connectar amb API real
    const mockInventory = [
        {
            id: 1,
            name: 'Tassa estàndard 300ml',
            category: 'tasses',
            price: 8.00,
            stock: 15,
            min_stock: 10,
            cost_price: 2.50,
            description: 'Tassa ceràmica per pintar, mida estàndard',
            active: true,
            last_movement: '2025-01-07',
            total_sold: 45,
            created_at: '2024-11-15',
            stock_value: 120.00
        },
        // ... més items
    ];

    const mockCategories = [
        { id: 'tasses', name: 'Tasses', count: 1, icon: '☕' },
        { id: 'plats', name: 'Plats', count: 1, icon: '🍽️' },
        { id: 'bols', name: 'Bols', count: 1, icon: '🥣' },
        { id: 'gerros', name: 'Gerros', count: 1, icon: '🏺' },
        { id: 'accessoris', name: 'Accessoris', count: 1, icon: '✨' },
        { id: 'figures', name: 'Figures', count: 0, icon: '🧸' }
    ];

    // Carregar inventari
    const fetchInventory = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Implementar endpoint backend
            // const response = await adminApiRequest(API_ENDPOINTS.inventory.list);

            // Simulem dades per ara
            setTimeout(() => {
                setInventory(mockInventory);
                setCategories([
                    { id: 'all', name: 'Totes', count: mockInventory.length, icon: '📦' },
                    ...mockCategories
                ]);
                setLoading(false);
            }, 500);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, []);

    // Crear article
    const createItem = useCallback(async (formData) => {
        try {
            // TODO: Implementar endpoint backend
            const newItem = {
                id: Date.now(),
                ...formData,
                price: parseFloat(formData.price),
                cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
                stock: parseInt(formData.stock),
                min_stock: parseInt(formData.min_stock),
                total_sold: 0,
                last_movement: new Date().toISOString().split('T')[0],
                created_at: new Date().toISOString().split('T')[0],
                stock_value: parseInt(formData.stock) * parseFloat(formData.price)
            };

            setInventory(prev => [...prev, newItem]);
            return { success: true, item: newItem };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    // Actualitzar article
    const updateItem = useCallback(async (itemId, formData) => {
        try {
            const updatedInventory = inventory.map(item =>
                item.id === itemId
                    ? {
                        ...item,
                        ...formData,
                        price: parseFloat(formData.price),
                        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
                        stock: parseInt(formData.stock),
                        min_stock: parseInt(formData.min_stock),
                        stock_value: parseInt(formData.stock) * parseFloat(formData.price)
                    }
                    : item
            );

            setInventory(updatedInventory);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, [inventory]);

    // Eliminar article
    const deleteItem = useCallback(async (itemId) => {
        try {
            setInventory(prev => prev.filter(item => item.id !== itemId));
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, []);

    // Registrar moviment d'stock
    const registerMovement = useCallback(async (itemId, movementData) => {
        try {
            const item = inventory.find(item => item.id === itemId);
            if (!item) throw new Error('Article no trobat');

            const quantity = parseInt(movementData.quantity);
            const isIncoming = movementData.type === 'in';
            const newStock = isIncoming ? item.stock + quantity : item.stock - quantity;

            if (newStock < 0) {
                throw new Error('No pots treure més stock del que hi ha disponible');
            }

            const updatedInventory = inventory.map(item =>
                item.id === itemId
                    ? {
                        ...item,
                        stock: newStock,
                        last_movement: new Date().toISOString().split('T')[0],
                        stock_value: newStock * item.price
                    }
                    : item
            );

            setInventory(updatedInventory);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    }, [inventory]);

    // Filtrar inventari
    const filterInventory = useCallback((
        items,
        { category = 'all', search = '', showAlerts = false, sortBy = 'name', sortOrder = 'asc' }
    ) => {
        return items
            .filter(item => {
                const matchesCategory = category === 'all' || item.category === category;
                const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
                const matchesAlerts = !showAlerts || item.stock <= item.min_stock;
                return matchesCategory && matchesSearch && matchesAlerts;
            })
            .sort((a, b) => {
                let aValue = a[sortBy];
                let bValue = b[sortBy];

                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (sortOrder === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
    }, []);

    // Estadístiques
    const getStats = useCallback(() => {
        return {
            totalItems: inventory.length,
            lowStock: inventory.filter(item => item.stock <= item.min_stock).length,
            totalValue: inventory.reduce((sum, item) => sum + (item.stock * item.price), 0),
            totalCost: inventory.reduce((sum, item) => sum + (item.stock * (item.cost_price || 0)), 0)
        };
    }, [inventory]);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    return {
        inventory,
        categories,
        loading,
        error,
        createItem,
        updateItem,
        deleteItem,
        registerMovement,
        filterInventory,
        getStats,
        refetch: fetchInventory
    };
};