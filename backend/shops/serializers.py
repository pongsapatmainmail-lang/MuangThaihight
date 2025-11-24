from rest_framework import serializers
from .models import Shop, ShopFollower
from products.serializers import ProductSerializer

class ShopSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    follower_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    
    class Meta:
        model = Shop
        fields = ['id', 'owner', 'owner_username', 'name', 'slug', 'description',
                  'logo', 'banner', 'phone', 'email', 'address', 'city', 
                  'postal_code', 'rating', 'total_products', 'total_sold',
                  'is_active', 'is_verified', 'follower_count', 'is_following',
                  'created_at', 'updated_at']
        read_only_fields = ['owner', 'slug', 'rating', 'total_products', 
                           'total_sold', 'is_verified', 'created_at', 'updated_at']
    
    def get_follower_count(self, obj):
        return obj.followers.count()
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ShopFollower.objects.filter(shop=obj, user=request.user).exists()
        return False
    
    def create(self, validated_data):
        request = self.context['request']
        validated_data['owner'] = request.user
        
        # Generate slug from name
        from django.utils.text import slugify
        slug = slugify(validated_data['name'])
        counter = 1
        original_slug = slug
        while Shop.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1
        validated_data['slug'] = slug
        
        # Set user as seller
        request.user.is_seller = True
        request.user.save()
        
        return super().create(validated_data)

class CreateProductSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    description = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    original_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    discount_percentage = serializers.IntegerField(default=0)
    stock = serializers.IntegerField(default=0)
    category = serializers.IntegerField()
    image = serializers.ImageField(required=False)
    
    def create(self, validated_data):
        from products.models import Product, Category
        
        shop = self.context['shop']
        category_id = validated_data.pop('category')
        category = Category.objects.get(id=category_id)
        
        product = Product.objects.create(
            shop=shop,
            category=category,
            **validated_data
        )
        
        # Update shop stats
        shop.total_products = shop.products.count()
        shop.save()
        
        return product