const CategoryFilter = ({
    categories = [],
    selected = 'all',
    onChange,
    variant = 'pills', // 'pills' or 'dropdown'
    className = ''
}) => {
    if (variant === 'dropdown') {
        return (
            <select
                value={selected}
                onChange={(e) => onChange?.(e.target.value)}
                className={`border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent ${className}`}
            >
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.icon} {category.name} ({category.count})
                    </option>
                ))}
            </select>
        );
    }

    return (
        <div className={`flex space-x-2 overflow-x-auto ${className}`}>
            {categories.map(category => (
                <button
                    key={category.id}
                    onClick={() => onChange?.(category.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected === category.id
                            ? 'bg-terracotta-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {category.icon && <span className="mr-1">{category.icon}</span>}
                    {category.name} ({category.count})
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;