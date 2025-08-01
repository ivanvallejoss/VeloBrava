// Apartado para las cards sliders


export function inicializarCardSlider(){
    let cardSlider = document.querySelector("#fundadores_slider");
    let relativePosition = -50;
    
    setInterval(function(){
        cardSlider.style.transform = `translateX(${relativePosition}%)`;
        
        if(relativePosition === 0){
            relativePosition = -50;
        } else{
            relativePosition = 0;
        }
    }, 5000)
}