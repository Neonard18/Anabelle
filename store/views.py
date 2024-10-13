from django.urls import reverse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Product
from django.contrib.auth import login
from .forms import RegisterForm

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

        

def index(request):
    shoes = Product.objects.filter(category__categoryname = "Shoes")
    return render(request,'store/home.html',{"products":shoes})