from django.forms import ValidationError
from django.urls import reverse
from django.http import JsonResponse
from django.views.generic import ListView
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Product, Category, Cart, CartItem
from django.contrib.auth import login, logout
from .forms import RegisterForm, LoginForm
from django.db.models import F

# Create your views here.
def register(request):
    if request.method == 'POST':
        form = RegisterForm(data=request.POST)

        if form.is_valid():
            print("Form is valid", form.is_valid())
            user = form.save()
            login(request, user)
            return redirect(reverse('index'))

    else:
        if request.user.is_authenticated:
            print(request.user.email)
            return redirect(reverse('index'))

        form = RegisterForm()
    
    return render(request,'store/register.html',{'form':form})

def sign_in(request):
    if request.method == "POST":
        form = LoginForm(request.POST)

        if form.is_valid():
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')

            user = authenticate(request, username=email, password=password)
            if user is None:
                form.add_error(None,ValidationError(("Invalid email or password."),code="invalid"))
            else: 
                login(request, user)
                return redirect(reverse('index'))
    else:
        if request.user.is_authenticated:
            return redirect(reverse('index'))
        
        form = LoginForm()

    return render(request,'store/sign-in.html',{'form':form})
     

def logging_out(request):
    logout(request)
    return redirect(reverse('signin'))

        
@login_required # to be removed later
def index(request):
    ftd_product =  Product.objects.filter(is_featured = True)
    return render(request,'store/home.html',{"fproducts":ftd_product})


def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    # check is the auth user have a cart already, 
    # If the user doesn't have a cart yet, one should be created.
    user = request.user
    if not hasattr(user, "cart"):
        cart = Cart.objects.create(user=user)
        user.cart = cart
    else: 
        cart = user.cart

    try:
        cartitem = CartItem.objects.get(cart=cart,product=product)
        cartitem.quantity += 1
        cartitem.save()
        xcart = 'true'
    except CartItem.DoesNotExist:
        xcart = 'false'
        cartitem = CartItem.objects.create(cart=cart,product=product)

    cart_total = sum(item.total_price() for item in cart.items.all())  
    quantity_total = sum(item.quantity for item in cart.items.all())

    return JsonResponse({
        "xcart": xcart,
        "cart_total" : cart_total,
         "cart_tquantity" : quantity_total,
         "product_name" : product.productname,
         "product_price" : product.price,
         "product_image" : product.productimage.url,
         "cartitem_quantity": cartitem.quantity,
    })

def delete_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    user = request.user
    
    cart = user.cart
    try:
        cartItem = CartItem.objects.get(cart=cart,product=product)
        cartItem.delete()
    except CartItem.DoesNotExist:
        pass
    return JsonResponse({"message": "Item deleted from cart"})
    

def view_cart(request):
    user = request.user    

    if not hasattr(user, "cart"):
        cart = Cart.objects.create(user=user)
        user.cart=cart
    else:
        cart = user.cart

    cart_items = cart.items.all()
    items = [
        {
            "id": item.id,
            "product_id": item.product.id,
            "name": item.product.productname,
            "size" : item.product.size,
            "price" : item.product.price,
            "quantity" : item.quantity,
            "image" : item.product.productimage.url,
        }
        for item in cart_items
    ]

    return JsonResponse({
        "cart_total" : sum(item.total_price() for item in cart_items),
        "items" : items,
    })

def searchItem(request, phrase):
    if request.method == 'POST':
        try:
            # Fetch products matching the search phrase
            productx = Product.objects.filter(productname__icontains=phrase).only('id', 'productname', 'productimage')
            print(phrase)
            # Prepare product data
            products = [
                {
                    "id": product.id,
                    "name": product.productname,
                    "image": product.productimage.url if product.productimage else None,
                }
                for product in productx
            ]

            # Return results
            return JsonResponse({"products": products})

        except Exception as e:
            # Return a meaningful error response
            return JsonResponse(
                {"error": f"An error occurred while searching for '{phrase}'."},
                status=500
            )


class ProductList(ListView):
    model = Product
    template_name = "store/products.html"