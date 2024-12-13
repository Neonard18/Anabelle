let searchElement = document.querySelector(".search-input")
let searchResult = document.querySelector('.search-result')
let searching = document.querySelector('.searching')
let inputXmark = document.querySelector('.input-xmark')



function closeSearch (){
    searching.style.width = 0
    searching.style.overflow = "hidden"
    searchElement.value = ""
    searchResult.innerHTML = ""
    searchResult.style.height = 0 + 'px'
    searchResult.style.paddingTop = 0
    searchResult.style.paddingBottom = 0
}
function showSearch (){
    searching.style.width = 340 + "px"
    searching.style.overflow = "visible"
}

let bottomValue = 0

async function search() {
    searchResult.innerHTML = ""
    let phrase = searchElement.value  

    let resp = await fetch(`/store/search/${phrase}/`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',  // Necessary to recognize the request as AJAX in Django
                'X-CSRFToken': csrftoken,  // Include CSRF token
            },
            mode: 'same-origin',
        })

    let data = await resp.json()
    let productsLength = data.products.length
    searchResult.style.paddingTop = 5 + "px"
    searchResult.style.paddingBottom = 5 + "px"
    searchResult.style.height = "fit-content"

    if (productsLength > 1) {
        let innerResultHeight = 120
        let padding = 10
        let gap = 5
        bottomValue = innerResultHeight * productsLength
        let ttlGap = (productsLength - 1) * gap
        bottomValue = bottomValue + padding + ttlGap + 5
        console.log(bottomValue);        
        searchResult.style.bottom = -bottomValue + "px"
    }else {
        searchResult.style.bottom = -135 + "px"
    }
    
    
    if (!productsLength == 0) {
        data.products.forEach(product => {
            let innerResult = document.createElement("div") 

            searchElement.style.display = "flex"
            innerResult.className = "inner-result"        
            innerResult.innerHTML = `
                <div class="result-image">
                    <img style="width: 100%; height: 100%; object-fit: fill; border-radius: 5px;" src="${product.image}" alt="product-image">
                </div>
                <div class="result-productname">
                    <div>
                    <span class="product-name">${product.name}</span>
                    </div>
                </div>
            `

            searchResult.appendChild(innerResult)
        })
    }else {
        let innerResult = document.createElement("div")
        innerResult.className = "inner-result"
        innerResult.innerHTML = `
            <div class="no-result">
                No result found.
            </div>
        `
        searchResult.appendChild(innerResult)
    }
}