import { motion } from 'framer-motion'
import { ArrowRight, Palette, Coffee, Heart } from 'lucide-react'
import { SITE_CONFIG, ANIMATION_VARIANTS } from '../../utils/constants'
import React from 'react'


const Hero = () => {
    const scrollToBooking = () => {
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    }

    const scrollToSpaces = () => {
        document.getElementById('spaces')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
                    alt="Ceramiqueria background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-clay-900/70 to-terracotta-900/60" />
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-16 h-16 bg-terracotta-400/20 rounded-full blur-xl"
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-3/4 right-1/3 w-24 h-24 bg-cream-400/20 rounded-full blur-xl"
                    animate={{
                        y: [20, -20, 20],
                        x: [10, -10, 10],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container-custom text-center px-4">
                <motion.div
                    variants={ANIMATION_VARIANTS.staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto"
                >
                    {/* Subtitle */}
                    <motion.p
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="text-cream-200 text-lg sm:text-xl mb-4 font-medium tracking-wide"
                    >
                        Benvinguts a {SITE_CONFIG.location}
                    </motion.p>

                    {/* Main Heading */}
                    <motion.h1
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="heading-xl text-white mb-6 text-balance drop-shadow-lg"
                        style={{
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 1px 1px 2px rgba(0,0,0,0.5)'
                        }}
                    >
                        Crea la teva obra d'art
                        <span className="block text-cream-200 drop-shadow-lg">
                            mentre gaudeixes d'un bon cafè
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="text-lg sm:text-xl text-cream-100 mb-8 max-w-2xl mx-auto leading-relaxed"
                    >
                        {SITE_CONFIG.tagline}. Pinta peces ceràmiques úniques en un ambient relaxant,
                        amb productes locals i un racó de lectura especial.
                    </motion.p>

                    {/* Features Icons */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="flex items-center justify-center space-x-8 mb-10"
                    >
                        <div className="flex items-center space-x-2 text-cream-200">
                            <Palette className="w-6 h-6 text-terracotta-400" />
                            <span className="text-sm sm:text-base font-medium">Ceràmica</span>
                        </div>
                        <div className="flex items-center space-x-2 text-cream-200">
                            <Coffee className="w-6 h-6 text-terracotta-400" />
                            <span className="text-sm sm:text-base font-medium">Cafeteria</span>
                        </div>
                        <div className="flex items-center space-x-2 text-cream-200">
                            <Heart className="w-6 h-6 text-terracotta-400" />
                            <span className="text-sm sm:text-base font-medium">Lectura</span>
                        </div>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                    >
                        <motion.button
                            onClick={scrollToBooking}
                            className="btn-primary text-lg px-8 py-4 group inline-flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Reserva la teva experiència</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        <motion.button
                            onClick={scrollToSpaces}
                            className="btn-secondary text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white hover:text-clay-800"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Descobreix els espais
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Hero