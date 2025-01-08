let miniSearch = document.querySelector(".mini-search")
let miniSearchResult = document.querySelector('.searched-result')
let miniSearchContainer = document.querySelector('.mini-search-container')
let searchGlass = document.querySelector(".🔍")

function closeMinSearch (){
    overlay.style.display = "none"
    minSearch.innerHTML = ""
    miniSearchContainer.style.width = 0
    miniSearchContainer.style.pointerEvents = "none"
    miniSearchContainer.style.opacity = "0"
    miniSearchContainer.style.height = 0
    searchGlass.style.display = "block"
    document.querySelector("body").style.overflow = "scroll"
    document.querySelector(".burger-search").style.justifyContent = "space-between"
}

async function minSearch() {
    document.querySelector(".burger-search").style.justifyContent = "end"
    document.querySelector("body").style.overflow = "hidden"
    overlay.style.display = "block"
    searchGlass.style.display = "none"
    miniSearchContainer.style.width = "95%"
    miniSearchContainer.style.pointerEvents = "all"
    miniSearchContainer.style.opacity = "1"
    miniSearchContainer.style.height = "80%"
    miniSearchResult.innerHTML = ""    
}

async function lookUp(){
    miniSearchResult.innerHTML = ""
    minSearch.innerHTML = ""
    let phrase = miniSearch.value
    let resp = await fetch(`/store/search/${phrase}/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken,
        },
        mode: 'same-origin',
    })

    let data = await resp.json()
    console.log(data)
    data.products.forEach(product => {
        let miniResult = document.createElement("a")
        miniResult.href = `/store/product-detail/${product.id}/`
        miniResult.className = "mini-result"
        miniResult.innerHTML = `
            <div class="mini-result-image">
                <img style="width: 100%; height: 100%; object-fit: fill; border-radius: 5px;" src="${product.image}" alt="${product.name}">
            </div>
            <div class="mini-result-info">
                <h3>${product.name}</h3>
                <p>$ ${product.price}</p>
            </div>
        `
        miniSearchResult.appendChild(miniResult)
    })
}