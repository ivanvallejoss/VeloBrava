export const IDIOMAS_DIPONIBLES = {
    'es': {
        nombre: 'Español',
        bandera: 'es',
        archivo: 'funcionalidades/translation/languages/es.json',
        predeterminado: true
    },
    'en': {
        nombre: 'English',
        bandera: 'us',
        archivo: 'funcionalidades/translation/languages/en.json',
        predeterminado: false
    },
    'fr': {
        nombre: 'Francais',
        bandera: 'fr',
        archivo: 'funcionalidades/translation/languages/fr.json',
        predeterminado: false
    },
}

export const CONFIG_I18N = {
    idiomaDefault: 'es',
    storageKey: 'velodrama_idioma',
    fallbackTexto: 'TEXTO_NO_ENCONTRADO',
    atributoData: 'data-i18n',
    selectorIdioma: '.language-selector'
}