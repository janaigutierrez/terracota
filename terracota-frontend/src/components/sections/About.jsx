import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Leaf } from 'lucide-react'
import { ANIMATION_VARIANTS } from '../../utils/constants'

const About = () => {
    return (
        <section className="section-padding bg-white">
            <div className="container-custom">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <motion.div
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="inline-flex items-center space-x-2 bg-white text-terracotta-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
                        >

                        </motion.div>

                        <motion.h2
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="heading-lg mb-6"
                        >
                            Què és
                            <span className="text-terracotta-600"> Terracota</span>?
                        </motion.h2>

                        <motion.p
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="text-large mb-6"
                        >
                            Som el primer espai de <strong>paint-your-own pottery</strong> a Granollers.
                            Un lloc únic on pots crear la teva obra d'art ceràmica mentre gaudeixes
                            d'un bon cafè i un ambient relaxant.
                        </motion.p>

                        <motion.div
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="space-y-4 mb-8"
                        >
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <Users className="w-4 h-4 text-terracotta-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-clay-800 mb-1">Per a tothom</h4>
                                    <p className="text-clay-600">Famílies, parelles, amics i creadors individuals. Sense experiència prèvia necessària.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <Leaf className="w-4 h-4 text-terracotta-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-clay-800 mb-1">Sostenible i local</h4>
                                    <p className="text-clay-600">Productes km0, mobiliari reutilitzat i col·laboració amb artesans locals.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
                        >
                            <Link
                                to="/about"
                                className="btn-primary inline-flex items-center space-x-2 group"
                            >
                                <span>La nostra història completa</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button
                                onClick={() => document.getElementById('spaces')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-terracotta-600 hover:text-terracotta-700 font-medium flex items-center space-x-1 group"
                            >
                                <span>Veure els espais</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="relative"
                    >
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src="public/about.png"
                                alt="Ceramiqueria"
                                className="w-full h-[500px] object-cover"
                            />
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-terracotta-200 rounded-full opacity-20" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cream-300 rounded-full opacity-30" />
                    </motion.div>

                </div>
            </div>
        </section>
    )
}

export default About