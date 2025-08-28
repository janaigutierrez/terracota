// Site configuration
export const SITE_CONFIG = {
    name: 'Terracotta',
    tagline: 'Crea, pinta i endú-te la teva obra única',
    description: 'Paint-your-own pottery i cafeteria a Granollers. Espai creatiu per famílies, parelles i amics.',
    location: 'Granollers, Vallès Oriental',
    phone: '+34 XXX XXX XXX', // TODO: Afegir telèfon real
    email: 'hola@terracottagranollers.com', // TODO: Afegir email real
    address: 'Carrer Exemple, 123, Granollers', // TODO: Afegir adreça real
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

// Social media links (TODO: Afegir enllaços reals)
export const SOCIAL_LINKS = {
    instagram: 'https://instagram.com/terracotta_granollers',
    facebook: 'https://facebook.com/terracottagranollers',
    tiktok: 'https://tiktok.com/@terracotta.granollers',
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