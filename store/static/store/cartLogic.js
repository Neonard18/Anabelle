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
    console.log(data);

    data && data.items.forEach(item => {
        const cartTray = document.getElementById("cart-tray")
        const cartItem = document.createElement("div")
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
                    <span class="quantity-minus">-</span>
                    <input class="quantity-input" type="number" value=${item.quantity}>
                    <span class="quantity-plus">+</span>
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
    console.log(data);
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
