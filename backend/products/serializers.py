from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    shop_name = serializers.CharField(source='shop.name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'original_price', 
            'discount_percentage', 'stock', 'sold', 'rating', 'image',
            'category', 'category_name', 'shop', 'shop_name', 'created_at'
        ]
        read_only_fields = ['sold', 'rating', 'shop', 'created_at']
    
    def validate_price(self, value):
        """ตรวจสอบราคา"""
        if value <= 0:
            raise serializers.ValidationError("ราคาต้องมากกว่า 0")
        return value
    
    def validate_stock(self, value):
        """ตรวจสอบสต็อก"""
        if value < 0:
            raise serializers.ValidationError("จำนวนสต็อกต้องไม่ติดลบ")
        return value
    
    def validate(self, data):
        """ตรวจสอบข้อมูลทั้งหมด"""
        # ตรวจสอบราคาเดิมต้องมากกว่าราคาปัจจุบัน
        if data.get('original_price') and data.get('price'):
            if data['original_price'] < data['price']:
                raise serializers.ValidationError({
                    'original_price': 'ราคาเดิมต้องมากกว่าหรือเท่ากับราคาปัจจุบัน'
                })
        
        return data