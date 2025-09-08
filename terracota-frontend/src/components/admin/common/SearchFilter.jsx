import { Search, Filter } from 'lucide-react';
import Input from '../../ui/Input';

const SearchFilter = ({
    searchTerm = '',
    onSearchChange,
    selectedCategory = 'all',
    onCategoryChange,
    categories = [],
    sortBy = 'name',
    onSortChange,
    sortOrder = 'asc',
    onSortOrderChange,
    showSort = true,
    showCategory = true,
    searchPlaceholder = 'Buscar...',
    className = ''
}) => {
    const sortOptions = [
        { value: 'name-asc', label: 'Nom A-Z' },
        { value: 'name-desc', label: 'Nom Z-A' },
        { value: 'stock-asc', label: 'Stock ↑' },
        { value: 'stock-desc', label: 'Stock ↓' },
        { value: 'price-asc', label: 'Preu ↑' },
        { value: 'price-desc', label: 'Preu ↓' },
        { value: 'last_movement-desc', label: 'Actualització ↓' }
    ];

    const handleSortChange = (value) => {
        const [field, order] = value.split('-');
        onSortChange?.(field);
        onSortOrderChange?.(order);
    };

    return (
        <div className={`bg-white p-4 rounded-lg border border-gray-200 ${className}`}>
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <Input
                        icon={Search}
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    {/* Category Filter */}
                    {showCategory && categories.length > 0 && (
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => onCategoryChange?.(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.icon} {category.name} ({category.count})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Sort */}
                    {showSort && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Ordenar:</span>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;