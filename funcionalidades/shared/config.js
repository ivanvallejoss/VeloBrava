export const TOURS_CONFIG = {
    'costa-brava': {
        name: 'Costa Brava Clasica',
        price: 65,
        duration: '4-5 horas',
        difficulty: 'intermedoi'
    },
    'girona-pro': {
        name: 'Girona Pro Ride',
        price: 85,
        duration: '5-6 horas',
        difficulty: 'avanzado'
    },
    'relax-gourmet': {
        name: 'Relax + Gourmet',
        price: 55,
        duration: '3-4 horas',
        difficulty: 'principiante'
    },
    'personalizado': {
        name: 'Tour Personalizado',
        price: 'a determinar',
        duration: 'a determinar',
        difficulty: 'a determinar'
    }
};

// Niveles de ciclismo

export const LEVELS_CONFIG = {
    'principiante': {
        name: 'Principiante (1-2h comodo',
        description: 'Rutas planas, ritmo relajado'
    },
    'intermedio': {
        name: 'Intermedio (2-4h, algunas subidas)',
        description: 'Rutas con desnivel moderado'
    },
    'avanzado': {
        name: 'Avanzado (+4h, entreno regular)',
        description: 'Rutas exigentes, buen nivel fisico'
    },
    'competicion': {
        name: 'Competicion (rutas exigentes)',
        description: 'Nivel profesional o semi-profesional'
    }
};

export const GUIDES_CONFIG = {
    'costa-brava':{
        name: 'Alejandro',
        phone: '34663575346',
        specialty: 'Rutas costeras y culturales',
        languages: ['español', 'catalan', 'frances']
    },
    'girona-pro': {
        name: 'Roger',
        phone: '34663575346',
        specialty: 'Rutas profesionales y competitivas',
        languages: ['español', 'catalan', 'frances']
    },
    'relax-gourmet': {
        name: 'Alejandro',
        phone: '34663575346',
        specialty: 'Experiencias gastronomicas',
        languages: ['español', 'catalan', 'frances']
    },
    'personalizado': {
        name: 'Alejandro',
        phone: '34663575346',
        specialty: 'Tour personalizado',
        languages: ['español', 'catalan', 'frances']
    },
};

export const COMPANY_CONFIG = {
    name: 'Velbrava',
    website: 'velobrava.com',
    mainPhone: '34663575346',
    email: 'info@velobrava.com',
    location: 'Costa Brava, Spain'
};

/**

Determina el guia indicado segun el tour seleccionado

@param {string} tourType - tipo de tour
@returns {Object} - informacion del guia

*/

export function selectGuide(tourType){
    return GUIDES_CONFIG[tourType] || GUIDES_CONFIG['personalizado'];
}