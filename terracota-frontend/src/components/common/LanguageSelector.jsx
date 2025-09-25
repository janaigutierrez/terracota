import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import React from 'react'

const LanguageSelector = ({ className = '', showText = true }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { currentLang, changeLanguage, getCurrentLanguage, availableLanguages } = useLanguage()

    const currentLanguage = getCurrentLanguage()

    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode)
        setIsOpen(false)
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-terracotta-500 hover:text-terracotta-600 transition-colors p-2 rounded-md hover:bg-terracotta-50"
            >
                <Globe className="w-4 h-4" />
                <span className="text-lg">{currentLanguage.flag}</span>
                {showText && (
                    <span className="text-sm font-medium hidden sm:inline">
                        {currentLanguage.nativeName}
                    </span>
                )}
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-40"
                    >
                        {availableLanguages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-terracotta-50 transition-colors flex items-center space-x-3 ${currentLang === lang.code ? 'bg-terracotta-100 text-terracotta-700' : 'text-clay-600'
                                    }`}
                            >
                                <span className="text-base">{lang.flag}</span>
                                <span className="flex-1">{lang.nativeName}</span>
                                {currentLang === lang.code && (
                                    <Check className="w-4 h-4 text-terracotta-500" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay per tancar */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}

export default LanguageSelector