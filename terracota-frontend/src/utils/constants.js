// Site configuration
export const SITE_CONFIG = {
    name: 'Terracota',
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
    serviceId: 'service_658fwlk',
    templateId: 'template_1wufg0p',
    publicKey: 'your_public_key'
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

export const API_CONFIG = {
    baseURL: import.meta.env.PROD
        ? 'https://terracota.onrender.com'
        : 'http://localhost:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
}

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    auth: {
        login: '/api/auth/login',
        verify: '/api/auth/verify',
        logout: '/api/auth/logout'
    },

    // Reserves
    bookings: {
        create: '/api/bookings',
        list: '/api/bookings',
        getById: (id) => `/api/bookings/${id}`,
        updateStatus: (id) => `/api/bookings/${id}/status`,
        today: '/api/bookings/admin/today',
        markAttended: (id) => `/api/bookings/${id}/attended`,
        complete: (id) => `/api/bookings/${id}/complete`,
        cancel: (id) => `/api/bookings/${id}/cancel`
    },

    // Contacte  
    contact: {
        create: '/api/contact',
        list: '/api/contact'
    },

    // Dashboard (admin)
    dashboard: {
        stats: '/api/dashboard/stats',
        today: '/api/dashboard/today',
        inventoryAlerts: '/api/dashboard/inventory-alerts'
    },

    // Inventari
    inventory: {
        list: '/api/inventory',
        create: '/api/inventory',
        getById: (id) => `/api/inventory/${id}`,
        update: (id) => `/api/inventory/${id}`,
        delete: (id) => `/api/inventory/${id}`,
        addMovement: (id) => `/api/inventory/${id}/movement`,
        movements: '/api/inventory/movements/history',
        alerts: '/api/inventory/alerts/low-stock',
        stats: '/api/inventory/stats/overview',
        search: '/api/inventory/search/items',
        updateBulk: '/api/inventory/bulk/update-stock',
        categories: '/api/inventory/meta/categories',
        movementReasons: '/api/inventory/meta/movement-reasons'
    },

    // Health check
    health: '/api/health'
}

export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_CONFIG.baseURL}${endpoint}`

    const token = localStorage.getItem('adminToken');

    const config = {
        method: 'GET',
        headers: {
            ...API_CONFIG.headers,
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    }

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config)

        if (response.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');

            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin';
                return;
            }
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json()
        } else {
            return await response.text()
        }
    } catch (error) {
        console.error('API Request failed:', error)
        throw error
    }
}

export const adminApiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
        window.location.href = '/admin';
        throw new Error('No authentication token');
    }

    return apiRequest(endpoint, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });
}

export const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    return !!(token && adminData);
}

export const getAdminData = () => {
    const adminData = localStorage.getItem('adminData');

    try {
        return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
        console.error('Error parsing admin data:', error);
        return null;
    }
}