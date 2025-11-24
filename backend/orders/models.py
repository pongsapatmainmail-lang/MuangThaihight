from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()

class Order(models.Model):
    ORDER_STATUS = [
        ('pending', 'รอดำเนินการ'),
        ('confirmed', 'ยืนยันแล้ว'),
        ('processing', 'กำลังเตรียมสินค้า'),
        ('shipping', 'กำลังจัดส่ง'),
        ('delivered', 'จัดส่งแล้ว'),
        ('cancelled', 'ยกเลิก'),
    ]
    
    PAYMENT_METHOD = [
        ('cod', 'เก็บเงินปลายทาง'),
        ('bank', 'โอนเงินผ่านธนาคาร'),
        ('credit', 'บัตรเครดิต/เดบิต'),
    ]
    
    PAYMENT_STATUS = [
        ('pending', 'รอชำระเงิน'),
        ('paid', 'ชำระเงินแล้ว'),
        ('failed', 'ชำระเงินไม่สำเร็จ'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=50, unique=True)
    
    # Shipping Info
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    
    # Order Info
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Status
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.order_number}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    
    product_name = models.CharField(max_length=200)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    product_image = models.CharField(max_length=500, blank=True)
    
    # Variants (เก็บเป็น JSON string)
    variant = models.JSONField(null=True, blank=True)
    
    quantity = models.IntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.product_name} x{self.quantity}"
    
    def save(self, *args, **kwargs):
        self.subtotal = self.product_price * self.quantity
        super().save(*args, **kwargs)