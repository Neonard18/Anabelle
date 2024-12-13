const firstItem = document.querySelectorAll('.f-item > div')[0];
const secondItem = document.querySelectorAll('.f-item > div')[1];
const thirdItem = document.querySelectorAll('.f-item > div')[2];
const fourthItem = document.querySelectorAll('.f-item > div')[3];
const toggleBox1 = document.querySelector("#toggle-1")
const toggleBox2 = document.querySelector("#toggle-2")
const toggleBox3 = document.querySelector("#toggle-3")
const toggleBox4 = document.querySelector("#toggle-4")
const toggleLabel = document.getElementsByClassName("toggle-label")[0]


function itemIncrement() {

    if (toggleBox1.checked) {
        firstItem.classList.add('expanded')       
    }else{   
        firstItem.classList.remove('expanded')      
    }

    if(toggleBox2.checked) {
        secondItem.classList.add('expanded')
    }else {
        secondItem.classList.remove('expanded')
    }

    if(toggleBox3.checked) {
        thirdItem.classList.add('expanded')
    }else{
        thirdItem.classList.remove('expanded')
    }

    if(toggleBox4.checked) {
        fourthItem.classList.add('expanded')
    }else {
        fourthItem.classList.remove('expanded')
    }
}

toggleBox1.addEventListener("change",itemIncrement)
toggleBox2.addEventListener("change",itemIncrement)
toggleBox3.addEventListener("change",itemIncrement)
toggleBox4.addEventListener("change",itemIncrement)

