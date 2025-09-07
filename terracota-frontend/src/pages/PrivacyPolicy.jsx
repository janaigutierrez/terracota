// src/pages/PrivacyPolicy.jsx
import { motion } from 'framer-motion'
import { ANIMATION_VARIANTS } from '../utils/constants'

const PrivacyPolicy = () => {
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
                            Política de Privacitat
                        </motion.h1>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Responsable del tractament</h2>
                            <p className="text-clay-600 mb-6">
                                Terracotta Granollers SL<br />
                                CIF: [NÚMERO A COMPLETAR]<br />
                                Adreça: [ADREÇA GRANOLLERS]<br />
                                Email: info@terracottagranollers.com<br />
                                Telèfon: [TELÈFON]
                            </p>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Dades que recopilem</h2>
                            <ul className="text-clay-600 mb-6 list-disc pl-6">
                                <li>Nom i cognoms</li>
                                <li>Telèfon de contacte</li>
                                <li>Correu electrònic</li>
                                <li>Dades de la reserva (data, hora, número de persones)</li>
                                <li>Observacions especials (al·lèrgies, celebracions)</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Finalitat del tractament</h2>
                            <p className="text-clay-600 mb-4">Les teves dades es fan servir únicament per:</p>
                            <ul className="text-clay-600 mb-6 list-disc pl-6">
                                <li>Gestionar la teva reserva i confirmació</li>
                                <li>Contactar-te sobre canvis o incidències</li>
                                <li>Avisar-te quan la teva peça ceràmica estigui llesta</li>
                                <li>Proporcionar el servei sol·licitat</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Base legal</h2>
                            <p className="text-clay-600 mb-6">
                                El tractament es basa en l'execució del contracte de serveis (reserva) que sol·licites.
                            </p>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Conservació de dades</h2>
                            <p className="text-clay-600 mb-6">
                                Les dades es conserven fins completar el servei contractat més 1 any addicional
                                per a possibles reclamacions o garanties.
                            </p>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Els teus drets</h2>
                            <p className="text-clay-600 mb-4">Pots exercir els següents drets:</p>
                            <ul className="text-clay-600 mb-6 list-disc pl-6">
                                <li><strong>Accés:</strong> Saber quines dades tenim sobre tu</li>
                                <li><strong>Rectificació:</strong> Corregir dades incorrectes</li>
                                <li><strong>Supressió:</strong> Eliminar les teves dades</li>
                                <li><strong>Portabilitat:</strong> Rebre les dades en format portable</li>
                            </ul>
                            <p className="text-clay-600 mb-6">
                                Per exercir aquests drets, contacta: info@terracottagranollers.com
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy