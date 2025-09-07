import { Heart, Instagram, Facebook } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SITE_CONFIG, SOCIAL_LINKS } from '../../utils/constants'

const Footer = () => {
    return (
        <footer className="bg-clay-900 text-cream-100">
            <div className="container-custom section-padding">
                <div className="text-center">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{SITE_CONFIG.name}</h3>
                        <p className="text-cream-200 max-w-md mx-auto">
                            {SITE_CONFIG.tagline}
                        </p>
                    </div>

                    <div className="flex justify-center space-x-6 mb-6">
                        <a href={SOCIAL_LINKS.instagram} className="text-cream-300 hover:text-terracotta-400 transition-colors" target="_blank" rel="noopener noreferrer">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href={SOCIAL_LINKS.facebook} className="text-cream-300 hover:text-terracotta-400 transition-colors" target="_blank" rel="noopener noreferrer">
                            <Facebook className="w-6 h-6" />
                        </a>
                    </div>

                    <div>
                        <div className="text-center mb-4 text-sm text-cream-300">
                            {/* Navegació principal */}
                            <div className="mb-3">
                                <Link to="/" className="hover:text-terracotta-400 transition-colors mx-2">
                                    Inici
                                </Link>
                                <Link to="/sobre-nosaltres" className="hover:text-terracotta-400 transition-colors mx-2">
                                    Sobre nosaltres
                                </Link>
                                <Link to="/contacte" className="hover:text-terracotta-400 transition-colors mx-2">
                                    Contacte
                                </Link>
                            </div>

                            {/* Separador visual */}
                            <div className="w-60 h-px bg-terracotta-600 mx-auto my-3"></div>

                            {/* Enllaços legals */}
                            <div>
                                <Link to="/avis-legal" className="hover:text-terracotta-400 transition-colors mx-2">
                                    Avís Legal
                                </Link>
                                <Link to="/politica-privacitat" className="hover:text-terracotta-400 transition-colors mx-2">
                                    Privacitat
                                </Link>
                                <Link to="/condicions" className="hover:text-terracotta-400 transition-colors mx-2">
                                    Condicions
                                </Link>
                                <Link to="/cookies" className="hover:text-terracotta-400 transition-colors mx-2">
                                    Cookies
                                </Link>
                            </div>
                        </div>

                        <p className="text-cream-300 text-sm flex items-center justify-center space-x-1">
                            <span>Fet amb</span>
                            <Heart className="w-4 h-4 text-terracotta-400" />
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer