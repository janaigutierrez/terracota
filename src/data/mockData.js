// Pricing data
export const PRICING_DATA = [
    {
        id: 'basic',
        name: 'Tassa',
        price: 6,
        description: 'Perfecta per començar',
        features: ['Tassa ceràmica', 'Pintures incloses', 'Cocció professional', 'Recollida en 1 setmana'],
        popular: false,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format&q=80'
    },
    {
        id: 'medium',
        name: 'Plat',
        price: 10,
        description: 'L\'opció més popular',
        features: ['Plat ceràmic mitjà', 'Pintures incloses', 'Cocció professional', 'Recollida en 1 setmana', 'Més espai creatiu'],
        popular: true,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68dc2?w=400&h=300&fit=crop&auto=format&q=80'
    },
    {
        id: 'premium',
        name: 'Peça decorativa',
        price: 15,
        description: 'Per a creacions especials',
        features: ['Gerro o figura', 'Pintures premium', 'Cocció professional', 'Recollida en 1 setmana', 'Assessorament personalitzat'],
        popular: false,
        image: 'https://images.unsplash.com/photo-1565193298755-de4c4ba5a151?w=400&h=300&fit=crop&auto=format&q=80'
    }
]

// Spaces data
export const SPACES_DATA = [
    {
        id: 'pottery',
        name: 'Taller de Ceràmica',
        description: 'Espai ampli i lluminós amb tot el material necessari per crear la teva obra.',
        features: ['8 taules de treball', 'Materials professionals', 'Assessorament constant', 'Ambient relaxant'],
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&h=400&fit=crop&auto=format&q=80',
        icon: '🏺'
    },
    {
        id: 'cafe',
        name: 'Cafeteria Local',
        description: 'Gaudeix de cafè d\'especialitat i productes artesans mentre crees.',
        features: ['Cafè de tueste artesà', 'Pastissos casolans', 'Productes locals', 'Esmorzars i berenars'],
        image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&h=400&fit=crop&auto=format&q=80',
        icon: '☕'
    },
    {
        id: 'reading',
        name: 'Racó de Lectura',
        description: 'Zona tranquil·la amb llibres per intercanviar i seients còmodes.',
        features: ['Book crossing', 'Seients còmodes', 'Il·luminació natural', 'Ambient silenciós'],
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80',
        icon: '📚'
    }
]

// Gallery data
export const GALLERY_DATA = [
    {
        id: 1,
        title: 'Tasses personalitzades',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'tasses',
        description: 'Creacions úniques dels nostres visitants'
    },
    {
        id: 2,
        title: 'Plats artístics',
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68dc2?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'plats',
        description: 'Art funcional per a la taula'
    },
    {
        id: 3,
        title: 'Gerros decoratius',
        image: 'https://images.unsplash.com/photo-1565193298755-de4c4ba5a151?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'decoratius',
        description: 'Peces decoratives per a la llar'
    },
    {
        id: 4,
        title: 'Bols originals',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'bols',
        description: 'Funcionals i bonics'
    },
    {
        id: 5,
        title: 'Creacions familiars',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'familiar',
        description: 'Moments especials en família'
    },
    {
        id: 6,
        title: 'Art infantil',
        image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500&h=600&fit=crop&auto=format&q=80',
        category: 'infantil',
        description: 'La creativitat dels més petits'
    }
]

// Process steps
export const PROCESS_STEPS = [
    {
        id: 1,
        title: 'Tria la peça',
        description: 'Selecciona entre més de 50 peces ceràmiques diferents: tasses, plats, gerros, figures...',
        icon: '🏺',
        image: 'https://images.unsplash.com/photo-1565193298755-de4c4ba5a151?w=400&h=300&fit=crop&auto=format&q=80'
    },
    {
        id: 2,
        title: 'Pinta i crea',
        description: 'Deixa volar la imaginació amb colors professionals i eines especialitzades. T\'ajudem amb tècniques!',
        icon: '🎨',
        image: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca4?w=400&h=300&fit=crop&auto=format&q=80'
    },
    {
        id: 3,
        title: 'Cocció màgica',
        description: 'Deixem la peça al nostre forn especialitzat. La màgia de la cocció revelarà colors sorprenents.',
        icon: '🔥',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop&auto=format&q=80'
    },
    {
        id: 4,
        title: 'Recull la teva obra',
        description: 'En una setmana rebràs un missatge. Vine a recollir la teva obra única i indestructible!',
        icon: '🎁',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&auto=format&q=80'
    }
]