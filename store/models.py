from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.
class MyUserManager(BaseUserManager):
    def create_user(self, email, firstname,lastname,password=None,**kwargs):
        if not email:
            raise ValueError("Users must have an email address")
        
        user = self.model(
            email = self.normalize_email(email),
            firstname = firstname,
            lastname=lastname,
            **kwargs
        )

        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, firstname,lastname,password=None,**kwargs):
        user = self.create_user(
            email,
            firstname,
            lastname,
            password=password,
            **kwargs
            )
        
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True)
    firstname = models.CharField(max_length = 150)
    lastname = models.CharField(max_length = 150)
    phone = models.IntegerField(blank=True,null=True)
    

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['firstname','lastname']

    objects = MyUserManager()

    def __str__(self):
        return self.email
    
    def has_perm(self, perm, obj=None):
        return True
    
    def has_module_perms(self, app_label):
        return True
    
    @property
    def is_staff(self):
        return self.is_admin