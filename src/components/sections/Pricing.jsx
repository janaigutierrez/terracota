import { motion } from 'framer-motion'
import { Check, Star, Coffee, Clock, Palette, Heart, ArrowRight, Sparkles } from 'lucide-react'
import { ANIMATION_VARIANTS } from '../../utils/constants'
import React from 'react'

const PRICING_DATA = [
    {
        id: 'basic',
        name: 'Tassa',
        price: 6,
        originalPrice: null,
        description: 'Perfecta per començar la teva aventura ceràmica',
        features: [
            'Tassa ceràmica bisque',
            'Tots els colors disponibles',
            'Pinzells i eines incloses',
            'Cocció professional',
            'Recollida en 1 setmana',
            'Assessorament durant el procés'
        ],
        popular: false,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format&q=80',
        color: 'clay',
        estimatedTime: '45 min'
    },
    {
        id: 'medium',
        name: 'Plat',
        price: 10,
        originalPrice: null,
        description: 'L\'opció més popular per expressions artístiques',
        features: [
            'Plat ceràmic mitjà o gran',
            'Paleta completa de colors',
            'Pinzells especialitzats',
            'Cocció i vernissatge',
            'Recollida en 1 setmana',
            'Més espai per crear',
            'Tècniques avançades incloses'
        ],
        popular: true,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68dc2?w=400&h=300&fit=crop&auto=format&q=80',
        color: 'terracotta',
        estimatedTime: '60-90 min'
    },
    {
        id: 'premium',
        name: 'Peça decorativa',
        price: 15,
        originalPrice: 18,
        description: 'Per a creacions especials i regals únics',
        features: [
            'Gerro, figura o peça gran',
            'Colors premium i metàl·lics',
            'Eines professionals',
            'Cocció especialitzada',
            'Recollida en 1 setmana',
            'Assessorament personalitzat',
            'Tècniques avançades',
            'Certificat d\'autenticitat'
        ],
        popular: false,
        image: 'https://images.unsplash.com/photo-1565193298755-de4c4ba5a151?w=400&h=300&fit=crop&auto=format&q=80',
        color: 'cream',
        estimatedTime: '90-120 min'
    }
]

const ADDITIONAL_SERVICES = [
    {
        name: 'Cafè + Berenar',
        price: 'des de 4€',
        description: 'Gaudeix mentre crees',
        icon: Coffee
    },
    {
        name: 'Taller privat',
        price: 'des de 80€',
        description: 'Per grups de 6-10 persones',
        icon: Heart
    },
    {
        name: 'Esdeveniment especial',
        price: 'Consultar',
        description: 'Aniversaris, team building...',
        icon: Star
    }
]

const Pricing = () => {
    const handleBooking = (packageName) => {
        // TODO: Implementar sistema de reserves
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    }

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
                        className="inline-flex items-center space-x-2 bg-terracotta-100 text-terracotta-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
                    >
                        <Palette className="w-4 h-4" />
                        <span>Preus transparents</span>
                    </motion.div>

                    <motion.h2
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="heading-lg mb-6"
                    >
                        Escull la teva
                        <span className="text-terracotta-600"> peça perfecta</span>
                    </motion.h2>

                    <motion.p
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="text-large max-w-2xl mx-auto"
                    >
                        Cada peça inclou tots els materials, assessorament professional
                        i la màgia de veure la teva creació cobrar vida després de la cocció.
                    </motion.p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {PRICING_DATA.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative group ${plan.popular ? 'lg:-mt-8' : ''
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-terracotta-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg z-10">
                                    <Star className="w-4 h-4 inline mr-1" />
                                    Més popular
                                </div>
                            )}

                            <div className={`bg-gradient-to-br ${plan.popular
                                    ? 'from-terracotta-50 to-cream-100 ring-2 ring-terracotta-200'
                                    : 'from-white to-clay-50'
                                } rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform group-hover:-translate-y-2`}>

                                {/* Image */}
                                <div className="relative">
                                    <img
                                        src={plan.image}
                                        alt={plan.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                    {/* Time Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-clay-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{plan.estimatedTime}</span>
                                    </div>

                                    {/* Discount Badge */}
                                    {plan.originalPrice && (
                                        <div className="absolute top-4 left-4 bg-terracotta-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            -€{plan.originalPrice - plan.price}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="text-center mb-6">
                                        <h3 className="heading-md mb-2">{plan.name}</h3>
                                        <p className="text-clay-600 text-sm mb-4">{plan.description}</p>

                                        {/* Price */}
                                        <div className="flex items-center justify-center space-x-2">
                                            <span className="text-4xl font-bold text-terracotta-600">
                                                {plan.price}€
                                            </span>
                                            {plan.originalPrice && (
                                                <span className="text-xl text-clay-400 line-through">
                                                    {plan.originalPrice}€
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-3 mb-6">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-3">
                                                <div className="w-5 h-5 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Check className="w-3 h-3 text-terracotta-600" />
                                                </div>
                                                <span className="text-clay-600 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleBooking(plan.name)}
                                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${plan.popular
                                                ? 'bg-terracotta-500 text-white hover:bg-terracotta-600 shadow-lg hover:shadow-xl'
                                                : 'bg-clay-100 text-clay-700 hover:bg-terracotta-500 hover:text-white'
                                            }`}
                                    >
                                        Escollir {plan.name}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Services */}
                <motion.div
                    variants={ANIMATION_VARIANTS.staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mb-16"
                >
                    <motion.h3
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="heading-md text-center mb-8"
                    >
                        Serveis adicionals
                    </motion.h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {ADDITIONAL_SERVICES.map((service, index) => (
                            <motion.div
                                key={service.name}
                                variants={ANIMATION_VARIANTS.fadeInUp}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-clay-50 to-cream-100 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200"
                            >
                                <div className="w-12 h-12 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <service.icon className="w-6 h-6 text-terracotta-600" />
                                </div>
                                <h4 className="font-semibold text-clay-800 mb-2">{service.name}</h4>
                                <p className="text-terracotta-600 font-bold mb-2">{service.price}</p>
                                <p className="text-clay-600 text-sm">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* FAQ/Info Section */}
                <motion.div
                    variants={ANIMATION_VARIANTS.fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="bg-gradient-to-br from-terracotta-100 to-cream-200 rounded-2xl p-8 text-center"
                >
                    <Sparkles className="w-12 h-12 text-terracotta-500 mx-auto mb-4" />
                    <h3 className="heading-md mb-4">Què inclou cada peça?</h3>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
                        <div className="text-left">
                            <h4 className="font-semibold text-clay-800 mb-2">✨ Materials inclosos:</h4>
                            <ul className="text-clay-600 space-y-1 text-sm">
                                <li>• Peça ceràmica bisque de qualitat</li>
                                <li>• Gamma completa de colors</li>
                                <li>• Pinzells i eines professionals</li>
                                <li>• Protectors i tovallons</li>
                            </ul>
                        </div>

                        <div className="text-left">
                            <h4 className="font-semibold text-clay-800 mb-2">🎯 Serveis inclosos:</h4>
                            <ul className="text-clay-600 space-y-1 text-sm">
                                <li>• Assessorament i tècniques</li>
                                <li>• Cocció professional (1000°C)</li>
                                <li>• Vernissatge transparent</li>
                                <li>• Notificació quan estigui llesta</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <span>Reservar experiència</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-terracotta-600 hover:text-terracotta-700 font-medium"
                        >
                            Tens dubtes? Contacta'ns
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Pricing