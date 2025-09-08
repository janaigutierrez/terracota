import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import BaseModal from '../modals/BaseModal';
import Button from '../../ui/Button';

// Mock data (després connectar amb inventari)
const AVAILABLE_PIECES = [
    { id: 1, name: 'Tassa Petita 200ml', price: 6, category: 'tasses' },
    { id: 2, name: 'Tassa Gran 350ml', price: 8, category: 'tasses' },
    { id: 3, name: 'Tassa Temàtica', price: 10, category: 'tasses' },
    { id: 4, name: 'Plat Petit 15cm', price: 8, category: 'plats' },
    { id: 5, name: 'Plat Mitjà 20cm', price: 12, category: 'plats' },
    { id: 6, name: 'Plat Gran 25cm', price: 16, category: 'plats' },
    { id: 7, name: 'Bol Cereals', price: 7, category: 'bols' },
    { id: 8, name: 'Bol Decoratiu', price: 11, category: 'bols' },
    { id: 9, name: 'Gerro Petit', price: 12, category: 'gerros' },
    { id: 10, name: 'Gerro Gran', price: 25, category: 'gerros' },
    { id: 11, name: 'Ornament Petit', price: 6, category: 'accessoris' },
    { id: 12, name: 'Imant Nevera', price: 4, category: 'accessoris' }
];

const PieceSelectionModal = ({ isOpen, onClose, booking, onComplete }) => {
    const [selectedPieces, setSelectedPieces] = useState([]);
    const [totals, setTotals] = useState({
        finalTotal: 0,
        extraPaid: 0,
        creditGenerated: 0
    });

    // Initialize selected pieces array when modal opens
    useEffect(() => {
        if (isOpen && booking) {
            setSelectedPieces(new Array(booking.people_count).fill(null));
        }
    }, [isOpen, booking]);

    // Calculate totals when pieces change
    useEffect(() => {
        calculateTotals();
    }, [selectedPieces]);

    const calculateTotals = () => {
        const validPieces = selectedPieces.filter(p => p !== null);
        const finalTotal = validPieces.reduce((sum, piece) => sum + piece.price, 0);
        const extraPaid = validPieces.reduce((sum, piece) => sum + Math.max(0, piece.price - 8), 0);
        const creditGenerated = validPieces.reduce((sum, piece) => sum + Math.abs(Math.min(0, piece.price - 8)), 0);

        setTotals({ finalTotal, extraPaid, creditGenerated });
    };

    const addPiece = (piece, personIndex) => {
        const newPiece = {
            person: personIndex + 1,
            piece: piece.name,
            price: piece.price,
            extra: piece.price - 8
        };

        const updatedPieces = [...selectedPieces];
        updatedPieces[personIndex] = newPiece;
        setSelectedPieces(updatedPieces);
    };

    const removePiece = (personIndex) => {
        const updatedPieces = [...selectedPieces];
        updatedPieces[personIndex] = null;
        setSelectedPieces(updatedPieces);
    };

    const handleComplete = async () => {
        try {
            await onComplete({
                bookingId: booking.id,
                selectedPieces: selectedPieces.filter(p => p !== null),
                finalTotal: totals.finalTotal,
                extraPaid: totals.extraPaid,
                creditGenerated: totals.creditGenerated
            });
        } catch (error) {
            console.error('Error completing booking:', error);
        }
    };

    if (!booking) return null;

    const groupedPieces = AVAILABLE_PIECES.reduce((acc, piece) => {
        if (!acc[piece.category]) acc[piece.category] = [];
        acc[piece.category].push(piece);
        return acc;
    }, {});

    const allPiecesSelected = selectedPieces.every(p => p !== null);
    const nextEmptyIndex = selectedPieces.findIndex(p => p === null);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Seleccionar Peces"
            size="large"
        >
            <div className="space-y-6">
                {/* Booking Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <strong>{booking.clients?.name}</strong> - {booking.people_count} persones - €{booking.total_paid} pagats
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Person Selection */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Tria peça per cada persona:</h3>
                        <div className="space-y-4">
                            {Array.from({ length: booking.people_count }, (_, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium mb-3">Persona {index + 1}</h4>
                                    {selectedPieces[index] ? (
                                        <div className="bg-terracotta-50 p-3 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{selectedPieces[index].piece}</p>
                                                    <p className="text-sm text-gray-600">
                                                        €{selectedPieces[index].price}
                                                        {selectedPieces[index].extra > 0 && (
                                                            <span className="text-red-600"> (+€{selectedPieces[index].extra})</span>
                                                        )}
                                                        {selectedPieces[index].extra < 0 && (
                                                            <span className="text-green-600"> (€{Math.abs(selectedPieces[index].extra)} crèdit)</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="xs"
                                                    onClick={() => removePiece(index)}
                                                    icon={Trash2}
                                                    className="text-red-500 hover:text-red-700"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 p-3 border-2 border-dashed border-gray-200 rounded-lg text-center">
                                            {nextEmptyIndex === index ? (
                                                <span className="text-terracotta-600 font-medium">
                                                    ← Selecciona una peça
                                                </span>
                                            ) : (
                                                'Esperant selecció...'
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Available Pieces */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Peces disponibles:</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {Object.entries(groupedPieces).map(([category, pieces]) => (
                                <div key={category}>
                                    <h4 className="font-medium text-gray-700 mb-2 capitalize">{category}</h4>
                                    <div className="space-y-2">
                                        {pieces.map(piece => (
                                            <Button
                                                key={piece.id}
                                                variant="outline"
                                                onClick={() => nextEmptyIndex !== -1 && addPiece(piece, nextEmptyIndex)}
                                                disabled={nextEmptyIndex === -1}
                                                className="w-full justify-between text-left"
                                            >
                                                <span>{piece.name}</span>
                                                <span className="font-semibold">€{piece.price}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                {selectedPieces.some(p => p !== null) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Resum final:</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Import inicial pagat:</span>
                                <span>€{booking.total_paid}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total peces triades:</span>
                                <span>€{totals.finalTotal.toFixed(2)}</span>
                            </div>
                            {totals.extraPaid > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Extra a pagar:</span>
                                    <span>€{totals.extraPaid.toFixed(2)}</span>
                                </div>
                            )}
                            {totals.creditGenerated > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Crèdit cafeteria:</span>
                                    <span>€{totals.creditGenerated.toFixed(2)}</span>
                                </div>
                            )}
                            <hr className="my-2" />
                            <div className="flex justify-between font-semibold">
                                <span>Total final:</span>
                                <span>€{totals.finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancel·lar
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={!allPiecesSelected}
                    >
                        Completar Reserva
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

export default PieceSelectionModal;