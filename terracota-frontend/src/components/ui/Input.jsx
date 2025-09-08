import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    hint,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    containerClassName = '',
    type = 'text',
    ...props
}, ref) => {
    const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors';
    const errorClasses = error ? 'border-red-300 focus:ring-red-500' : '';
    const iconClasses = Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';

    const inputClasses = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`;

    return (
        <div className={`space-y-1 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <div className="relative">
                {Icon && iconPosition === 'left' && (
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                )}

                <input
                    ref={ref}
                    type={type}
                    className={inputClasses}
                    {...props}
                />

                {Icon && iconPosition === 'right' && (
                    <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                )}
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            {hint && !error && (
                <p className="text-sm text-gray-500">{hint}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;