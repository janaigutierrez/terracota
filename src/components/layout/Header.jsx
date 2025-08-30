import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import { NAV_LINKS, SITE_CONFIG } from '../../utils/constants'
import LanguageSelector from '../common/LanguageSelector'
import React from 'react'

const Header = ({ isScrolled }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const location = useLocation()

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            window.location.href = `/#${sectionId}`
        } else {
            const element = document.getElementById(sectionId)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
        setIsMobileMenuOpen(false)
    }

    const handleNavClick = (link) => {
        if (link.href.startsWith('#')) {
            scrollToSection(link.id)
        } else {
            setIsMobileMenuOpen(false)
        }
    }

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-terracotta-100'
                : 'bg-transparent'
                }`}
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <nav className="container-custom px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <motion.div
                            className="w-8 h-8 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all duration-200"
                            whileHover={{ rotate: 5, scale: 1.05 }}
                        >
                            T
                        </motion.div>
                        <span className="text-xl font-bold text-clay-800 group-hover:text-terracotta-600 transition-colors">
                            {SITE_CONFIG.name}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {NAV_LINKS.map((link) => (
                            <div key={link.name}>
                                {link.href.startsWith('#') ? (
                                    <button
                                        onClick={() => scrollToSection(link.id)}
                                        className="text-clay-700 hover:text-terracotta-600 font-medium transition-colors duration-200 relative group text-sm"
                                    >
                                        {link.name}
                                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-terracotta-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                                    </button>
                                ) : (
                                    <Link
                                        to={link.href}
                                        className="text-clay-700 hover:text-terracotta-600 font-medium transition-colors duration-200 relative group text-sm"
                                    >
                                        {link.name}
                                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-terracotta-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA, Language & Mobile Menu */}
                    <div className="flex items-center space-x-3">
                        {/* Language Selector - només desktop */}
                        <div className="hidden md:block">
                            <LanguageSelector showText={false} />
                        </div>

                        {/* CTA Button */}
                        <a
                            href={`tel:${SITE_CONFIG.phone}`}
                            className="hidden sm:flex items-center space-x-2 bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                        >
                            <Phone className="w-4 h-4" />
                            <span>Reservar</span>
                        </a>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-clay-700 hover:text-terracotta-600 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-terracotta-100 shadow-lg"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="container-custom py-4 px-4">
                                <div className="flex flex-col space-y-3">
                                    {NAV_LINKS.map((link) => (
                                        <div key={link.name}>
                                            {link.href.startsWith('#') ? (
                                                <button
                                                    onClick={() => handleNavClick(link)}
                                                    className="block text-clay-700 hover:text-terracotta-600 font-medium transition-colors duration-200 py-2 text-left"
                                                >
                                                    {link.name}
                                                </button>
                                            ) : (
                                                <Link
                                                    to={link.href}
                                                    onClick={() => handleNavClick(link)}
                                                    className="block text-clay-700 hover:text-terracotta-600 font-medium transition-colors duration-200 py-2"
                                                >
                                                    {link.name}
                                                </Link>
                                            )}
                                        </div>
                                    ))}

                                    {/* Language selector mòbil */}
                                    <div className="border-t border-terracotta-100 pt-3 md:hidden">
                                        <LanguageSelector showText={true} className="justify-center" />
                                    </div>

                                    <a
                                        href={`tel:${SITE_CONFIG.phone}`}
                                        className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-4 py-3 rounded-md font-medium transition-all duration-200 text-sm shadow-md inline-flex items-center space-x-2 mt-2"
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span>Reservar ara</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    )
}

export default Header