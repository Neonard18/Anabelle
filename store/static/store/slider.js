const burger = document.querySelector('#burger')
console.log(burger);
const slider = document.querySelector('.slider')

function openSlider (){
    if (burger.checked) {
        document.body.style.overflowY = "hidden";
        if (window.innerWidth <= 500) {
            slider.style.width = `${mobileIncrement}px`
        }else {
            slider.style.width = `${desktopIncrement}px`
        }
    }
    if (!burger.checked){
        slider.style.width = 0
        document.body.style.overflowY = "scroll";
    }
}

function closeSlider() {
    if (burger.checked) {
        burger.checked = false
        openSlider()
    }
}
