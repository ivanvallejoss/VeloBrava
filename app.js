import { inicializarWhatsapp } from './funcionalidades/whatsapp/form-handler.js';
import { inicializarNotifications } from './funcionalidades/shared/notification.js';
import { inicializarScrollSmooth } from './funcionalidades/shared/scroll.js';
import { inicializarCardSlider } from './funcionalidades/shared/animation.js';
import { inicializarTranslation } from './funcionalidades/translation/i18n/translator.js';
import { inicializarAcordeones } from './funcionalidades/shared/accordion.js';


class App{
    constructor(){
        this.inicializar();
    }

    inicializar(){
        if (document.readyState === 'loading'){
            document.addEventListener('DOMContentLoaded', () => this.configurarModulos());
        } else {
            this.configurarModulos();
        }
    }

    configurarModulos(){
        try{
            inicializarCardSlider();
            // inicializarTranslation();
            inicializarAcordeones();
            inicializarNotifications();
            inicializarWhatsapp();
            inicializarScrollSmooth();
            console.log(`Todos los sistemas cargaron correctamente`)
        } catch (error){
            console.error('Error al inicializar alguno de los sistemas', error)
        }
    }
}

const app = new App();
window.App = app;