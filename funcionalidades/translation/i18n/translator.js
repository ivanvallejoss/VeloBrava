// SISTEMA PRINCIPAL DE TRADUCCION.

import { IDIOMAS_DIPONIBLES, CONFIG_I18N } from "./config.js";

class Translator {
    constructor(){
        this.idiomaActual = CONFIG_I18N.idiomaDefault;
        this.traducciones = {};
        this.traduccionesCache = new Map();
        this.loading = false;
    }

    /**
     * INICIALIZAR el sistema de traduccion
     * se detecta el idioma guardado, del navegador o el default.
     * se cargan las traducciones para el idioma correspondiente.
     * se configura el selector de idioma.
     * se aplican las traducciones
     */
    async inicilizar(){
        console.log('Inicializando sistema de traduccion..')

        this.idiomaActual = this.detectarIdioma();

        await this.cargarIdioma(this.idiomaActual);
        this.configurarSelector();
        this.aplicarTraducciones();

        console.log(`Sistema i18n inicilizado en: ${this.idiomaActual}`);
    }

    // Detectar idioma (localStorage > navegador > default)
    detectarIdioma(){
        // 1. localStorage.
        const idiomaGuardado = localStorage.getItem(CONFIG_I18N.storageKey);
        if (idiomaGuardado && IDIOMAS_DIPONIBLES[idiomaGuardado]) return idiomaGuardado;

        // 2. Idioma del navegador
        const idiomaNavegador = navigator.language.slice(0, 2);
        if (IDIOMAS_DIPONIBLES[idiomaNavegador]) return idiomaNavegador;

        // 3. Idioma por default.
        return CONFIG_I18N.idiomaDefault;
    }

    /**
     * Cargar archivo JSON de traducciones.
     * @param {string} idioma - codigo del idioma
     */
    async cargarIdioma(idioma){
        if (this.traduccionesCache.has(idioma)){
            this.traducciones = this.traduccionesCache.get(idioma);
            return;
        }

        this.loading = true;
        this.mostrarLoadingState();

        try{
            const archivoTraduccion = IDIOMAS_DIPONIBLES[idioma].archivo;
            const response = await fetch(archivoTraduccion);

            if(!response.ok){
                throw new Error(`Error cargando ${archivoTraduccion}: ${response.status}`);
            }

            const traducciones = await response.json();

            // Guardar en cache
            this.traduccionesCache.set(idioma, traducciones);
            this.traducciones = traducciones;

            console.log(`Traducciones cargadas para: ${idioma}`);

        } catch(error) {
            console.error('Error cargando traducciones: ' , error);

            // fallback al idioma por defecto si no es el que ya estamos intentando.
            if(idioma !== CONFIG_I18N.idiomaDefault){
                console.log(`Fallback a idioma por defecto: ${CONFIG_I18N.idiomaDefault}`);
                await this.cargarIdioma(CONFIG_I18N.idiomaDefault);
            }
        } finally {
            this.loading = false;
            this.ocultarLoadingState();
        }
    }

    /**
     * Cambiar idioma
     * @param {string} nuevoIdioma - Codigo del nuevo idioma.
     */
    async cambiarIdioma(nuevoIdioma) {
        if(nuevoIdioma === this.idiomaActual){
            console.log(`Ya estas en ${nuevoIdioma}`);
            return;
        }

        if (!IDIOMAS_DIPONIBLES[nuevoIdioma]){
            console.error(`Idioma no soportado: ${nuevoIdioma}`);
            return;
        }

        console.log(`Cambiando idioma de ${this.idiomaActual} a ${nuevoIdioma}`);

        // Cargar nuevo idioma
        await this.cargarIdioma(nuevoIdioma);

        // Actualizar idioma actual
        this.idiomaActual = nuevoIdioma

        // Guardar en LocalStorage.
        localStorage.setItem(CONFIG_I18N.storageKey, nuevoIdioma);

        //Aplicar traducciones.
        this.aplicarTraducciones();

        //Actualizar selector visual.
        this.actualizarSelector();

        //Actualizar sistema Whatsapp si es necesario
        // this.actualizarWhatsApp();

        console.log(`Idioma cambiado a: ${nuevoIdioma}`);
    }

    /**
     * Obtener traduccion por clave
     * @param {string} clave - Clave de traduccion (ej: hero-title)
     * @param {object} variables - variables para interpolacion. 
     */
    obtenerTraduccion(clave, variables = {}){
        const keys = clave.split('.');
        let traduccion = this.traducciones;

        // Navegar por el objeto anidado
        for (const key of keys){
            if(traduccion && typeof traduccion == 'object'){
                traduccion = traduccion[key];
            } else{
                traduccion = undefined;
                break;
            }
        }
        // Si no encontramos traduccion, devolver fallback;
        if (!traduccion){
            console.warn(`Traduccion no encontrada: ${clave}`);
            return `${CONFIG_I18N.fallbackTexto}: ${clave}`;
        }

        // Interpolacion de variables.
        if(typeof traduccion == 'string' && Object.keys(variables).length > 0){
            return this.interpolarVariables(traduccion, variables);
        }

        return traduccion;
    }

    /**
     * Interpolar variables en traduccion
     * @param {string} texto - Texto con variable {{variable}}
     * @param {Object} variables - Objecto con valores
     */
    interpolarVariables(texto, variables){
        return texto.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return variables[key] !== undefined ? variables[key] : match;
        });
    }

    /**
     * Aplicar traducciones a elementos con data-i18n
     */

    aplicarTraducciones(){
        const elementos = document.querySelectorAll(`[${CONFIG_I18N.atributoData}]`);

        elementos.forEach(elemento =>{
            const clave = elemento.getAttribute(CONFIG_I18N.atributoData);
            const variables = this.extraerVariables(elemento);

            if(clave){
                const traduccion = this.obtenerTraduccion(clave, variables);

                // Decidir si usar textContent o innerHtml
                if(elemento.hasAttribute('data-i18n-html')){
                    elemento.innerHTML = traduccion;
                } else{
                    elemento.textContent = traduccion;
                }

                // actualizar atributos si es necesario
                this.actualizarAtributos(elemento, clave);
            }
        })

        console.log(`${elementos.length} elementos traducidos.`)
    }

    /**
     * Extraer variables del elemento para interpolacion.
     * @param {HTMLElement} elemento
     */

    extraerVariables(elemento){
        const variables = {};

        //Buscar atributos data-i18n-var-*
        Array.from(elemento.attributes).forEach(attr => {
            if(attr.name.startsWith('data-i18n-var-')) {
                const varName = attr.name.replace('data-i18n-var-', '');
                variables[varName] = attr.value;
            }
        });

        return variables;
    }

    /**
     * Actualizar atributos traducibles (placeholder, title, etc)
     * @param {HTMLElement} elemento
     * @param {string} claveBase
     */

    actualizarAtributos(elemento, claveBase){
        //PlaceHolder
        if(elemento.hasAttribute('data-i18n-placeholder')){
            const clavePlaceholder = elemento.getAttribute('data-i18n-placeholder') || `${claveBase}.placeholder`;
            const placeholder = this.obtenerTraduccion[clavePlaceholder];
            if(placeholder !== `${CONFIG_I18N.fallbackTexto}: ${clavePlaceholder}`){
                elemento.placeholder = placeholder;
            }
        }

        // Title
        if(elemento.hasAttribute('data-i18n-title')){
            const claveTitle = elemento.getAttribute('data-i18n-title') || `${claveBase}.title`;
            const title = this.obtenerTraduccion[claveTitle];
            if(title !== `${CONFIG_I18N.fallbackTexto}: ${claveTitle}`){
                elemento.title = title;
            }
        }

        // Alt para imagenes
        if(elemento.hasAttribute('data-i18n-alt')){
            const claveAlt = elemento.getAttribute('data-i18n-alt') || `${claveBase}.alt`;
            const alt = this.obtenerTraduccion[claveAlt];
            if(alt !== `${CONFIG_I18N.fallbackTexto}: ${claveAlt}`){
                elemento.alt = alt;
            }
        }
    }

    /**
     * Configurar selector de idioma en la pagina.
     */
    configurarSelector(){
        const selector = document.querySelector(CONFIG_I18N.selectorIdioma);

        if(!selector){
            console.warn(`No se encontro selector de idioma`);
            return;
        }

        // Crear opciones de idioma.
        selector.innerHTML = '';

        Object.entries(IDIOMAS_DIPONIBLES).forEach(([codigo, config]) => {
            const opcion = document.createElement('option');
            opcion.value = codigo;
            opcion.textContent = `${config.bandera} ${config.nombre}`;

            if(codigo === this.idiomaActual){
                opcion.selected = true;
            }

            selector.appendChild(opcion);
        });

        //Event Listener para cambio
        selector.addEventListener('change', (e) => {
            this.cambiarIdioma(e.target.value);
        })

        console.log('Selector de idioma configurado.')
    }

    /**
     * Actualizar selector visual
     */
    actualizarSelector(){
        const selector = document.querySelector(CONFIG_I18N.selectorIdioma);
        if(selector){
            selector.value = this.idiomaActual;
        }
    }

    /**
     * Actualizar configuarcion de Whatsapp segun idioma.
     */

    
    // POR AHORA nO

    /**
     * Mostrar estado de carga
     */

    mostrarLoadingState(){
        document.body.classList.add('i18n-loading');

        // Crear indicador si no existe
        let indicator = document.querySelector('.i18n-loading-indicator');
        if(!indicator){
            indicator = document.createElement('div');
            indicator.className = 'i18n-loading-indicator';
            indicator.innerHTML = 'Cargando idioma...';
            indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3b82f6;
            color: white;
            padding: 8px 16px;
            boder-radius: 6px;
            z-index: 9999;
            font-size: 14px;
            `;
            document.body.appendChild(indicator);
        }
    }

    /**
     * Ocultar estado de carga
     */
    ocultarLoadingState(){
        document.body.classList.remove('i18n-loading');

        const indicator = document.querySelector('.i18n-loading-indicator');
        if(indicator){
            indicator.remove();
        }
    }

    /**
     * Obtener idioma actual
     */
    getIdiomaActual(){
        return this.idiomaActual();
    }

    /**
     * Obtener todas las traducciones del idioma actual.
     */
    getTraduccionesActuales(){
        return this.traducciones();
    }
}

// Instancia global del translator.
const translator = new Translator();

// Exportar funciones principales
export async function inicializarI18n(){
    await translator.inicilizar();
}

export function cambiarIdioma(idioma){
    return translator.cambiarIdioma(idioma);
}

export function t(clave, variables = {}){
    return translator,obtenerTraduccion(clave, variables);
}

export function getIdiomaActual(){
    return translator.getIdiomaActual();
}

export function aplicarTraducciones(){
    translator.aplicarTraducciones();
}

/**
 * Funcion de incializacion simple para app.js
 */

export function inicializarTranslation(){
    console.log(`Inicializando sistema de traduccion...`);

    inicializarI18n().catch(error => {
        console.error('error inicializando traducciones: ', error);
    });

    console.log(`Translation inicializado.`);
}