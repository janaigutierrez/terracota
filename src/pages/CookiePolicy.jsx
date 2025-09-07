// src/pages/CookiePolicy.jsx
import { motion } from 'framer-motion'
import { ANIMATION_VARIANTS } from '../utils/constants'

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="section-padding">
                <div className="container-custom max-w-4xl">
                    <motion.div
                        variants={ANIMATION_VARIANTS.staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="prose prose-lg max-w-none"
                    >
                        <motion.h1
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="heading-lg mb-8 text-clay-800"
                        >
                            Política de Cookies
                        </motion.h1>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Què són les cookies?</h2>
                            <p className="text-clay-600 mb-6">
                                Les cookies són petits fitxers de text que els llocs web emmagatzemen al teu navegador
                                per recordar informació sobre la teva visita, com les teves preferències d'idioma o
                                dades de navegació.
                            </p>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Cookies que utilitzem</h2>

                            <h3 className="text-lg font-semibold text-clay-700 mb-3">Cookies tècniques (necessàries)</h3>
                            <div className="bg-green-50 rounded-xl p-4 mb-4">
                                <p className="text-clay-600 text-sm">
                                    <strong>Finalitat:</strong> Permetre la navegació i funcionament bàsic del lloc web<br />
                                    <strong>Durada:</strong> Sessió<br />
                                    <strong>Tipus:</strong> Pròpies
                                </p>
                            </div>

                            <h3 className="text-lg font-semibold text-clay-700 mb-3">Cookies analítiques</h3>
                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <p className="text-clay-600 text-sm mb-2">
                                    <strong>Google Analytics</strong><br />
                                    <strong>Finalitat:</strong> Analitzar el comportament dels usuaris per millorar el lloc web<br />
                                    <strong>Durada:</strong> 2 anys<br />
                                    <strong>Tipus:</strong> Tercers
                                </p>
                                <p className="text-clay-600 text-xs">
                                    Pots desactivar Google Analytics visitant:
                                    <a href="https://tools.google.com/dlpage/gaoptout" className="text-terracotta-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                                        tools.google.com/dlpage/gaoptout
                                    </a>
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Com gestionar les cookies</h2>
                            <div className="text-clay-600 mb-6">
                                <h3 className="text-lg font-semibold text-clay-700 mb-3">Al teu navegador</h3>
                                <ul className="list-disc pl-6 mb-4">
                                    <li><strong>Chrome:</strong> Configuració → Privacitat i seguretat → Cookies</li>
                                    <li><strong>Firefox:</strong> Opcions → Privacitat i seguretat → Cookies</li>
                                    <li><strong>Safari:</strong> Preferències → Privacitat → Cookies</li>
                                    <li><strong>Edge:</strong> Configuració → Cookies i permisos de llocs</li>
                                </ul>

                                <h3 className="text-lg font-semibold text-clay-700 mb-3">Al nostre lloc web</h3>
                                <p className="mb-4">
                                    Pots gestionar les teves preferències de cookies mitjançant el banner que apareix
                                    en la teva primera visita o accedint a les opcions de configuració.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <div className="bg-terracotta-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-clay-700 mb-3">Important</h3>
                                <p className="text-clay-600 text-sm">
                                    Si desactives les cookies tècniques, algunes funcionalitats del lloc web podrien
                                    no funcionar correctament. Les cookies analítiques són opcionals i només s'instal·len
                                    amb el teu consentiment.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default CookiePolicy