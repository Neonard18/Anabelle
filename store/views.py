from django.urls import reverse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
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
        form = RegisterForm()
    
    return render(request,'store/register.html',{'form':form})  

        

@login_required
def index(request):
    return HttpResponse(f"{request.user}: {request.user.is_authenticated}")