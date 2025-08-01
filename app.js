import {inicializarWhatsapp} from './funcionalidades/whatsapp/form-handler.js';
import {inicializarNotifications} from './funcionalidades/shared/notification.js';


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
            inicializarNotifications();
            inicializarWhatsapp();
            console.log('Sistema Whatsapp inicializado correctamente');
        } catch (error){
            console.error('Error al inicializar sistema de Whatsapp', error)
        }
    }
}

const app = new App();
window.App = app;








// FUNDADORES SLIDES

let cardSlider = document.querySelector("#fundadores_slider")
let relative = -50 // 50% Es la transicion perfecta para las cards en vista Mobile.

setInterval(function(){
    let percentage = 1 * relative;

    cardSlider.style.transform = "translateX("+ percentage + "%)";
    if(relative == 0){
        relative = -50
    } else{
        relative = 0
    }
}, 5000)