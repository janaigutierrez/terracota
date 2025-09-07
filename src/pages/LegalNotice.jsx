// src/pages/LegalNotice.jsx
import { motion } from 'framer-motion'
import { ANIMATION_VARIANTS } from '../utils/constants'

const LegalNotice = () => {
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
                            Avís Legal
                        </motion.h1>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Dades de l'empresa</h2>
                            <div className="bg-terracotta-50 rounded-xl p-6 mb-6">
                                <p className="text-clay-700 mb-2"><strong>Denominació social:</strong> Terracotta Granollers SL</p>
                                <p className="text-clay-700 mb-2"><strong>CIF:</strong> [A COMPLETAR QUAN ES CONSTITUEIXI]</p>
                                <p className="text-clay-700 mb-2"><strong>Domicili social:</strong> [ADREÇA GRANOLLERS A COMPLETAR]</p>
                                <p className="text-clay-700 mb-2"><strong>Correu electrònic:</strong> info@terracottagranollers.com</p>
                                <p className="text-clay-700 mb-2"><strong>Telèfon:</strong> [TELÈFON A COMPLETAR]</p>
                                <p className="text-clay-700"><strong>Registre Mercantil:</strong> [A COMPLETAR DESPRÉS CONSTITUCIÓ]</p>
                            </div>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Objecte social</h2>
                            <p className="text-clay-600 mb-6">
                                Terracotta Granollers SL té com a activitat principal l'explotació d'un establiment de ceramiqueria
                                "paint-your-own pottery" combinat amb servei de cafeteria, oferint un espai creatiu i cultural
                                per a famílies i grups.
                            </p>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Condicions d'ús del lloc web</h2>
                            <div className="text-clay-600 mb-6">
                                <h3 className="text-lg font-semibold text-clay-700 mb-3">Finalitat</h3>
                                <p className="mb-4">
                                    Aquest lloc web té com a finalitat informar sobre els nostres serveis de ceramiqueria
                                    i cafeteria, així com facilitar la realització de reserves online.
                                </p>

                                <h3 className="text-lg font-semibold text-clay-700 mb-3">Ús adequat</h3>
                                <p className="mb-4">
                                    L'usuari es compromet a utilitzar el lloc web de conformitat amb la llei i les presents
                                    condicions, evitant qualsevol ús que pugui danyar la imatge, interessos i drets de
                                    Terracotta Granollers SL.
                                </p>

                                <h3 className="text-lg font-semibold text-clay-700 mb-3">Propietat intel·lectual</h3>
                                <p className="mb-4">
                                    Tots els continguts del lloc web (textos, imatges, disseny, logotips) són propietat
                                    de Terracotta Granollers SL o han estat utilitzats amb autorització dels seus propietaris.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Exclusió de responsabilitats</h2>
                            <div className="text-clay-600 mb-6">
                                <p className="mb-4">
                                    Terracotta Granollers SL no es fa responsable dels danys que puguin derivar-se de la
                                    utilització d'aquest lloc web, incloent-hi els possibles errors o omissions en els continguts.
                                </p>
                                <p className="mb-4">
                                    Ens reservem el dret a modificar o eliminar qualsevol informació continguda en aquest
                                    lloc web sense previ avís.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Legislació aplicable</h2>
                            <p className="text-clay-600 mb-6">
                                Les presents condicions es regeixen per la legislació espanyola. En cas de controvèrsia,
                                les parts se sotmeten als jutjats i tribunals de Granollers (Barcelona).
                            </p>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <div className="bg-clay-100 rounded-xl p-6">
                                <p className="text-clay-700 text-sm">
                                    <strong>Última actualització:</strong> [07/09/2025]<br />
                                    Per a qualsevol consulta sobre aquest avís legal, podeu contactar amb nosaltres
                                    a través del correu terracotaceramiqueria@gmail.com
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default LegalNotice