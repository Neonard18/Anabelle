from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from store.models import User, Category, Product, Cart, Size

class SizeInline(admin.TabularInline):
    model = Size
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    inlines = [
        SizeInline,
        ]

admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(User)
admin.site.register(Cart)

