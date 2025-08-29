import { motion } from 'framer-motion'
import { ArrowRight, Clock, Palette, Flame, Gift, Sparkles } from 'lucide-react'
import { ANIMATION_VARIANTS } from '../../utils/constants'
import React from 'react'

const PROCESS_STEPS = [
    {
        id: 1,
        title: 'Tria la peça',
        description: 'Selecciona entre més de 50 peces ceràmiques diferents: tasses, plats, gerros, figures...',
        icon: '🏺',
        iconComponent: Palette,
        image: 'https://images.unsplash.com/photo-1565193298755-de4c4ba5a151?w=400&h=300&fit=crop&auto=format&q=80',
        time: '5 min',
        color: 'terracotta'
    },
    {
        id: 2,
        title: 'Pinta i crea',
        description: 'Deixa volar la imaginació amb colors professionals i eines especialitzades. T\'ajudem amb tècniques!',
        icon: '🎨',
        iconComponent: Palette,
        image: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca4?w=400&h=300&fit=crop&auto=format&q=80',
        time: '60-90 min',
        color: 'clay'
    },
    {
        id: 3,
        title: 'Cocció màgica',
        description: 'Deixem la peça al nostre forn especialitzat. La màgia de la cocció revelarà colors sorprenents.',
        icon: '🔥',
        iconComponent: Flame,
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop&auto=format&q=80',
        time: '7 dies',
        color: 'terracotta'
    },
    {
        id: 4,
        title: 'Recull la teva obra',
        description: 'En una setmana rebràs un missatge. Vine a recollir la teva obra única i indestructible!',
        icon: '🎁',
        iconComponent: Gift,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format&q=80',
        time: 'Per sempre',
        color: 'cream'
    }
]

const History = () => {
    return (
        <section className="section-padding bg-white">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    variants={ANIMATION_VARIANTS.staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="inline-flex items-center space-x-2 bg-clay-100 text-clay-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Procés senzill i màgic</span>
                    </motion.div>

                    <motion.h2
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="heading-lg mb-6"
                    >
                        Com
                        <span className="text-terracotta-600"> funciona</span>?
                    </motion.h2>

                    <motion.p
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="text-large max-w-2xl mx-auto"
                    >
                        En només 4 passos simples, crearàs una obra d'art única.
                        No cal experiència prèvia - nosaltres t'acompanyem en tot el procés.
                    </motion.p>
                </motion.div>

                {/* Process Steps */}
                <div className="relative">
                    {/* Mobile Version - Vertical */}
                    <div className="lg:hidden space-y-8">
                        {PROCESS_STEPS.map((step, index) => (
                            <motion.div
                                key={step.id}
                                variants={ANIMATION_VARIANTS.fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: index * 0.2 }}
                                className="relative"
                            >
                                {/* Connector Line */}
                                {index < PROCESS_STEPS.length - 1 && (
                                    <div className="absolute left-6 top-20 w-0.5 h-16 bg-gradient-to-b from-terracotta-300 to-transparent" />
                                )}

                                <div className="flex items-start space-x-4">
                                    {/* Step Number & Icon */}
                                    <div className="flex-shrink-0">
                                        <div className={`w-12 h-12 bg-${step.color}-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                            {step.id}
                                        </div>
                                        <div className="text-2xl mt-2 text-center">
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="bg-gradient-to-br from-cream-50 to-terracotta-50 rounded-2xl p-6 shadow-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="heading-md">{step.title}</h3>
                                                <div className="flex items-center space-x-1 text-sm text-clay-600 bg-white/70 px-3 py-1 rounded-full">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{step.time}</span>
                                                </div>
                                            </div>
                                            <p className="text-clay-600 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Desktop Version - Horizontal */}
                    <div className="hidden lg:block">
                        <div className="grid grid-cols-4 gap-8 relative">
                            {/* Connector Line */}
                            <div className="absolute top-16 left-16 right-16 h-0.5 bg-gradient-to-r from-terracotta-200 via-clay-200 to-cream-300" />

                            {PROCESS_STEPS.map((step, index) => (
                                <motion.div
                                    key={step.id}
                                    variants={ANIMATION_VARIANTS.fadeInUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative group"
                                >
                                    {/* Step Card */}
                                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform group-hover:-translate-y-4">
                                        {/* Image */}
                                        <div className="relative">
                                            <img
                                                src={step.image}
                                                alt={step.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                            {/* Step Number */}
                                            <div className={`absolute top-4 left-4 w-10 h-10 bg-${step.color}-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                                                {step.id}
                                            </div>

                                            {/* Time Badge */}
                                            <div className="absolute top-4 right-4 flex items-center space-x-1 text-white text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                                                <Clock className="w-3 h-3" />
                                                <span>{step.time}</span>
                                            </div>

                                            {/* Large Emoji */}
                                            <div className="absolute bottom-4 left-4 text-4xl">
                                                {step.icon}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="heading-md mb-3 group-hover:text-terracotta-600 transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="text-clay-600 leading-relaxed text-sm">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Arrow Connector */}
                                    {index < PROCESS_STEPS.length - 1 && (
                                        <div className="absolute top-16 -right-4 w-8 h-8 flex items-center justify-center">
                                            <ArrowRight className="w-6 h-6 text-clay-400" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    variants={ANIMATION_VARIANTS.fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mt-16"
                >
                    <div className="bg-gradient-to-br from-terracotta-100 to-cream-200 rounded-2xl p-8 shadow-lg">
                        <h3 className="heading-md mb-4">Fàcil, oi?</h3>
                        <p className="text-large mb-6 max-w-2xl mx-auto">
                            El procés és senzill però el resultat és màgic.
                            Cada cocció és una sorpresa - els colors canvien i la teva obra cobra vida!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-primary inline-flex items-center space-x-2"
                            >
                                <span>Veure preus</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-secondary"
                            >
                                Reservar ara
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default History