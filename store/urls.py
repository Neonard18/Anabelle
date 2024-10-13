from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('register/', views.register,name='register'),
    path('index/', views.index,name='index'),
]

