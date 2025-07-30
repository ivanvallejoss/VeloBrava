// ============================================
// funcionalidades/shared/validators.js
// VALIDACIONES REUTILIZABLES
// ============================================

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {boolean} - Es válido
 */
export function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida teléfono
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} - Es válido
 */
export function validarTelefono(telefono) {
    return /^[\d\s\-\+\(\)]{8,}$/.test(telefono);
}

/**
 * Valida campos obligatorios
 * @param {Object} data - Datos a validar
 * @param {Array} requiredFields - Campos obligatorios
 * @returns {Array} - Errores encontrados
 */
export function validarCamposObligatorios(data, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].toString().trim() === '') {
            errors.push(`El campo ${field} es obligatorio`);
        }
    });
    
    return errors;
}

/**
 * Validación específica para formulario de WhatsApp
 * @param {Object} data - Datos del formulario
 * @returns {Object} - Resultado de validación
 */
export function validarFormularioWhatsApp(data) {
    const errors = [];
    
    // Campos obligatorios
    const requiredFields = ['name', 'email', 'tour'];
    errors.push(...validarCamposObligatorios(data, requiredFields));
    
    // Validar email
    if (data.email && !validarEmail(data.email)) {
        errors.push('El email no tiene un formato válido');
    }
    
    // Validar teléfono si está presente
    if (data.phone && data.phone.trim() && !validarTelefono(data.phone)) {
        errors.push('El teléfono no tiene un formato válido');
    }
    
    // Validar nombre (mínimo 2 caracteres)
    if (data.name && data.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}