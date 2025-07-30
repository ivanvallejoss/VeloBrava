// SISTEMA DE NOTIFICACIONES REUTILIZABLE

let notificationsContainer = null;

/*

Inicializar sistema de notificaciones

*/

export function inicializarNotifications(){
    // Crear contenedor de notificaciones si no existe
    if (!document.querySelector('.notifications-container')){
        notificationsContainer = document.createElement('div');
        notificationsContainer.className = 'notifications-container';
        notificationsContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index:9999;
        pointer-events: none;
        `;
        document.body.appendChild(notificationsContainer);
    } else{
        notificationsContainer = document.querySelector('.notifications-container');
    }
}

/**
 * Mostrar notificación
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación (success, error, info, warning)
 * @param {number} duracion - Duración en milisegundos
 * @returns {HTMLElement} - Elemento de notificación
 */
export function mostrarNotification(mensaje, tipo = 'info', duracion = 4000) {
    if (!notificationsContainer) {
        inicializarNotificaciones();
    }
    
    const notificacion = document.createElement('div');
    
    // Estilos base
    const baseStyles = `
        background: white;
        color: #333;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        margin-bottom: 10px;
        font-family: Inter, -apple-system, sans-serif;
        font-weight: 500;
        font-size: 14px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        pointer-events: auto;
        position: relative;
        border-left: 4px solid;
        max-width: 350px;
        word-wrap: break-word;
    `;
    
    // Colores según tipo
    const typeColors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notificacion.style.cssText = baseStyles + `border-left-color: ${typeColors[tipo]};`;
    
    notificacion.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="flex: 1;">${mensaje}</span>
            <button style="
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                margin-left: 10px;
                color: #666;
                line-height: 1;
            ">&times;</button>
        </div>
    `;
    
    // Agregar event listener para cerrar
    notificacion.querySelector('button').addEventListener('click', () => {
        cerrarNotificacion(notificacion);
    });
    
    notificationsContainer.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto cerrar
    setTimeout(() => {
        cerrarNotificacion(notificacion);
    }, duracion);
    
    return notificacion;
}

/**
 * Cerrar notificación específica
 * @param {HTMLElement} notificacion - Elemento a cerrar
 */
export function cerrarNotificacion(notificacion) {
    notificacion.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.parentNode.removeChild(notificacion);
        }
    }, 300);
}

/**
 * Cerrar todas las notificaciones
 */
export function cerrarTodasLasNotificaciones() {
    if (notificationsContainer) {
        const notificaciones = notificationsContainer.querySelectorAll('div');
        notificaciones.forEach(cerrarNotificacion);
    }
}