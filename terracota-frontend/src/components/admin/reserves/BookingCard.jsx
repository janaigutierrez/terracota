import React from 'react';
import { motion } from 'framer-motion';
import {
    Clock,
    Users,
    Euro,
    Mail,
    Phone,
    Package,
    UserCheck,
    UserX
} from 'lucide-react';
import Button from '../../ui/Button';

const BookingCard = ({
    booking,
    onMarkAttended,
    onUpdateStatus,
    onSelectPieces
}) => {
    const getStatusConfig = (status) => {
        const configs = {
            confirmed: { color: 'bg-yellow-100 text-yellow-800', text: 'Confirmada' },
            attended: { color: 'bg-blue-100 text-blue-800', text: 'Han arribat' },
            completed: { color: 'bg-green-100 text-green-800', text: 'Completada' },
            cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancel·lada' },
            no_show: { color: 'bg-gray-100 text-gray-800', text: 'No han vingut' }
        };
        return configs[status] || configs.confirmed;
    };

    const statusConfig = getStatusConfig(booking.status);

    const renderActionButtons = () => {
        const buttons = [];

        if (booking.status === 'confirmed') {
            buttons.push(
                <Button
                    key="attended"
                    onClick={() => onMarkAttended(booking.id, booking.people_count)}
                    icon={UserCheck}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Han arribat
                </Button>
            );

            buttons.push(
                <Button
                    key="no-show"
                    onClick={() => onUpdateStatus(booking.id, 'no_show')}
                    icon={UserX}
                    variant="outline"
                    className="text-gray-600 hover:text-gray-700"
                >
                    No show
                </Button>
            );
        }

        if (booking.status === 'attended') {
            buttons.push(
                <Button
                    key="select-pieces"
                    onClick={onSelectPieces}
                    icon={Package}
                    className="bg-terracotta-500 hover:bg-terracotta-600"
                >
                    Seleccionar peces
                </Button>
            );
        }

        return buttons;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {booking.clients?.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {booking.booking_time}
                            </span>
                            <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {booking.people_count} persones
                            </span>
                            <span className="flex items-center">
                                <Euro className="w-4 h-4 mr-1" />
                                {booking.total_paid}€ pagats
                            </span>
                        </div>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                    {statusConfig.text}
                </span>
            </div>

            {/* Contact Info & Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {booking.clients?.email}
                    </span>
                    {booking.clients?.phone && (
                        <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {booking.clients?.phone}
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    {renderActionButtons()}
                </div>
            </div>

            {/* Notes */}
            {booking.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {booking.notes}
                    </p>
                </div>
            )}

            {/* Selected Pieces Preview (if completed) */}
            {booking.status === 'completed' && booking.selected_pieces && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">Peces seleccionades:</p>
                    <div className="text-sm text-green-700">
                        {booking.selected_pieces.map((piece, index) => (
                            <div key={index} className="flex justify-between">
                                <span>Persona {piece.person}: {piece.piece}</span>
                                <span>€{piece.price}</span>
                            </div>
                        ))}
                        <div className="border-t border-green-200 mt-2 pt-2 flex justify-between font-medium">
                            <span>Total final:</span>
                            <span>€{booking.final_total}</span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default BookingCard;