from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_price', 
                  'product_image', 'variant', 'quantity', 'subtotal']
        read_only_fields = ['subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'order_number', 'full_name', 'phone', 'address', 
                  'city', 'district', 'postal_code', 'subtotal', 'shipping_fee', 
                  'discount', 'total', 'status', 'status_display', 
                  'payment_method', 'payment_method_display', 
                  'payment_status', 'payment_status_display', 
                  'items', 'created_at', 'updated_at']
        read_only_fields = ['order_number', 'created_at', 'updated_at']

class CreateOrderSerializer(serializers.Serializer):
    # Shipping Info
    full_name = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    district = serializers.CharField(max_length=100)
    postal_code = serializers.CharField(max_length=10)
    
    # Payment
    payment_method = serializers.ChoiceField(choices=['cod', 'bank', 'credit'])
    
    # Items
    items = serializers.ListField(
        child=serializers.DictField()
    )
    
    def validate_items(self, value):
        if not value or len(value) == 0:
            raise serializers.ValidationError("ต้องมีสินค้าอย่างน้อย 1 รายการ")
        return value
    
    def create(self, validated_data):
        from products.models import Product
        import uuid
        
        user = self.context['request'].user
        items_data = validated_data.pop('items')
        
        # Calculate totals
        subtotal = 0
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            item_subtotal = product.price * item_data['quantity']
            subtotal += item_subtotal
        
        shipping_fee = 0 if subtotal >= 200 else 30
        discount = 0
        total = subtotal + shipping_fee - discount
        
        # Generate order number
        order_number = f"ORD{uuid.uuid4().hex[:8].upper()}"
        
        # Create order
        order = Order.objects.create(
            user=user,
            order_number=order_number,
            full_name=validated_data['full_name'],
            phone=validated_data['phone'],
            address=validated_data['address'],
            city=validated_data['city'],
            district=validated_data['district'],
            postal_code=validated_data['postal_code'],
            subtotal=subtotal,
            shipping_fee=shipping_fee,
            discount=discount,
            total=total,
            payment_method=validated_data['payment_method'],
            payment_status='pending' if validated_data['payment_method'] != 'cod' else 'pending'
        )
        
        # Create order items
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_price=product.price,
                product_image=product.image.url if product.image else '',
                variant=item_data.get('variant'),
                quantity=item_data['quantity']
            )
        
        return order