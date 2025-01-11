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
    

class Size(models.Model):
    size = models.IntegerField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="sizes")

    def __str__(self):
        return str(self.size)

    class Meta:
        verbose_name = "Size"
        verbose_name_plural = "Sizes"
    
class Cart(models.Model):
    created_at = models.DateField(auto_now_add=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")
    

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def total_price(self):
        return self.product.price * self.quantity

    def __str__(self) -> str:
        return f'item: {self.product.productname} {self.id}'
    
class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    number = models.IntegerField()
    comment = models.CharField(max_length=400, blank=True)
    