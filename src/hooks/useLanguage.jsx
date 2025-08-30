import { useState, useContext, createContext } from 'react'

const LanguageContext = createContext()

export const LANGUAGES = [
    { code: 'ca', name: 'Català', flag: '🇪🇸', nativeName: 'Català' },
    { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
]

// Proveïdor del contexte
export const LanguageProvider = ({ children }) => {
    const [currentLang, setCurrentLang] = useState('ca') // Default català

    const changeLanguage = (langCode) => {
        setCurrentLang(langCode)
        // Guardar a localStorage per persistència
        localStorage.setItem('terracotta_lang', langCode)
    }

    const getCurrentLanguage = () => {
        return LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0]
    }

    const value = {
        currentLang,
        changeLanguage,
        getCurrentLanguage,
        availableLanguages: LANGUAGES
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}

// Hook personalitzat
export const useLanguage = () => {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}