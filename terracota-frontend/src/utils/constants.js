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

// ✅ API Configuration ARREGLAT
export const API_CONFIG = {
    baseURL: import.meta.env.PROD
        ? 'https://terracota.onrender.com'     // ⬅️ SENSE /api
        : 'http://localhost:3001',              // ⬅️ SENSE /api
    timeout: 10000, // 10 segons timeout
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
        today: '/api/bookings/admin/today',                    // ⬅️ AMB /api
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

    // Inventari (per desenvolupar)
    inventory: {
        list: '/api/inventory',
        create: '/api/inventory',
        update: (id) => `/api/inventory/${id}`,
        delete: (id) => `/api/inventory/${id}`,
        alerts: '/api/inventory/alerts'
    },

    // Health check
    health: '/api/health'
}

// ✅ Helper function ARREGLADA amb autenticació
export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_CONFIG.baseURL}${endpoint}`

    // ✅ OBTENIR TOKEN DEL LOCALSTORAGE
    const token = localStorage.getItem('adminToken');

    const config = {
        method: 'GET',
        headers: {
            ...API_CONFIG.headers,
            // ✅ AFEGIR AUTHORIZATION HEADER SI HI HA TOKEN
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    }

    // ✅ Si hi ha body, convertir a JSON
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config)

        // ✅ GESTIÓ ERROR 401 (token expirat)
        if (response.status === 401) {
            // Token expirat, redirigir a login
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');

            // Si estem en ruta admin, redirigir a login
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

// ✅ Helper específic per requests admin (amb token obligatori)
export const adminApiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
        // No hi ha token, redirigir a login
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

// ✅ Helper per verificar si usuari està autenticat
export const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    return !!(token && adminData);
}

// ✅ Helper per obtenir dades admin
export const getAdminData = () => {
    const adminData = localStorage.getItem('adminData');

    try {
        return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
        console.error('Error parsing admin data:', error);
        return null;
    }
}