import { RefreshCw } from 'lucide-react';

const LoadingSpinner = ({
    message = 'Carregant...',
    size = 'md',
    className = ''
}) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
            <RefreshCw className={`animate-spin text-terracotta-500 ${sizes[size]} mb-2`} />
            <span className="text-gray-600 text-sm">{message}</span>
        </div>
    );
};

export default LoadingSpinner;