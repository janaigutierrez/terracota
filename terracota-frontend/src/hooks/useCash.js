// ========================================
// 1. src/hooks/useCash.js
// ========================================
import { useState, useEffect } from 'react';

export const useCash = () => {
    const [cashSession, setCashSession] = useState(null);
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mock data inicial
    useEffect(() => {
        setTimeout(() => {
            setCashSession({
                id: 1,
                date: new Date().toISOString().split('T')[0],
                opening_amount: 100.00,
                current_amount: 247.50,
                status: 'open',
                opened_at: '09:00',
                opened_by: 'Laura'
            });

            setMovements([
                {
                    id: 1,
                    type: 'in',
                    amount: 12.50,
                    description: 'Venda TPV - Tassa groga',
                    timestamp: '10:30',
                    user: 'Laura'
                },
                {
                    id: 2,
                    type: 'in',
                    amount: 25.00,
                    description: 'Venda efectiu - 2 plats',
                    timestamp: '11:15',
                    user: 'Janai'
                },
                {
                    id: 3,
                    type: 'out',
                    amount: 15.00,
                    description: 'Compra cafè proveïdor',
                    timestamp: '12:00',
                    user: 'Laura'
                }
            ]);

            setLoading(false);
        }, 1000);
    }, []);

    const openCash = async (openingAmount) => {
        setLoading(true);
        try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setCashSession({
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                opening_amount: openingAmount,
                current_amount: openingAmount,
                status: 'open',
                opened_at: new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }),
                opened_by: 'Admin'
            });

            setMovements([]);
        } catch (err) {
            setError('Error obrint caixa');
        } finally {
            setLoading(false);
        }
    };

    const closeCash = async (notes) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setCashSession(prev => ({
                ...prev,
                status: 'closed',
                closed_at: new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }),
                closing_notes: notes
            }));
        } catch (err) {
            setError('Error tancant caixa');
        } finally {
            setLoading(false);
        }
    };

    const addMovement = async (movement) => {
        try {
            const newMovement = {
                id: Date.now(),
                ...movement,
                timestamp: new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }),
                user: 'Admin'
            };

            setMovements(prev => [newMovement, ...prev]);

            // Actualitzar amount actual
            setCashSession(prev => ({
                ...prev,
                current_amount: movement.type === 'in'
                    ? prev.current_amount + movement.amount
                    : prev.current_amount - movement.amount
            }));
        } catch (err) {
            setError('Error afegint moviment');
        }
    };

    const getStats = () => {
        const totalIn = movements
            .filter(m => m.type === 'in')
            .reduce((sum, m) => sum + m.amount, 0);

        const totalOut = movements
            .filter(m => m.type === 'out')
            .reduce((sum, m) => sum + m.amount, 0);

        return {
            totalIn,
            totalOut,
            movementCount: movements.length,
            netAmount: totalIn - totalOut
        };
    };

    return {
        cashSession,
        movements,
        loading,
        error,
        openCash,
        closeCash,
        addMovement,
        getStats
    };
};