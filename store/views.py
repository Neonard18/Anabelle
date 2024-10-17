from django.forms import ValidationError
from django.urls import reverse
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Product
from django.contrib.auth import login, logout
from .forms import RegisterForm, LoginForm

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

        
@login_required
def index(request):
    shoes = Product.objects.filter(category__categoryname = "Shoes")
    return render(request,'store/home.html',{"products":shoes})