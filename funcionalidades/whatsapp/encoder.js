// FUNCIONES PURAS DE ENCODING

/*

@param {string} message - Mensaje a encodear
@returns {string} - Mensaje encodeado para URL de whatsapp

*/

export function encodeWhatsAppMessage(message){
    return encodeURIComponent(message)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')
    .replace(/\(/g, '%28')
    .replace(/\*/g, '%2A')
    .replace(/_/g, '%5F')
    .replace(/~/g, '%7E')
}

/*

Genera la URL Completa de Whatsapp

@para {string} phoneNumber - Numero de telefono

@param {string} message - Mensaje a enviar
@returns {string} - URL completa de whatsapp
*/
export function generateWhatsAppURL(phoneNumber, message){
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    const encodedMessage = encodeWhatsAppMessage(message);

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}


/*

Funcion de prueba para verificar el encoding
@param {string} testMessage - Mensaje de prueba
*/

export function testEncoding(testMessage = "Hola! Quiero informacion sobre tours en Costa Brava. Disponibilidad para el dia siguiente? Gracias! "){
    console.log('Mensaje original:', testMessage);
    console.log('Mensaje encodeado:', encodeWhatsAppMessage(testMessage))

    const testURL = generateWhatsAppURL('34600123456', testMessage);
    console.log('URL completa:', testURL);

    return testURL;
}