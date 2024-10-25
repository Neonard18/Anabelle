from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
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
        
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    firstname = models.CharField(max_length = 150)
    lastname = models.CharField(max_length = 150)
    phone = models.IntegerField(blank=True,null=True)


    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['firstname','lastname']

    def has_perm(self, perm, obj=None) -> bool:
        if self.is_superuser: 
            return True
        return super().has_perm(perm, obj)
    
    def has_module_perms(self, app_label: str) -> bool:
        if self.is_superuser:
            return True
        return super().has_module_perms

    objects = MyUserManager()

    def __str__(self):
        return self.email
    
    @property
    def is_staff(self):
        return self.is_superuser
    

class Category(models.Model):
    categoryname = models.CharField(max_length=100,blank=False,unique=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.categoryname

def upload_path(instance, filename):
    category = instance.category
    return f'{category}/{filename}'

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="categories")
    # color = models.CharField(max_length = 150)
    size = models.IntegerField()
    productname = models.CharField(max_length = 150, blank=False, unique=True)
    price = models.FloatField()
    productimage = models.ImageField(upload_to=upload_path, height_field=None, width_field=None, max_length=100)
    description = models.TextField(max_length = 400)
    is_featured = models.BooleanField(default=False)
    

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
    

    def __str__(self):
        return self.productname
    



    
    
    
    