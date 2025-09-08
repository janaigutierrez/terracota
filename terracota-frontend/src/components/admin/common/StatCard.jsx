import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
    title,
    value,
    icon: Icon,
    color = 'blue',
    trend,
    trendValue,
    description,
    onClick,
    loading = false,
    className = ''
}) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        red: 'bg-red-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        gray: 'bg-gray-500',
        terracotta: 'bg-terracotta-500'
    };

    const trendColors = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-gray-600'
    };

    const isClickable = typeof onClick === 'function';

    const cardContent = (
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{title}</p>

                {loading ? (
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                        {description && <div className="h-4 bg-gray-200 rounded w-32"></div>}
                    </div>
                ) : (
                    <>
                        <div className="flex items-baseline space-x-2">
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                            {trend && trendValue && (
                                <div className={`flex items-center text-sm ${trendColors[trend]}`}>
                                    {trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                                    {trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                                    <span>{trendValue}</span>
                                </div>
                            )}
                        </div>

                        {description && (
                            <p className="text-xs text-gray-500 mt-1">{description}</p>
                        )}
                    </>
                )}
            </div>

            {Icon && (
                <div className={`p-3 rounded-lg ${colorClasses[color]} flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            )}
        </div>
    );

    if (isClickable) {
        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className={`w-full text-left bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 ${className}`}
            >
                {cardContent}
            </motion.button>
        );
    }

    return (
        <div className={`bg-white p-4 rounded-lg border border-gray-200 ${className}`}>
            {cardContent}
        </div>
    );
};

export default StatCard;