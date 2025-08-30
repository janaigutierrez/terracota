import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Send, MessageCircle, Calendar } from 'lucide-react'
import { ANIMATION_VARIANTS, SITE_CONFIG, OPENING_HOURS, SOCIAL_LINKS } from '../../utils/constants'
import React from 'react'

const CONTACT_METHODS = [
    {
        icon: Phone,
        title: 'Truca\'ns',
        value: SITE_CONFIG.phone,
        link: `tel:${SITE_CONFIG.phone}`,
        description: 'Reserva directa o resol dubtes',
        color: 'terracotta'
    },
    {
        icon: Mail,
        title: 'Envia\'ns un email',
        value: SITE_CONFIG.email,
        link: `mailto:${SITE_CONFIG.email}`,
        description: 'Respondrem en menys de 24h',
        color: 'clay'
    },
    {
        icon: Instagram,
        title: 'Instagram',
        value: '@terracotta_granollers',
        link: SOCIAL_LINKS.instagram,
        description: 'Segueix les nostres creacions',
        color: 'terracotta'
    },
    {
        icon: MessageCircle,
        title: 'WhatsApp',
        value: 'Missatge directe',
        link: `https://wa.me/${SITE_CONFIG.phone?.replace(/\s+/g, '')}`,
        description: 'Resposta ràpida i personal',
        color: 'cream'
    }
]

const FORMATTED_HOURS = [
    { day: 'Dilluns', hours: OPENING_HOURS.monday, isToday: false },
    { day: 'Dimarts', hours: OPENING_HOURS.tuesday, isToday: false },
    { day: 'Dimecres', hours: OPENING_HOURS.wednesday, isToday: false },
    { day: 'Dijous', hours: OPENING_HOURS.thursday, isToday: false },
    { day: 'Divendres', hours: OPENING_HOURS.friday, isToday: false },
    { day: 'Dissabte', hours: OPENING_HOURS.saturday, isToday: false },
    { day: 'Diumenge', hours: OPENING_HOURS.sunday, isToday: false },
]

const Contact = () => {
    // Get current day to highlight it
    const today = new Date().getDay()
    const daysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const todayKey = daysOrder[today]

    FORMATTED_HOURS.forEach((day, index) => {
        day.isToday = daysOrder[index + 1] === todayKey || (today === 0 && index === 6)
    })

    return (
        <section className="section-padding bg-gradient-to-br from-clay-800 to-terracotta-900 text-white">
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
                        className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Estem aquí per ajudar-te</span>
                    </motion.div>

                    <motion.h2
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="heading-lg mb-6 text-white"
                    >
                        Vine a
                        <span className="text-cream-300"> veure'ns</span>
                    </motion.h2>

                    <motion.p
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="text-large text-cream-200 max-w-2xl mx-auto"
                    >
                        Tens dubtes? Vols reservar? O simplement vols saludar?
                        T'esperem amb els braços oberts a Terracotta!
                    </motion.p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Contact Methods */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="lg:col-span-1"
                    >
                        <motion.h3
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            className="heading-md text-white mb-6"
                        >
                            Contacta amb nosaltres
                        </motion.h3>

                        <div className="space-y-4">
                            {CONTACT_METHODS.map((method, index) => (
                                <motion.a
                                    key={method.title}
                                    href={method.link}
                                    target={method.link.startsWith('http') ? '_blank' : '_self'}
                                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : ''}
                                    variants={ANIMATION_VARIANTS.fadeInUp}
                                    transition={{ delay: index * 0.1 }}
                                    className="block bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-200 group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-terracotta-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <method.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-white mb-1">{method.title}</h4>
                                            <p className="text-cream-300 text-sm mb-1">{method.value}</p>
                                            <p className="text-cream-400 text-xs">{method.description}</p>
                                        </div>
                                        <Send className="w-4 h-4 text-cream-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Location & Hours */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <div className="grid md:grid-cols-2 gap-8">

                            {/* Location */}
                            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                                <h3 className="heading-md text-white mb-6 flex items-center space-x-2">
                                    <MapPin className="w-6 h-6 text-terracotta-400" />
                                    <span>On som?</span>
                                </h3>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4">
                                    <p className="text-cream-200 mb-2 font-medium">
                                        {SITE_CONFIG.address}
                                    </p>
                                    <p className="text-cream-300 text-sm mb-4">
                                        {SITE_CONFIG.location}
                                    </p>

                                    <div className="text-cream-300 text-sm space-y-2">
                                        <p>🚗 <strong>En cotxe:</strong> Parking gratuït al carrer</p>
                                        <p>🚌 <strong>Transport públic:</strong> Línies L2, L3 (parada Centre)</p>
                                        <p>🚶‍♀️ <strong>A peu:</strong> 2 min des de la Porxada</p>
                                    </div>
                                </div>

                                {/* Google Maps */}
                                <div className="rounded-xl overflow-hidden shadow-lg">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2985.8474962177393!2d2.2877684757043735!3d41.60788837125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4bdad89bd6221%3A0x6c33b9c6a5e1c8f5!2sPla%C3%A7a%20de%20la%20Porxada%2C%2008400%20Granollers%2C%20Barcelona!5e0!3m2!1sca!2ses!4v1703786400000!5m2!1sca!2ses"
                                        width="100%"
                                        height="250"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Ubicació Terracotta a la Plaça de la Porxada, Granollers"
                                        className="w-full"
                                    />
                                    <div className="bg-white/90 backdrop-blur-sm p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-clay-700 font-medium text-sm">
                                                    📍 {SITE_CONFIG.address}
                                                </p>
                                                <p className="text-clay-500 text-xs">
                                                    Al cor històric de Granollers
                                                </p>
                                            </div>
                                            <a
                                                href="https://goo.gl/maps/porxada-granollers"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                Obrir al Maps
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Opening Hours */}
                            <motion.div variants={ANIMATION_VARIANTS.fadeInUp}>
                                <h3 className="heading-md text-white mb-6 flex items-center space-x-2">
                                    <Clock className="w-6 h-6 text-terracotta-400" />
                                    <span>Horaris</span>
                                </h3>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                    <div className="space-y-3">
                                        {FORMATTED_HOURS.map((schedule, index) => (
                                            <div
                                                key={schedule.day}
                                                className={`flex justify-between items-center py-2 px-3 rounded-lg transition-all ${schedule.isToday
                                                        ? 'bg-terracotta-500/30 border border-terracotta-400'
                                                        : 'hover:bg-white/5'
                                                    }`}
                                            >
                                                <span className={`font-medium ${schedule.isToday ? 'text-white' : 'text-cream-200'
                                                    }`}>
                                                    {schedule.day}
                                                    {schedule.isToday && (
                                                        <span className="ml-2 inline-block w-2 h-2 bg-terracotta-400 rounded-full animate-pulse" />
                                                    )}
                                                </span>
                                                <span className={`text-sm ${schedule.hours === 'Tancat'
                                                        ? 'text-cream-400'
                                                        : schedule.isToday
                                                            ? 'text-cream-100 font-medium'
                                                            : 'text-cream-300'
                                                    }`}>
                                                    {schedule.hours}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/20">
                                        <div className="bg-terracotta-500/20 rounded-lg p-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Calendar className="w-4 h-4 text-terracotta-400" />
                                                <span className="text-cream-200 font-medium text-sm">Info important:</span>
                                            </div>
                                            <p className="text-cream-300 text-sm">
                                                🎯 <strong>Recomanem reservar</strong> per assegurar plaça<br />
                                                ☕ La cafeteria està oberta en els mateixos horaris<br />
                                                🏺 Recollida de peces: qualsevol dia d'obertura
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    variants={ANIMATION_VARIANTS.fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mt-16"
                >
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                        <h3 className="heading-md text-white mb-4">T'esperem aviat! 🎨</h3>
                        <p className="text-cream-200 mb-6 max-w-2xl mx-auto">
                            Vine a descobrir el món de la ceràmica en un ambient relaxant.
                            El teu primer cafè va per nosaltres!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-terracotta-500 hover:bg-terracotta-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Reservar ara
                            </button>
                            <a
                                href={SOCIAL_LINKS.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cream-200 hover:text-white font-medium flex items-center space-x-2"
                            >
                                <Instagram className="w-5 h-5" />
                                <span>Segueix-nos a Instagram</span>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Contact