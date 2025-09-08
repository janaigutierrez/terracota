// ========================================
// src/components/admin/common/CategoryFilter.jsx
// ========================================
import React from 'react';

const CategoryFilter = ({
    categories = [],
    selectedCategory,
    onCategoryChange,
    variant = 'pills', // 'pills' | 'dropdown' | 'tabs'
    className = '',
    showCounts = true
}) => {
    if (variant === 'dropdown') {
        return (
            <div className={`${className}`}>
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                            {showCounts && category.count !== undefined && ` (${category.count})`}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    if (variant === 'tabs') {
        return (
            <div className={`border-b border-gray-200 ${className}`}>
                <nav className="-mb-px flex space-x-8">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${selectedCategory === category.id
                                ? 'border-terracotta-500 text-terracotta-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {category.name}
                            {showCounts && category.count !== undefined && (
                                <span className="ml-2 text-xs text-gray-400">
                                    ({category.count})
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        );
    }

    // Default: pills variant
    return (
        <div className={`flex-shrink-0 bg-white border-b border-gray-200 p-4 ${className}`}>
            <div className="flex space-x-2 overflow-x-auto">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id
                            ? 'bg-terracotta-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {category.name}
                        {showCounts && category.count !== undefined && ` (${category.count})`}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;