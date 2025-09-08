import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '../../ui/Button';

const BaseModal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    footer,
    size = 'md',
    closeOnOverlay = true,
    showCloseButton = true,
    className = ''
}) => {
    const sizes = {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        full: 'max-w-full mx-4'
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-lg ${sizes[size]} w-full max-h-[90vh] overflow-hidden ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                {title && (
                                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                                )}
                                {subtitle && (
                                    <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                                )}
                            </div>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        {footer}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Modal Footer component helper
export const ModalFooter = ({
    onCancel,
    onConfirm,
    cancelText = 'Cancel·lar',
    confirmText = 'Confirmar',
    confirmVariant = 'primary',
    confirmDisabled = false,
    confirmLoading = false,
    extraActions = null
}) => (
    <div className="flex justify-between items-center">
        <div>{extraActions}</div>
        <div className="flex space-x-3">
            <Button
                variant="outline"
                onClick={onCancel}
            >
                {cancelText}
            </Button>
            <Button
                variant={confirmVariant}
                onClick={onConfirm}
                disabled={confirmDisabled}
                loading={confirmLoading}
            >
                {confirmText}
            </Button>
        </div>
    </div>
);

export default BaseModal;