// Site configuration
export const SITE_CONFIG = {
    name: 'Terracotta',
    tagline: 'Crea, pinta i endú-te la teva obra única',
    description: 'Paint-your-own pottery i cafeteria a Granollers. Espai creatiu per famílies, parelles i amics.',
    location: 'Granollers, Vallès Oriental',
    phone: '+34 938 45 67 89', // TODO: Número real quan el tingueu
    email: 'terracotaceramiqueria@gmail.com',
    address: 'Plaça de la Porxada, 08400 Granollers',
}

// Navigation links
export const NAV_LINKS = [
    { name: 'Inici', href: '/', id: 'home' },
    { name: 'Espais', href: '#spaces', id: 'spaces' },
    { name: 'Com funciona', href: '#process', id: 'process' },
    { name: 'Galeria', href: '#gallery', id: 'gallery' },
    { name: 'Preus', href: '#pricing', id: 'pricing' },
    { name: 'Reserves', href: '#booking', id: 'booking' },
    { name: 'Sobre nosaltres', href: '/about', id: 'about' },
]

// Business hours
export const OPENING_HOURS = {
    monday: 'Tancat',
    tuesday: '10:00 - 20:00',
    wednesday: '10:00 - 20:00',
    thursday: '10:00 - 20:00',
    friday: '10:00 - 21:00',
    saturday: '9:00 - 21:00',
    sunday: '10:00 - 19:00',
}

// Social media links
export const SOCIAL_LINKS = {
    instagram: 'https://instagram.com/terracotta.granollers',
    facebook: 'https://facebook.com/terracottagranollers',
    tiktok: 'https://tiktok.com/@terracotta.granollers',
}

// Configuració EmailJS (afegir a constants.js)
export const EMAIL_CONFIG = {
    serviceId: 'service_658fwlk', // Crear a emailjs.com
    templateId: 'template_1wufg0p',  // Crear template
    publicKey: 'your_public_key'     // De la teva compte EmailJS
}

// Animation variants for Framer Motion
export const ANIMATION_VARIANTS = {
    fadeInUp: {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    },
    fadeInLeft: {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    },
    fadeInRight: {
        hidden: { opacity: 0, x: 60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: 'easeOut' }
        }
    },
    staggerContainer: {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    }
}