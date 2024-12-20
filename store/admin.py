from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from store.models import User, Category, Product, Cart

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(User)
admin.site.register(Cart)


# class UserCreationForm(forms.ModelForm):
#     password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
#     password2 = forms.CharField(label="Password confirmation", widget=forms.PasswordInput)


#     class Meta:
#         model = User
#         fields = ['email','firstname','lastname','phone']

#     def clean_password2(self):
#         password1 = self.cleaned_data.get("password1")
#         password2 = self.cleaned_data.get("password2")
#         if password1 and password2 and password1 != password2:
#             raise ValidationError("Passwords don't match")
#         return password2       
         
#     def save(self, commit=True):
#         user=super.save(commit=False)
#         user.set_password(self.cleaned_data['password1'])
#         if commit:
#             user.save()
#         return user
