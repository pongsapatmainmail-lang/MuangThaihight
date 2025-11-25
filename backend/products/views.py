from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Search fields
    search_fields = ['name', 'description']
    
    # Filter fields
    filterset_fields = ['category', 'shop']
    
    # Ordering fields
    ordering_fields = ['price', 'sold', 'rating', 'created_at']
    ordering = ['-created_at']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_queryset(self):
        queryset = Product.objects.all()
        
        # ถ้าเป็น seller ดูเฉพาะสินค้าของตัวเอง
        if self.action in ['my_products']:
            if self.request.user.is_authenticated and hasattr(self.request.user, 'shop'):
                return queryset.filter(shop=self.request.user.shop)
            return queryset.none()
        
        # Category filter
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__id=category)
        
        # Price range filter
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Rating filter
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_products(self, request):
        """ดูสินค้าของร้านตัวเอง"""
        if not hasattr(request.user, 'shop'):
            return Response({
                'error': 'คุณยังไม่มีร้านค้า'
            }, status=status.HTTP_404_NOT_FOUND)
        
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        """สร้างสินค้าใหม่"""
        if not hasattr(self.request.user, 'shop'):
            raise ValueError('คุณต้องมีร้านค้าก่อนเพิ่มสินค้า')
        
        serializer.save(shop=self.request.user.shop)
        
        # Update shop stats
        shop = self.request.user.shop
        shop.total_products = shop.products.count()
        shop.save()
    
    def perform_update(self, serializer):
        """อัปเดตสินค้า"""
        product = self.get_object()
        
        # ตรวจสอบว่าเป็นเจ้าของหรือไม่
        if product.shop and product.shop.owner != self.request.user:
            raise ValueError('คุณไม่มีสิทธิ์แก้ไขสินค้านี้')
        
        serializer.save()
    
    def perform_destroy(self, instance):
        """ลบสินค้า"""
        if instance.shop and instance.shop.owner != self.request.user:
            raise ValueError('คุณไม่มีสิทธิ์ลบสินค้านี้')
        
        shop = instance.shop
        instance.delete()
        
        # Update shop stats
        if shop:
            shop.total_products = shop.products.count()
            shop.save()
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_stock(self, request, pk=None):
        """เปิด/ปิดการขาย"""
        product = self.get_object()
        
        if product.shop and product.shop.owner != request.user:
            return Response({
                'error': 'คุณไม่มีสิทธิ์แก้ไขสินค้านี้'
            }, status=status.HTTP_403_FORBIDDEN)
        
        product.stock = 0 if product.stock > 0 else 100
        product.save()
        
        return Response({
            'message': 'อัปเดตสถานะสินค้าสำเร็จ',
            'stock': product.stock
        })