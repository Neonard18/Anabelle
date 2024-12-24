let quickLayout = document.querySelector(".quick-layout")

async function quickView(pk) {
    let response = await fetch(`/store/quickview/${pk}/`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken' : csrftoken,
        },
        mode: 'same-origin',
    })

    let data = await response.json()
    console.log(data)
    quickLayout.style.opacity = 1
    quickLayout.style.pointerEvents = "auto"
    overlay.style.display = "block"
    document.querySelector("body").style.overflow = "hidden"

    let quickImage = document.createElement("div")
    let quickDesc = document.createElement("div")
    let qXmark = document.createElement("div")

    quickImage.className = "quick-image"
    quickDesc.className = "quick-desc"
    qXmark.className = "q-xmark"

    quickDesc.innerHTML = `  
            <div class="quick-pname">
                ${data.product[0].name}      
            </div>

            <div class="quick-price">
                $${data.product[0].price} USD
            </div>

            <div class="product-size">
                <label id="size-label" for="size">Size</label>
                <select name="size" id="size">
                    ${
                        data.size.map(size => {
                            return `<option value="${size.size}">${size.size}</option>`
                        }).join("")
                    }
                <select>
            </div>

            <div class="product-quantity">
                <label id="quantity-label" for="quantity-container">Quantity</label>
                <div class="quantity-container" id="quantity-container"> 
                    <span class="quantity-minus">-</span>
                    <input class="quantity-input" type="number" value="${1}" >
                    <span class="quantity-plus">+</span>
                </div>
            </div>

            <div class="quick-addtocart" onclick="addToCart(${data.product[0].id})">
                Add to Cart
            </div>

            <div class="buy-now" >
                Buy Now
            </div>

            <div ><a>View Product</a> &rarr;</div>
    `

    qXmark.innerHTML = `
        <div onclick="xQuickView()">
                <i class="fa-sharp-duotone fa-solid fa-xmark"></i>
        </div>
    `

    quickImage.style.backgroundImage = `url(${data.product[0].img})`

    quickLayout.innerHTML = ""
    quickLayout.appendChild(quickImage)
    quickLayout.appendChild(quickDesc)  
    quickLayout.appendChild(qXmark)  
}


function xQuickView() {
    quickLayout.style.opacity = 0
    quickLayout.style.pointerEvents = "none"
    overlay.style.display = "none"
    document.querySelector("body").style.overflow = "visible"
}