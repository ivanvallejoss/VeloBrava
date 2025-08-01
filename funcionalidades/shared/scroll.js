/**
 * Scroll con compatibilidad
 */

export function inicializarScrollSmooth(){
        // Detectar si el navegador soporta scroll suave native bien
        const supportsNativeSmooth = `scrollBehavior` in document.documentElement.style;

        document.querySelectorAll('a[href^="#"]').forEach(enlace => {
            enlace.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if(!targetElement) return;

                const headerOffSet = 80;
                const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const targetPosition = elementTop - headerOffSet;

                // Usar metodo personalizado para evitar rebote.
                scrollSuavePersonalizado(targetPosition, 1000);
            })
        })
} 

/**
 * Funcion de scroll suave personalizada sin rebote
 * @param {number} targetPosition - Posicion de destino
 * @param {number} duration - Duracion en milisegundos
 */

function easeInOutCubic(t){
    return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3)/ 2;
}

function scrollSuavePersonalizado(targetPosition, duration = 800){
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;


    // Funcion de animacion
    function animacion(currentTime){
        if(startTime === null) startTime = currentTime;

        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Function easing suave (sin rebote);
        const easedProgress = easeInOutCubic(progress);
        const currentPosition = startPosition + (distance * easedProgress);

        window.scrollTo(0, currentPosition)

        if (progress < 1){
            requestAnimationFrame(animacion);
        }
    }

    requestAnimationFrame(animacion);
}