let quantityPlus = document.querySelector(".quantity-plus")


async function incrementQuantity(productID){
    quantityPlus.stepUp()
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


}