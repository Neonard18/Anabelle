function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');
const overlay = document.getElementsByClassName("overlay")[0]
const sidebar = document.getElementById("sidebar") 
const parent = sidebar.parentElement
const parentWidth = parent.clientWidth
const deskIncrement = parentWidth * ( 1 / 3)
const mobileIncrement = parentWidth * (2.6 / 3)
const mobileView = window.matchMedia("(max-width: 500px)");
let subtotal = document.querySelector(".cart-subtotal")
let spanSubtotal = document.querySelector("#subtotal")
let quantityPlus = document.querySelector(".quantity-plus")



async function viewCart() {   
    const cartTray = document.getElementById("cart-tray")
    cartTray.innerHTML=""
    overlay.style.display = "block"


    if(window.innerWidth <= 500){
        sidebar.style.width = `${mobileIncrement}px`
    }else {
        sidebar.style.width = `${deskIncrement}px`
    }

    let resp = await fetch(`/store/cartview/`,{
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',  // Necessary to recognize the request as AJAX in Django
            'X-CSRFToken': csrftoken,  // Include CSRF token
        },
        mode: 'same-origin',
    })

    let data = await resp.json();

    if(data.items < 1) {
        document.querySelector(".desc").style.display = "none"
        subtotal.style.display = "none"
        cartTray.style.alignItems = "center"
        cartTray.style.justifyContent = "center"
        cartTray.style.textAlign = "center"
        cartTray.style.fontWeight = "400"
        cartTray.style.height = "65%"
        cartTray.style.fontSize = "28px"
        let cartItem = document.createElement("div")
        cartItem.className = "product-cartempty"
    
        cartItem.innerHTML = `
            Cart is empty, View products to add items.
        `

        cartTray.innerHTML = "Cart is empty, View products to add items."
    }else {
        document.querySelector(".desc").style.display = "flex"
        subtotal.style.display = "flex"
        cartTray.style.alignItems = "stretch"
        cartTray.style.justifyContent = "flex-start"
        cartTray.style.textAlign = "left"
        cartTray.style.fontWeight = "500"
        cartTray.style.height = "auto"
        cartTray.style.fontSize = "16px"
    }

    data.items.length >= 1 && data.items.forEach(item => {
        let cartTray = document.getElementById("cart-tray")
        let cartItem = document.createElement("div")
        cartItem.className = "product-cartitem"
        cartItem.innerHTML = `
            <div id="cart-productimg">
                <img style="width: 100%; height: 100%; background-color: #fff; object-fit: fill;" src="${item.image}" alt="cart-image">
            </div>
            <div class="product-desc-${item.product_id}" id="product-desc">
                <div id="cart-productname" class="cart-productname">${item.name}</div>
                <div id="cart-productprice" class="cart-productprice">$${item.price}</div>
            </div>
            <div id="product-quantity">
                <div class="quantity-container"> 
                    <span class="quantity-minus" onClick="decrementQuantity(${item.product_id},${item.id})">-</span>
                    <input class="quantity-input" type="number" value=${item.quantity} step="1" data-id="${item.id}">
                    <span class="quantity-plus" onClick="incrementQuantity(${item.product_id},${item.id})">+</span>
                </div>
                <i class="fa-sharp-duotone fa-solid fa-trash" id="trash-tray${item.product_id}" onClick="deleteCartItem(${item.product_id})"></i>
            </div>
        `

        cartTray.appendChild(cartItem)
    });

    if (data && data.items.length <= 2) {
        subtotal.style.position = "absolute"
        subtotal.style.bottom = "0"
    }else{
        subtotal.style.position = "static"
    }

    spanSubtotal.innerHTML = `$${data.cart_total} USD`
}


async function incrementQuantity(productID, itemID, element){
    let resp = await fetch(`/store/cart/${productID}/increment/`,
        {
            method: "POST",
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken' : csrftoken,
            },

            mode: "same-origin",
        }
    )

    if (element == undefined) {
        element = document.querySelector(`.quantity-input[data-id="${itemID}"]`)
        element.stepUp()
    
        let data = await resp.json()
        
        spanSubtotal.innerHTML = `$${data.total} USD`
    }else{
        element.stepUp()
        
    }
}

async function decrementQuantity(productID, itemID, element){
    let resp = await fetch(`/store/cart/${productID}/decrement/`,
        {
            method: "POST",
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken' : csrftoken,
            },

            mode: "same-origin",
        }
    )

    if (element == undefined) {
        element = document.querySelector(`.quantity-input[data-id="${itemID}"]`)
        element.stepDown()
    
        let data = await resp.json()
        
        spanSubtotal.innerHTML = `$${data.total} USD`
    }else{
        element.stepDown()
    }
}


async function deleteCartItem(productid) {
    const resp = await fetch(`/store/cart/del/${productid}/`,{
        method: 'DELETE',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken,  // Include CSRF token
        },
        mode: 'same-origin',
    })

    const data = await resp.json();
    viewCart()
}

async function addToCart(productid) {
    let resp = await fetch(`/store/cart/add/${productid}/`, {
        method: "GET",
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CRSFToken': csrftoken,
        },
        mode: 'same-origin',
    });

    let data = await resp.json();    
    viewCart()
}

function closeCartSideBar() {
    const overlay = document.getElementsByClassName("overlay")[0];
    const sidebar = document.getElementById("sidebar");

    sidebar.style.width = "0";
    overlay.style.display = "none";
}
