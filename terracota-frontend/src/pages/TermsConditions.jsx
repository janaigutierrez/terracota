// src/pages/TermsConditions.jsx
import { motion } from 'framer-motion'
import { ANIMATION_VARIANTS } from '../utils/constants'

const TermsConditions = () => {
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
                            Termes i Condicions d'Ús
                        </motion.h1>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Reserves i confirmacions</h2>
                            <ul className="text-clay-600 mb-6 list-disc pl-6">
                                <li>Les reserves es confirmen per email o telèfon</li>
                                <li>És recomanable arribar 5 minuts abans de l'hora reservada</li>
                                <li>Màxim 8 persones per grup</li>
                                <li>Menors de 12 anys han d'anar acompanyats</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Cancel·lacions</h2>
                            <ul className="text-clay-600 mb-6 list-disc pl-6">
                                <li>Cancel·lacions gratuïtes fins 2 hores abans</li>
                                <li>Cancel·lacions amb menys de 2h d'antelació: 50% del cost</li>
                                <li>No compareixença (no-show): 100% del cost</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Pagament</h2>
                            <ul className="text-clay-600 mb-6 list-disc pl-6">
                                <li>Pagament al finalitzar l'activitat</li>
                                <li>Acceptem efectiu i targetes</li>
                                <li>Preus inclouen materials i cocció</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Procés de cocció i recollida</h2>
                            <ul className="text-clay-600 mb-6 list-disc pl-6">
                                <li>Temps de cocció: 5-7 dies laborables</li>
                                <li>T'avisarem quan estigui llesta</li>
                                <li>Conservem les peces un màxim de 40 dies</li>
                                <li>Peces no recollides podran ser donades o reciclades</li>
                            </ul>
                        </motion.div>

                        <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                            <h2 className="text-2xl font-bold text-clay-700 mb-4">Responsabilitats</h2>
                            <ul className="text-clay-600 mb-6 list-disc pl-6">
                                <li>No ens fem responsables de trencades durant el procés creatiu</li>
                                <li>Oferim una peça de substitució en cas de problemes de cocció</li>
                                <li>Els resultats finals poden variar respecte al disseny inicial</li>
                            </ul>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default TermsConditions