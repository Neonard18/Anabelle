from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('register/', views.register,name='register'),
    path('contact-us/', views.contact,name='contact'),
    path('index/', views.index,name='index'),
    path('logout/', views.logging_out,name='logout'),
    path('signin/', views.sign_in ,name='signin'),
    path('products/', views.ProductList.as_view() ,name='products'),
    path('product-detail/<int:pk>/', views.ProductDetail.as_view() ,name='product-detail'),
    path('quickview/<int:pk>/', views.quickview ,name='quickview'),
    path('search/<str:phrase>/', views.searchItem ,name='search'),
    path('cartview/', views.view_cart, name='cartview'),
    path('cart/add/<int:product_id>/', views.add_to_cart ,name='cart'),
    path('cart/del/<int:product_id>/', views.delete_cart ,name='cart-delete'),
    path('cart/<int:product_id>/increment/', views.increment_cartquantity ,name='quantity-increment'),
    path('cart/<int:product_id>/decrement/', views.decrement_cartquantity ,name='quantity-decrement'),
]

