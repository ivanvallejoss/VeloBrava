/// MODULO DE ACORDEON PARA TOURS - VERSIÓN MEJORADA

/**
 * Gestiona los acordeones de las cards tours con transiciones CSS suaves
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
        const { isOpen, index } = accordionData;
        
        console.log(`🔄 Toggle acordeón ${index}: ${isOpen ? 'cerrando' : 'abriendo'}`);

        if (isOpen) {
            this.cerrarAcordeon(accordionData);
        } else {
            // Cerrar todos los otros acordeones primero si quieres comportamiento exclusivo
            // this.cerrarTodosExcepto(accordionData);
            this.abrirAcordeon(accordionData);
        }
    }

    /**
     * Abrir un acordeón con altura calculada dinámicamente
     * @param {Object} accordionData - Datos del acordeón
     */
    abrirAcordeon(accordionData) {
        const { toggle, content, tourCard } = accordionData;
        
        // Actualizar estado
        accordionData.isOpen = true;
        this.activeAccordion = accordionData;

        // Preparar para medición
        content.style.display = 'block';
        content.style.maxHeight = 'none';
        content.style.overflow = 'hidden';
        
        // Medir altura real del contenido
        const height = content.scrollHeight;
        
        // Resetear para animación
        content.style.maxHeight = '0';
        content.style.padding = '0 24px';
        
        // Trigger reflow para asegurar que el cambio se aplique
        content.offsetHeight;
        
        // Activar clases CSS
        toggle.classList.add('active');
        content.classList.add('active');
        tourCard?.classList.add('expanded');

        // Animar a la altura calculada
        content.style.maxHeight = height + 'px';
        content.style.padding = '0 24px 24px';

        // Accesibilidad
        toggle.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');

        // Actualizar texto del toggle
        const toggleText = toggle.querySelector('.toggle-text');
        if (toggleText) {
            toggleText.textContent = 'Ocultar detalles';
        }

        // Después de la animación, permitir altura automática para contenido dinámico
        setTimeout(() => {
            if (accordionData.isOpen) { // Solo si sigue abierto
                content.style.maxHeight = 'none';
            }
        }, this.animationDuration);
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

        if (animate) {
            // Para animación suave de cierre, primero fijamos la altura actual
            const currentHeight = content.scrollHeight;
            content.style.maxHeight = currentHeight + 'px';
            
            // Trigger reflow
            content.offsetHeight;
            
            // Animar a cerrado
            content.style.maxHeight = '0';
            content.style.padding = '0 24px';
            
            // Después de la animación, ocultar completamente
            setTimeout(() => {
                if (!accordionData.isOpen) { // Solo si sigue cerrado
                    content.style.display = 'none';
                }
            }, this.animationDuration);
        } else {
            // Cierre inmediato para inicialización
            content.style.display = 'none';
            content.style.maxHeight = '0';
            content.style.padding = '0 24px';
        }

        // Remover clases CSS
        toggle.classList.remove('active');
        content.classList.remove('active');
        tourCard?.classList.remove('expanded');

        // Accesibilidad
        toggle.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');

        // Actualizar texto del toggle
        const toggleText = toggle.querySelector('.toggle-text');
        if (toggleText) {
            toggleText.textContent = 'Ver itinerario y servicios';
        }
    }

    /**
     * Cerrar todos los acordeones excepto uno específico
     * @param {Object} exceptAccordion - Acordeón que NO debe cerrarse
     */
    cerrarTodosExcepto(exceptAccordion) {
        this.accordions.forEach(accordion => {
            if (accordion !== exceptAccordion && accordion.isOpen) {
                this.cerrarAcordeon(accordion);
            }
        });
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

    /**
     * Destruir acordeones y limpiar eventos
     */
    destruir() {
        this.accordions.forEach(accordion => {
            accordion.toggle.removeEventListener('click', this.toggleAcordeon);
        });
        this.accordions = [];
        this.activeAccordion = null;
    }
}

// Instancia global del manager
const accordionManager = new AccordionManager();

/**
 * Función de inicialización para app.js
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

// Exponer manager para debugging en desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.AccordionManager = accordionManager;
}