// CONSTRUCCION DE MENSAJES ESPECIFICOS.

import {TOURS_CONFIG, LEVELS_CONFIG, COMPANY_CONFIG} from './config.js';

/** 
*
* Genera el mensaje personalizado del formulario,
* @param {Object} formData - Datos del formulario
* @returns {string} - mensaje formateado

*/


export function generateFormMessage(formData){
    const{
        name,
        email,
        tour,
        level,
        date,
        comments,
    } = formData;


// EN CASO DE HABER FECHA EN EL FORM
    const formattedDate = date ? new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'A coordinar'


// CONSTRUYENDO EL MENSAJE
    let message = `*NUEVA CONSULTA ${COMPANY_CONFIG.name.toUpperCase()}*\n\n`;
    message += `*Nombre:* ${name}\n`;
    message += `*Email:* ${email}\n`;

    if (phone){
        message += `*Telefono:* ${phone}\n`;
    }

    message+= `\n*Experiencia Deseada*\n`;
    message+= `*Tour:* ${TOURS_CONFIG[tour]?.name || tour}\n`
    message+= `*Nivel:* ${LEVELS_CONFIG[level]?.name || level}\n`
    message+= `*Fecha preferida:* ${formattedDate}\n`

    if(comments && comments.trim()){
        message += `\n *Comentarios adicionales:*\n ${comments.trim()}\n`
    }
    message += `\n---\n`;
    message += `Enviado desde ${COMPANY_CONFIG.website}`

    return message
}


/**

Genera mensaje de confimacion personalizado.

@param {Object} formData - Datos del formulario.
@param {Object} guide - Informacion del guia
@returns {string} - Mensaje de confimacion

*/

export function generateConfirmationMessage(formData, guide){
    const tourName = TOURS_CONFIG[formData.tour]?.name || formData.tour;
    return `Enviar consulta sobre "${tourName}" a ${guide.name} por Whatsapp`;
}

/**
Genera mensaje de exito despues del envio

@param {Object} guide - Informacion del guia
@returns {string} - Mensaje de exito

*/

export function generateSuccessMessage(guide){
    return `Consulta enviada a ${guide.name}! Te respondera pronto por Whatsapp.`;
}

/**
 * Plantillas de mensajes para botones rapidos
 */


const MESSAGE_TEMPLATE = {
    'consulta-rapida': (tourName) => `Hola! Me interesa el tour ${tourName}. Tienen dispoinibilidad proxima? Gracias!`,
    'consulta-general': (tourName) => `Hola! Me gustaria recibir informacion detallada sobre ${tourName}. Horarios, que incluye, nivel de dificultad, etc. Muchas gracias!`
}

/**
 * Genera mensaje rapido para botones de tours
 * @param {string} tourType - Tipo de tour (costa-brava, girona-pro-ride, etc).
 * @param {string} messageType - Tipo de mensaje (consulta-rapida, consulta-general)
 * @returns {string} - Mensaje formateado
 */


export function generateQuickMessage(tourType, messageType){
    // Obtener nombre del tour
    const tourName = TOURS_CONFIG[tourType]?.name || tourType;

    //Obtener plantilla de mensaje
    const template = MESSAGE_TEMPLATE[messageType];

    if(!template) {
        //Mensaje por defecto si no existe la plantilla
        return `Hola! Me interesa saber mas sobre ${tourName}. Podrian contactarme? Gracias!`
    }

    return template(tourName);
}





// FUNCION DE PRUEBA CON DATOS DEL FORMULARIO.

export function testFormMessage(){
    const testData = {
        name: 'Juan Perez',
        email: 'juan@email.com',
        tour: 'costa-brava',
        level: 'intermedio',
        date: '2024-04-15',
        comments: 'Incluye Almuerzo? Tengo algunas restricciones alimentarias.'
    };

    const message = generateFormMessage(testData);
    console.log('Mensaje generado:', message)

    return {testData, message};
}