import { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from '../common/ScrollToTop'
import React from 'react'


const Layout = ({ children }) => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-cream-50">
            <Header isScrolled={isScrolled} />

            <main className="relative">
                {children}
            </main>

            <Footer />
            <ScrollToTop />
        </div>
    )
}

export default Layout