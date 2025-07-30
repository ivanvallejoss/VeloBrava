// MANEJO COMPLETO DE FORMULARIO

import { generateWhatsAppURL} from "./encoder.js";
import { generateFormMessage, generateConfirmationMessage, generateSuccessMessage, generateQuickMessage} from "./message-builder.js";
import { selectGuide } from "./config.js";;
import {validarFormularioWhatsApp} from '../shared/validators.js';
import {mostrarNotification} from '../shared/notification.js';

/**

Procesador principal del formulario

@param {HTMLFormElement} form - Elemento del formulario
@param {string} targetPhone - Numero de whatsapp de destino
@returns {string} - URL de WhatsApp lista para usar.

*/

export function processFormToWhatsapp(form, targetPhone){
    //Extraer datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    //Validar Datos
    const validationResult = validarFormularioWhatsApp(data);
    
    if (!validationResult.isValid){
        throw new Error(valdidationResult.erros.join(', '));
    }

    // Generar mensaje personalizado
    const message = generateFormMessage(data);

    // Generar URL de Whatsapp
    return generateWhatsAppURL(targetPhone, message);
}


/**
Manejador de envio del formulario con whatsapp

@param {Event} event - Evento del formulario 

*/

export function handleFormSubmit(event){
    event.preventDefault();

    try{
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const tourType = data.tour;

        // Seleccionar guia apropiado
        const guide = selectGuide(tourType);

        //Procesar formulario y generar URL
        const whatsappURL = processFormToWhatsapp(form, guide.phone)

        //Mostrar confimacion antes de redirigir
        const confirmMessage = generateConfirmationMessage(data, guide);

        if (confirm(confirmMessage)){
            // Abrir whatsapp
            window.open(whatsappURL, '_blank');

            // Resetear formulario
            form.reset()

            // mostrar mensaje de exito
            const successMessage = generateSuccessMessage(guide);
            mostrarNotification(successMessage, 'success');
        }
    } catch (error) {
        console.error(`Error procesando formulario:`, error);
        mostrarNotification(`Error: ${error.message}`, 'error');
    }
}

/**
 * Manejador para botones rapidos de WhatsApp
 * @param {Event} event - Evento del click
 */

export function handleQuickButton(event){
    // Verificar si el click fue en un boton Whatsapp 
    if (!event.target.classList.contains('whatsapp-btn')){
        return; //No es nuestro boton, ignorar
    }

    try{
        console.log(`boton capturado ${event.target}`)
        const button = event.target;

        // Extraer datos del boton
        const tourType = button.dataset.tour;
        const messageType = button.dataset.message;

        // Validar que tengamos los datos necesarios
        if(!tourType){
            throw new Error(`Boton sin informacion de tour (data-tour)`)
        }
        if (!messageType){
            throw new Error(`Boton sin tipo de mensaje (data-message)`)
        }

        // Seleccionar guia apropiado.
        const guide = selectGuide(tourType);

        // Generar mensaje rapido
        const message = generateQuickMessage(tourType, messageType);

        //Generar URL de WhatsApp
        const whatsappURL = generateWhatsAppURL(guide.phone, message);

        // Abrir whatsApp directamente (sin confirmation para botones rapidos)
        window.open(whatsappURL, '_blank');

        // Mostrar notificacion de exito
        // const tourName = button.closest('.card')?.querySelector('h4')?.textContent || 'tour';
        mostrarNotification(`Abriendo WhatsApp para consulta sobre`, 'success', 3000);
    } catch (error){
        console.error(`Error en boton rapido de Whatsapp`, error);
        mostrarNotification(`Error: ${error.message}`, 'error');
    }
}


// INCIALIZAR EL SISTEMA DE WHATSAPP

export function inicializarWhatsapp(){
    console.log('Inicializando sistema de WhatsApp...')

    //Resetear formulario de contacto
    const contactForm = document.getElementById('contactForm');

    if(contactForm){
        // Agregar manejador de envio
        contactForm.addEventListener('submit', handleFormSubmit);
        console.log('Sistema de whatsapp inicializado correctamente')
    } else { 
        console.warn('No se encontro formulario con ID "contactForm"')
    }

    // Buscar seccion de tour para botones rapidos
    const tourSection = document.querySelector('.tour_section');

    if(tourSection){
        // Agregamos manejador de clicks para botones rapidos
        tourSection.addEventListener('click', handleQuickButton);
        console.log('Botones rapidos WhatsApp inicializados');
    } else{
        console.warn('No se encontro Section con clase tour_section');
    }

    console.log('Sistema de whatsapp completamente inicializado');

    // Exponer funciones de testing en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.WhatsAppTesting = {
        testFormMessage: () => import('./message-builder.js').then(m => m.testFormMessage()),
        testEncoding: (msg) => import('./encoder.js').then(m => m.testEncoding(msg))
        };
    }
}