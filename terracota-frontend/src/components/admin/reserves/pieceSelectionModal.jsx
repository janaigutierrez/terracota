import BaseModal from '../../ui/BaseModal';
import Button from '../../ui/Button';
import { useState } from 'react';

const PieceSelectionModal = ({ isOpen, onClose, booking, onComplete }) => {
    const [selectedPieces, setSelectedPieces] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const handleComplete = () => {
        onComplete({
            bookingId: booking?.id,
            selectedPieces,
            finalTotal: totalPrice,
            extraPaid: Math.max(0, totalPrice - (booking?.total_paid || 0)),
            creditGenerated: Math.max(0, (booking?.total_paid || 0) - totalPrice)
        });
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Seleccionar Peces"
            size="lg"
        >
            <div className="space-y-4">
                <p className="text-gray-600">
                    Selecciona les peces que ha triat {booking?.clients?.name}
                </p>

                {/* TODO: Implementar selector peces */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">
                        Selector de peces - Per implementar
                    </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel·lar
                    </Button>
                    <Button onClick={handleComplete}>
                        Completar Reserva
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

export default PieceSelectionModal;