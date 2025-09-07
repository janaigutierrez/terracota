import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Eye, Heart, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ANIMATION_VARIANTS } from '../../utils/constants'

const GALLERY_DATA = [
    {
        id: 1,
        title: 'Tassa personalitzada clàssica',
        image: 'tassa.webp',
        category: 'tasses',
        description: 'Tassa amb disseny personalitzat',
        creator: 'Maria i els nens',
        isRepresentative: true
    },
    {
        id: 2,
        title: 'Tassa amb patró geomètric',
        image: 'tassa-geometrica.webp',
        category: 'tasses',
        description: 'Disseny modern amb formes geomètriques',
        creator: 'Anna M.',
        isRepresentative: false
    },
    {
        id: 3,
        title: 'Tassa temàtica floral',
        image: 'tassa-floral.avif',
        category: 'tasses',
        description: 'Decoració amb motius florals',
        creator: 'Club de jardineria',
        isRepresentative: false
    },

    {
        id: 4,
        title: 'Plat artístic principal',
        image: 'plat.jpg',
        category: 'plats',
        description: 'Art funcional per a la taula',
        creator: 'Parella Anna i Joan',
        isRepresentative: true
    },
    {
        id: 5,
        title: 'Plat amb mandala',
        image: 'plat-mandala.webp',
        category: 'plats',
        description: 'Plat decorat amb patró mandala',
        creator: 'Grup de meditació',
        isRepresentative: false
    },
    {
        id: 6,
        title: 'Plat temàtica marina',
        image: 'plat-marina.webp',
        category: 'plats',
        description: 'Inspirat en el món marí',
        creator: 'Família costa',
        isRepresentative: false
    },

    {
        id: 7,
        title: 'Bols originals',
        image: 'bols.jpg',
        category: 'bols',
        description: 'Funcionals i bonics',
        creator: 'Grup amics',
        isRepresentative: true
    },
    {
        id: 8,
        title: 'Bol de cereals infantil',
        image: 'bol-infantil.webp',
        category: 'bols',
        description: 'Bol petit amb colors vius',
        creator: 'Taller nens',
        isRepresentative: false
    },
    {
        id: 9,
        title: 'Bol grans per amanides',
        image: 'bol-gran.jpg',
        category: 'bols',
        description: 'Bol gran per ús diari',
        creator: 'Cuiners amateurs',
        isRepresentative: false
    },

    {
        id: 10,
        title: 'Gerros decoratius',
        image: 'gerros.jpg',
        category: 'decoratius',
        description: 'Peces decoratives per a la llar',
        creator: 'Laura M.',
        isRepresentative: true // Aquesta es veurà a "Tots"
    },
    {
        id: 11,
        title: 'Figures animals',
        image: 'figures-animals.jpeg', // Nova imatge
        category: 'decoratius',
        description: 'Petites figures d\'animals',
        creator: 'Taller temàtic',
        isRepresentative: false
    },
    {
        id: 12,
        title: 'Portaveles artesanal',
        image: 'portaveles.jpg', // Nova imatge
        category: 'decoratius',
        description: 'Portaveles amb relleus',
        creator: 'Vespre romàntic',
        isRepresentative: false
    },

    {
        id: 13,
        title: 'Creació familiar',
        image: 'set-tasses.png',
        category: 'familiar',
        description: 'Moments especials en família',
        creator: 'Família García',
        isRepresentative: true // Aquesta es veurà a "Tots"
    },
    {
        id: 14,
        title: 'Plats commemoratius',
        image: 'plats-commemoratius.webp',
        category: 'familiar',
        description: 'Per celebrar dates especials',
        creator: 'Aniversari Sara',
        isRepresentative: false
    },

    // INFANTIL - múltiples variacions
    {
        id: 15,
        title: 'Art infantil',
        image: 'charms.jpg',
        category: 'infantil',
        description: 'La creativitat dels més petits',
        creator: 'Els nostres artistes més joves',
        isRepresentative: true // Aquesta es veurà a "Tots"
    },
    {
        id: 16,
        title: 'Tasses amb dibuixos',
        image: 'tassa-infantil.webp', // Nova imatge
        category: 'infantil',
        description: 'Tasses decorades pels nens',
        creator: 'Escola bressol',
        isRepresentative: false
    }
]

const CATEGORIES = [
    { id: 'all', name: 'Tots', color: 'terracotta' },
    { id: 'tasses', name: 'Tasses', color: 'clay' },
    { id: 'plats', name: 'Plats', color: 'terracotta' },
    { id: 'bols', name: 'Bols', color: 'cream' },
    { id: 'decoratius', name: 'Decoratius', color: 'terracotta' },
    { id: 'familiar', name: 'Familiar', color: 'clay' },
    { id: 'infantil', name: 'Infantil', color: 'cream' }
]

const Gallery = () => {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [currentIndex, setCurrentIndex] = useState(0)

    // Obtenir imatges segons categoria
    const getImages = () => {
        if (selectedCategory === 'all') {
            return GALLERY_DATA.filter(item => item.isRepresentative)
        }
        return GALLERY_DATA.filter(item => item.category === selectedCategory)
    }

    const images = getImages()

    // Navegació carrusel
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    // Reset index quan canvia categoria
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId)
        setCurrentIndex(0)
    }

    return (
        <section className="section-padding bg-gradient-to-br from-clay-100 to-terracotta-50">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    variants={ANIMATION_VARIANTS.staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-12"
                >
                    <motion.h2
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="heading-lg mb-6"
                    >
                        Galeria d'<span className="text-terracotta-600">obres úniques</span>
                    </motion.h2>
                    <motion.p
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="text-large max-w-2xl mx-auto"
                    >
                        Cada peça és una història, cada color una emoció.
                    </motion.p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    variants={ANIMATION_VARIANTS.fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${selectedCategory === category.id
                                ? 'bg-terracotta-500 text-white shadow-lg'
                                : 'bg-white/80 text-clay-600 hover:bg-terracotta-100'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </motion.div>

                {/* Carrusel */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Contenidor imatges */}
                    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${selectedCategory}-${currentIndex}`}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                {images[currentIndex] && (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={images[currentIndex].image}
                                            alt={images[currentIndex].title}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Overlay amb info */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                                <h3 className="text-2xl font-bold mb-2">
                                                    {images[currentIndex].title}
                                                </h3>
                                                <p className="text-lg opacity-90 mb-2">
                                                    {images[currentIndex].description}
                                                </p>
                                                <p className="text-sm opacity-75">
                                                    Creat per: {images[currentIndex].creator}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Botons navegació */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-clay-800 p-3 rounded-full shadow-lg transition-all duration-200"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-clay-800 p-3 rounded-full shadow-lg transition-all duration-200"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Indicadors */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex
                                    ? 'bg-white'
                                    : 'bg-white/50 hover:bg-white/75'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Comptador */}
                <div className="text-center mt-8">
                    <span className="bg-terracotta-100 text-terracotta-700 px-4 py-2 rounded-full text-sm">
                        {currentIndex + 1} de {images.length} - {CATEGORIES.find(cat => cat.id === selectedCategory)?.name}
                    </span>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-12"
                >
                    <button
                        onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                        className="btn-primary"
                    >
                        Crea la teva obra d'art
                    </button>
                </motion.div>
            </div>
        </section>
    )
}

export default Gallery