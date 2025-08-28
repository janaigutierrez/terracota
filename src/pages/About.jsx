import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Heart, Leaf } from 'lucide-react'
import { SITE_CONFIG, ANIMATION_VARIANTS } from '../utils/constants'
import React from 'react'


const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="pt-24"
        >
            {/* Header */}
            <section className="section-padding bg-gradient-to-br from-terracotta-50 to-cream-100">
                <div className="container-custom">
                    <motion.div
                        variants={ANIMATION_VARIANTS.staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl mx-auto text-center"
                    >
                        <motion.div
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="mb-6"
                        >
                            <Link
                                to="/"
                                className="inline-flex items-center space-x-2 text-terracotta-600 hover:text-terracotta-700 font-medium group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span>Tornar a l'inici</span>
                            </Link>
                        </motion.div>

                        <motion.h1
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="heading-xl mb-6"
                        >
                            La nostra història
                        </motion.h1>

                        <motion.p
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="text-large"
                        >
                            Com va néixer {SITE_CONFIG.name} i per què som únics a {SITE_CONFIG.location}
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            variants={ANIMATION_VARIANTS.staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="prose prose-lg max-w-none"
                        >
                            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                                <h2 className="heading-md mb-6 text-center">Una idea nascuda de la passió</h2>
                                <p className="text-large mb-8 text-center text-clay-600">
                                    La història de Terracotta comença amb dues persones que comparteixen l'amor per la creativitat,
                                    el cafè de qualitat i la comunitat local.
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-3 gap-8 mb-16">
                                <motion.div
                                    variants={ANIMATION_VARIANTS.fadeInUp}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-8 h-8 text-terracotta-600" />
                                    </div>
                                    <h3 className="heading-md mb-3">Comunitat</h3>
                                    <p className="text-clay-600">
                                        Crear un espai on la gent es pugui connectar a través de l'art i la conversa.
                                    </p>
                                </motion.div>

                                <motion.div
                                    variants={ANIMATION_VARIANTS.fadeInUp}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Heart className="w-8 h-8 text-terracotta-600" />
                                    </div>
                                    <h3 className="heading-md mb-3">Passió</h3>
                                    <p className="text-clay-600">
                                        L'amor per l'artesania, el cafè d'especialitat i l'experiència única.
                                    </p>
                                </motion.div>

                                <motion.div
                                    variants={ANIMATION_VARIANTS.fadeInUp}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Leaf className="w-8 h-8 text-terracotta-600" />
                                    </div>
                                    <h3 className="heading-md mb-3">Sostenibilitat</h3>
                                    <p className="text-clay-600">
                                        Compromís amb el medi ambient i el comerç local.
                                    </p>
                                </motion.div>
                            </div>

                            <motion.div
                                variants={ANIMATION_VARIANTS.fadeInUp}
                                className="bg-terracotta-50 rounded-2xl p-8 text-center"
                            >
                                <h3 className="heading-md mb-4">Més que una ceramiqueria</h3>
                                <p className="text-large text-clay-600 mb-6">
                                    Terracotta és un espai cultural on cada persona pot descobrir el seu artista interior
                                    mentre gaudeix d'un moment de pau i creativitat.
                                </p>
                                <Link to="/" className="btn-primary">
                                    Vine a descobrir-ho
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default About