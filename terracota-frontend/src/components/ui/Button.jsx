import { forwardRef } from 'react';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    ...props
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-terracotta-500 hover:bg-terracotta-600 text-white focus:ring-terracotta-500',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
        success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
        danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-terracotta-500',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
    };

    const sizes = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
    };

    const iconSizes = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
        xl: 'w-6 h-6'
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={classes}
            {...props}
        >
            {loading && (
                <svg className={`animate-spin ${iconSizes[size]} ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`} fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                </svg>
            )}

            {!loading && Icon && iconPosition === 'left' && (
                <Icon className={`${iconSizes[size]} mr-2`} />
            )}

            {children}

            {!loading && Icon && iconPosition === 'right' && (
                <Icon className={`${iconSizes[size]} ml-2`} />
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;