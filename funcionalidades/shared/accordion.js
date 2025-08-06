// MODULO DE ACORDEON PARA TOURS

/**
 * Gestiona los acordeones de las cards tours
 */
class AccordionManager{
    constructor() {
        this.activeAccordion = null;
        this.accordions = [];
        this.animationDuration = 300; // ms
    }

    /**
     * Inicializar todos los acordeones en la página
     */
    inicializar() {
        console.log('🎯 Inicializando acordeones de tours...');
        
        // Buscar todos los toggles de acordeón
        const toggles = document.querySelectorAll('.accordion-toggle');
        
        if (toggles.length === 0) {
            console.warn('⚠️ No se encontraron acordeones en la página');
            return;
        }

        // Configurar cada acordeón
        toggles.forEach((toggle, index) => {
            this.configurarAcordeon(toggle, index);
        });

        // Event listener global para clicks fuera de acordeones
        this.configurarEventosGlobales();
        
        console.log(`✅ ${toggles.length} acordeones inicializados`);
    }

    /**
     * Configurar un acordeón individual
     * @param {HTMLElement} toggle - Botón toggle del acordeón
     * @param {number} index - Índice del acordeón
     */
    configurarAcordeon(toggle, index) {
        const content = toggle.parentElement.nextElementSibling;
        const tourCard = toggle.closest('.card');
        
        if (!content) {
            console.warn(`⚠️ No se encontró contenido para acordeón ${index}`);
            return;
        }

        // Configurar atributos de accesibilidad
        const accordionId = `accordion-${index}`;
        const contentId = `accordion-content-${index}`;
        
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', contentId);
        toggle.setAttribute('id', accordionId);
        
        content.setAttribute('id', contentId);
        content.setAttribute('aria-labelledby', accordionId);
        content.setAttribute('role', 'region');

        // Guardar referencia
        const accordionData = {
            toggle,
            content,
            tourCard,
            index,
            isOpen: false
        };
        
        this.accordions.push(accordionData);

        // Event listener para el toggle
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAcordeon(accordionData);
        });

        // Configurar estado inicial
        this.cerrarAcordeon(accordionData, false);
    }

    /**
     * Toggle de un acordeón específico
     * @param {Object} accordionData - Datos del acordeón
     */
    toggleAcordeon(accordionData) {
        const { toggle, content, isOpen, index } = accordionData;
        
        console.log(`🔄 Toggle acordeón ${index}: ${isOpen ? 'cerrando' : 'abriendo'}`);

        if (isOpen) {
            this.cerrarAcordeon(accordionData);
        } else {
            // Cerrar todos los otros acordeones primero
            // this.cerrarTodosExcepto(accordionData);
            // Abrir este acordeón
            this.abrirAcordeon(accordionData);
        }
    }

    /**
     * Abrir un acordeón
     * @param {Object} accordionData - Datos del acordeón
     */
    abrirAcordeon(accordionData) {
        const { toggle, content, tourCard } = accordionData;
        
        // Actualizar estado
        accordionData.isOpen = true;
        this.activeAccordion = accordionData;

        // Clases CSS
        toggle.classList.add('active');
        content.classList.add('active');
        tourCard?.classList.add('expanded');
        content.style.display = 'block';

        // Accesibilidad
        toggle.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');

        // Actualizar texto del toggle (si es necesario)
        const toggleText = toggle.querySelector('.toggle-text');
        if (toggleText) {
            // Si tienes sistema de traducción, usar esa clave
            toggleText.textContent = 'Ocultar detalles';
        }

        // Scroll suave al acordeón si es necesario
        // this.scrollToAccordionIfNeeded(accordionData);

        // Event personalizado para integración con otros sistemas
        // this.emitirEventoAcordeon('opened', accordionData);
    }

    /**
     * Cerrar un acordeón
     * @param {Object} accordionData - Datos del acordeón
     * @param {boolean} animate - Si debe animarse el cierre
     */
    cerrarAcordeon(accordionData, animate = true) {
        const { toggle, content, tourCard, isOpen } = accordionData;
        
        if (!isOpen && animate) return; // Ya está cerrado

        // Actualizar estado
        accordionData.isOpen = false;
        if (this.activeAccordion === accordionData) {
            this.activeAccordion = null;
        }

        // Clases CSS
        toggle.classList.remove('active');
        content.classList.remove('active');
        tourCard?.classList.remove('expanded');
        content.style.display = 'none';

        // Accesibilidad
        toggle.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');

        // Actualizar texto del toggle
        const toggleText = toggle.querySelector('.toggle-text');
        if (toggleText) {
            toggleText.textContent = 'Ver itinerario y servicios';
        }

        // Event personalizado
        // if (animate) {
        //     this.emitirEventoAcordeon('closed', accordionData);
        // }
    }

    /**
     * Configurar eventos globales
     */
    configurarEventosGlobales() {
        // Cerrar acordeones con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeAccordion) {
                this.cerrarAcordeon(this.activeAccordion);
            }
        });

        // Integración con sistema de traducción
        window.addEventListener('idiomaChanged', () => {
            this.actualizarTraducciones();
        });
    }
}


// Instancia global del manager
const accordionManager = new AccordionManager();

/**
 * Función de inicialización para main.js
 */
export function inicializarAcordeones() {
    console.log('🎯 Inicializando módulo de acordeones...');
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            accordionManager.inicializar();
        });
    } else {
        accordionManager.inicializar();
    }
    
    console.log('✅ Módulo de acordeones configurado');
}