from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Shop(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='shop')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    
    # Shop Info
    logo = models.ImageField(upload_to='shops/logos/', null=True, blank=True)
    banner = models.ImageField(upload_to='shops/banners/', null=True, blank=True)
    
    # Contact
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    
    # Address
    address = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    
    # Stats
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_products = models.IntegerField(default=0)
    total_sold = models.IntegerField(default=0)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-created_at']

class ShopFollower(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='followers')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_shops')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['shop', 'user']
    
    def __str__(self):
        return f"{self.user.username} follows {self.shop.name}"