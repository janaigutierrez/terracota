import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { ANIMATION_VARIANTS } from '../utils/constants'
import React from 'react'


const NotFound = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center section-padding"
        >
            <div className="container-custom">
                <motion.div
                    variants={ANIMATION_VARIANTS.staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="max-w-2xl mx-auto text-center"
                >
                    {/* 404 Number */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="mb-8"
                    >
                        <span className="text-9xl sm:text-[12rem] font-bold text-terracotta-200 leading-none">
                            404
                        </span>
                    </motion.div>

                    {/* Pottery Icon */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="mb-8"
                    >
                        <div className="text-6xl mb-4">🏺</div>
                    </motion.div>

                    {/* Message */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="mb-8"
                    >
                        <h1 className="heading-lg mb-4">
                            Aquesta pàgina s'ha trencat!
                        </h1>
                        <p className="text-large text-clay-600 mb-6">
                            Com una peça ceràmica mal cuita, aquesta pàgina no existeix.
                            Però no et preocupis, tenim moltes altres pàgines perfectes per descobrir!
                        </p>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                    >
                        <Link
                            to="/"
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <Home className="w-5 h-5" />
                            <span>Tornar a l'inici</span>
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="btn-secondary inline-flex items-center space-x-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Pàgina anterior</span>
                        </button>
                    </motion.div>

                    {/* Fun fact */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="mt-12 p-6 bg-terracotta-50 rounded-xl"
                    >
                        <p className="text-terracotta-700 font-medium">
                            💡 <strong>Sabies que...</strong> Els errors en ceràmica sovint creen les peces més boniques?
                            A Terracotta celebrem la imperfecció!
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default NotFound