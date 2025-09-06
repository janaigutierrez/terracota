import { motion } from 'framer-motion'
import { Palette, Coffee, BookOpen, Users, Sparkles, Heart } from 'lucide-react'
import { ANIMATION_VARIANTS } from '../../utils/constants'

const SPACES_DATA = [
    {
        id: 'pottery',
        title: 'Taller de Ceràmica',
        description: 'Espai ampli i lluminós amb tot el material necessari per crear la teva obra única.',
        features: ['8 taules de treball', 'Materials professionals', 'Assessorament constant', 'Ambient relaxant'],
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&h=400&fit=crop&auto=format&q=80',
        icon: Palette,
        color: 'terracotta',
        stats: '8 taules'
    },
    {
        id: 'cafe',
        title: 'Cafeteria Local',
        description: "Gaudeix d'un bon cafè i productes artesans mentre crees la teva obra.",
        features: ["Cafè d'especialitat", 'Pastissos casolans', 'Productes locals', 'Esmorzars i berenars'],
        image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&h=400&fit=crop&auto=format&q=80',
        icon: Coffee,
        color: 'clay',
        stats: 'Cafè artesà'
    },
    {
        id: 'reading',
        title: 'Racó de Lectura',
        description: 'Zona tranquil·la amb llibres per intercanviar i seients còmodes per relaxar-te.',
        features: ['Book crossing', 'Seients còmodes', 'Il·luminació natural', 'Ambient tranquil'],
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
        icon: BookOpen,
        color: 'cream',
        stats: 'Book crossing'
    }
]

const Spaces = () => {
    return (
        <section className="section-padding bg-gradient-to-br from-terracotta-50 to-cream-100">
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
                        className="inline-flex items-center space-x-2 bg- from-terracotta-50 to-cream-100 text-terracotta-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
                    >
                    </motion.div>

                    <motion.h2
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="heading-lg mb-6"
                    >
                        Els nostres
                        <span className="text-terracotta-600"> espais</span>
                    </motion.h2>

                    <motion.p
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="text-large max-w-2xl mx-auto"
                    >
                        Cada racó de Terracota està pensat perquè visquis una experiència única.
                        Crea, gaudeix i relaxa't en els nostres espais especialment dissenyats.
                    </motion.p>
                </motion.div>

                {/* Spaces Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {SPACES_DATA.map((space, index) => (
                        <motion.div
                            key={space.id}
                            variants={ANIMATION_VARIANTS.fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: index * 0.2 }}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                                {/* Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={space.image}
                                        alt={space.title}
                                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                    />

                                    {/* Overlay with icon */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center justify-between">
                                            <div className={`w-12 h-12 bg-${space.color}-500 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                                <space.icon className="w-6 h-6" />
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="heading-md mb-3 group-hover:text-terracotta-600 transition-colors">
                                        {space.title}
                                    </h3>

                                    <p className="text-clay-600 mb-4 leading-relaxed">
                                        {space.description}
                                    </p>

                                    {/* Features */}
                                    <div className="space-y-2">
                                        {space.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-3 text-sm">
                                                <div className={`w-1.5 h-1.5 bg-${space.color}-500 rounded-full`} />
                                                <span className="text-clay-600">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    variants={ANIMATION_VARIANTS.fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mt-16"
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Heart className="w-6 h-6 text-terracotta-500" />
                            <Users className="w-6 h-6 text-terracotta-500" />
                            <Heart className="w-6 h-6 text-terracotta-500" />
                        </div>
                        <h3 className="heading-md mb-4">Vine a descobrir-ho!</h3>
                        <p className="text-large mb-6 max-w-2xl mx-auto">
                            Cada espai està pensat per crear moments especials.
                            Reserva ara i viu l'experiència completa a Terracota.
                        </p>
                        <button
                            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn-primary text-lg px-8 py-4"
                        >
                            Reserva la teva experiència
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Spaces