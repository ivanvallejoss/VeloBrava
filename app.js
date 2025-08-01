import { inicializarWhatsapp } from './funcionalidades/whatsapp/form-handler.js';
import { inicializarNotifications } from './funcionalidades/shared/notification.js';
import { inicializarScrollSmooth } from './funcionalidades/shared/scroll.js';
import { inicializarCardSlider } from './funcionalidades/shared/animation.js';


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
            inicializarNotifications();
            inicializarWhatsapp();
            inicializarScrollSmooth();
            console.log(`Sistema de scroll inicializado correctamente`)
        } catch (error){
            console.error('Error al inicializar alguno de los sistemas', error)
        }
    }
}

const app = new App();
window.App = app;