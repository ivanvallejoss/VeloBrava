/**
 * VALIDACION DE URLs WHATSAPP
 */

/**
 * Validar que una URL es de WhatsApp legtimo.
 * @param {string} url - URL a validar
 * @return {boolean} - es valido o no
 */
function isValidWhatsAppURL(url){
    try{
        const parsedURL = new URL(url);

        //Lista blanca de hosts de whatsapp
        const validHosts = [
            'wa.me',
            'api.whatsapp.com',
            'web.whatsapp.com'
        ];

        // Verificar protocolo HTTPS
        if (parsedURL.protocol !== 'https:'){
            console.warn('URL WhatsApp debe usar HTTPS');
            return false;
        }

        // Verificar host
        if (!validHosts.includes(parsedURL.hostname)) {
            console.warn(`⚠️ Host no válido para WhatsApp: ${parsedURL.hostname}`);
            return false;
        }
        
        // Verificar estructura específica para wa.me
        if (parsedURL.hostname === 'wa.me') {
            const pathParts = parsedURL.pathname.split('/');
            
            // Debe tener formato: /numero o /numero?text=...
            if (pathParts.length < 2 || !pathParts[1]) {
                console.warn('⚠️ Formato de URL wa.me inválido');
                return false;
            }
            
            // Verificar que el número solo contenga dígitos
            const phoneNumber = pathParts[1];
            if (!/^\d+$/.test(phoneNumber)) {
                console.warn('⚠️ Número de teléfono inválido en URL');
                return false;
            }
            
            // Verificar longitud del número (entre 7 y 15 dígitos)
            if (phoneNumber.length < 7 || phoneNumber.length > 15) {
                console.warn('⚠️ Longitud de número de teléfono inválida');
                return false;
            }
        }
        
        return true;
        
    } catch (error) {
        console.warn('⚠️ URL malformada:', error.message);
        return false;
    }
}

/**
 * Validar parámetros de la URL de WhatsApp
 * @param {string} url - URL de WhatsApp
 * @returns {boolean} - Parámetros válidos
 */
function validateWhatsAppParams(url) {
    try {
        const parsedURL = new URL(url);
        const params = parsedURL.searchParams;
        
        // Si hay parámetro text, validarlo
        if (params.has('text')) {
            const text = params.get('text');
            
            // Longitud máxima razonable para mensaje WhatsApp
            if (text.length > 4096) {
                console.warn('⚠️ Mensaje demasiado largo para WhatsApp');
                return false;
            }
            
            // Verificar que no contenga scripts maliciosos
            const suspiciousPatterns = [
                /<script/i,
                /javascript:/i,
                /data:text\/html/i,
                /vbscript:/i
            ];
            
            for (const pattern of suspiciousPatterns) {
                if (pattern.test(text)) {
                    console.warn('⚠️ Contenido sospechoso en mensaje WhatsApp');
                    return false;
                }
            }
        }
        
        return true;
        
    } catch (error) {
        console.warn('⚠️ Error validando parámetros:', error.message);
        return false;
    }
}
/**
 * Función principal de validación (combina todas las validaciones)
 * @param {string} url - URL de WhatsApp a validar
 * @returns {boolean} - URL completamente válida
 */
export function validateWhatsAppURL(url) {
    if (!url || typeof url !== 'string') {
        console.warn('⚠️ URL de WhatsApp no proporcionada o inválida');
        return false;
    }
    
    // Validaciones en cadena
    const isValidURL = isValidWhatsAppURL(url);
    const hasValidParams = validateWhatsAppParams(url);
    
    const isCompletelyValid = isValidURL && hasValidParams;
    
    if (isCompletelyValid) {
        console.log('✅ URL de WhatsApp válida:', url);
    } else {
        console.error('❌ URL de WhatsApp inválida:', url);
    }
    
    return isCompletelyValid;
}

/**
 * Rate limiting para prevenir spam de clicks en WhatsApp
 */
class WhatsAppRateLimiter {
    constructor(cooldownMs = 2000) {
        this.lastClick = 0;
        this.cooldown = cooldownMs;
    }
    
    canProceed() {
        const now = Date.now();
        const timeSinceLastClick = now - this.lastClick;
        
        if (timeSinceLastClick < this.cooldown) {
            const remainingTime = Math.ceil((this.cooldown - timeSinceLastClick) / 1000);
            console.warn(`⚠️ Espera ${remainingTime} segundos antes del próximo envío`);
            return false;
        }
        
        this.lastClick = now;
        return true;
    }
    
    reset() {
        this.lastClick = 0;
    }
}

// Instancia global del rate limiter
const whatsappLimiter = new WhatsAppRateLimiter(3000); // 3 segundos entre clicks

/**
 * Función segura para abrir WhatsApp
 * @param {string} whatsAppURL - URL de WhatsApp
 * @returns {boolean} - Se abrió correctamente
 */

export function openWhatsAppSecurely(whatsAppURL) {
    console.log('🔍 Validando URL de WhatsApp...');
    
    // 1. Validar rate limiting
    if (!whatsappLimiter.canProceed()) {
        if (window.mostrarNotificacion) {
            mostrarNotificacion('⏳ Espera un momento antes de enviar otra consulta', 'warning', 3000);
        }
        return false;
    }
    
    // 2. Validar URL
    if (!validateWhatsAppURL(whatsAppURL)) {
        console.error('❌ URL de WhatsApp inválida, bloqueando redirección');
        if (window.mostrarNotificacion) {
            mostrarNotificacion('❌ Error: URL de WhatsApp inválida', 'error', 4000);
        }
        return false;
    }
    
    // 3. Abrir WhatsApp de forma segura
    try {
        console.log('✅ Abriendo WhatsApp de forma segura...');
        window.location.href = whatsAppURL;
        
        if (window.mostrarNotificacion) {
            mostrarNotificacion('📱 Abriendo WhatsApp...', 'success', 2000);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error abriendo WhatsApp:', error);
        if (window.mostrarNotificacion) {
            mostrarNotificacion('❌ Error abriendo WhatsApp', 'error', 4000);
        }
        return false;
    }
}
