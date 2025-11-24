from django.contrib import admin
from .models import Shop, ShopFollower

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'is_verified', 'is_active', 'total_products', 'total_sold', 'created_at']
    list_filter = ['is_verified', 'is_active', 'created_at']
    search_fields = ['name', 'owner__username', 'email']
    readonly_fields = ['slug', 'total_products', 'total_sold', 'created_at', 'updated_at']

@admin.register(ShopFollower)
class ShopFollowerAdmin(admin.ModelAdmin):
    list_display = ['shop', 'user', 'created_at']
    list_filter = ['created_at']