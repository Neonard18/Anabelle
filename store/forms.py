from django.core.exceptions import ValidationError
from django import forms
from .models import User, Contact

class LoginForm(forms.Form):
    email = forms.EmailField(required=True,
                error_messages={
                    "required" : "Email is required.",
                    "invalid" : "Invalid email address."})
    
    password = forms.CharField(required=True,
                error_messages={
                    "required" : "Password is required."})

    

class RegisterForm(forms.ModelForm):
    password1 = forms.CharField(max_length = 150,
                                widget=forms.PasswordInput,
                                error_messages={
                                    "required": "Password is required."
                                })
    
    password2 = forms.CharField(max_length = 150,
                                widget=forms.PasswordInput,
                                error_messages={
                                    "required": "Password is required."
                                })
    
    class Meta:
        model = User
        fields = ['firstname', 'lastname','email','phone']
        error_messages = {
            "firstname": {
                "required": ("First Name is required.")
            },
            "lastname": {
                "required": ("Last Name is required.")
            },
            "email" : {
                "required" : ("Email is required.")
            }
        }
    
    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        print(self.cleaned_data)

        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match.")

        return password2
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        print(self.cleaned_data)

        if email and User.objects.filter(email=email).exists():
            raise ValidationError("The email already exists.")
        
        return email
    
    def save(self, commit=True):
        # create a user object, but withheld saving to db.
        user = super().save(commit=False)
        user.set_password(self.cleaned_data.get('password2'))
        if commit: 
            user.save()
        return user


class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = "__all__"