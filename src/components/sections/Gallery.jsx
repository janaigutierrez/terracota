import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Eye, Heart, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ANIMATION_VARIANTS } from '../../utils/constants'

const GALLERY_DATA = [
    {
        id: 1,
        title: 'Tasses personalitzades',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'tasses',
        description: 'Creacions úniques dels nostres visitants',
        creator: 'Maria i els nens'
    },
    {
        id: 2,
        title: 'Plats artístics',
        image: 'about/plat.jpg',
        category: 'plats',
        description: 'Art funcional per a la taula',
        creator: 'Parella Anna i Joan'
    },
    {
        id: 3,
        title: 'Gerros decoratius',
        image: 'https://images.unsplash.com/photo-1565193298755-de4c4ba5a151?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'decoratius',
        description: 'Peces decoratives per a la llar',
        creator: 'Laura M.'
    },
    {
        id: 4,
        title: 'Bols originals',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'bols',
        description: 'Funcionals i bonics',
        creator: 'Grup amics'
    },
    {
        id: 5,
        title: 'Creacions familiars',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'familiar',
        description: 'Moments especials en família',
        creator: 'Família García'
    },
    {
        id: 6,
        title: 'Art infantil',
        image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'infantil',
        description: 'La creativitat dels més petits',
        creator: 'Els nostres artistes més joves'
    },
    {
        id: 7,
        title: 'Tasses temàtiques',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'tasses',
        description: 'Cada tassa conta una història',
        creator: 'Club de lectura'
    },
    {
        id: 8,
        title: 'Plats commemoratius',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'plats',
        description: 'Per celebrar moments especials',
        creator: 'Aniversari Sara'
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
    const [selectedImage, setSelectedImage] = useState(null)

    const filteredImages = selectedCategory === 'all'
        ? GALLERY_DATA
        : GALLERY_DATA.filter(item => item.category === selectedCategory)

    const openModal = (image) => {
        setSelectedImage(image)
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setSelectedImage(null)
        document.body.style.overflow = 'unset'
    }

    const navigateImage = (direction) => {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
        let newIndex

        if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1
        } else {
            newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0
        }

        setSelectedImage(filteredImages[newIndex])
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
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="inline-flex items-center space-x-2bg-gradient-to-br from-clay-100 to-terracotta-50 text-terracotta-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
                    >

                    </motion.div>

                    <motion.h2
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="heading-lg mb-6"
                    >
                        Galeria d'
                        <span className="text-terracotta-600">obres úniques</span>
                    </motion.h2>

                    <motion.p
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="text-large max-w-2xl mx-auto"
                    >
                        Cada peça és una història, cada color una emoció.
                        Descobreix les meravelloses creacions dels nostres artistes.
                    </motion.p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    variants={ANIMATION_VARIANTS.fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    <Filter className="w-5 h-5 text-clay-600 mr-2 hidden sm:block" />
                    {CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm ${selectedCategory === category.id
                                ? 'bg-terracotta-500 text-white shadow-lg'
                                : 'bg-white/80 text-clay-600 hover:bg-terracotta-100 hover:text-terracotta-700'
                                }`}
                        >
                            {category.name}
                            {selectedCategory === category.id && (
                                <span className="ml-2 inline-block w-2 h-2 bg-white rounded-full" />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Images Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map((image, index) => (
                            <motion.div
                                key={image.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                    ease: "easeOut"
                                }}
                                className="group cursor-pointer"
                                onClick={() => openModal(image)}
                            >
                                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2">
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={image.image}
                                            alt={image.title}
                                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-white">
                                                        <h4 className="font-semibold text-sm mb-1">{image.title}</h4>
                                                        <p className="text-xs opacity-90">{image.creator}</p>
                                                    </div>
                                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                                        <Eye className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3 bg-terracotta-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                            {CATEGORIES.find(cat => cat.id === image.category)?.name}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                            onClick={closeModal}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-colors z-50"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Navigation Buttons */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigateImage('prev')
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors z-50"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigateImage('next')
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors z-50"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Modal Content */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Image */}
                                    <div className="lg:flex-1">
                                        <img
                                            src={selectedImage.image}
                                            alt={selectedImage.title}
                                            className="w-full h-64 lg:h-96 object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="p-6 lg:w-80">
                                        <div className="mb-4">
                                            <span className="inline-block bg-terracotta-100 text-terracotta-700 text-xs px-3 py-1 rounded-full font-medium mb-3">
                                                {CATEGORIES.find(cat => cat.id === selectedImage.category)?.name}
                                            </span>
                                            <h3 className="heading-md mb-2">{selectedImage.title}</h3>
                                            <p className="text-clay-600 mb-3">{selectedImage.description}</p>
                                            <p className="text-sm text-terracotta-600 font-medium">
                                                Creat per: {selectedImage.creator}
                                            </p>
                                        </div>

                                        <div className="bg-terracotta-50 rounded-xl p-4">
                                            <p className="text-terracotta-700 text-sm font-medium mb-2">
                                                ✨ T'agrada aquesta creació?
                                            </p>
                                            <p className="text-clay-600 text-sm">
                                                Vine a crear la teva pròpia obra d'art única!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}

export default Gallery