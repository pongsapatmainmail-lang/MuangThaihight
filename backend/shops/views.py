from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Shop, ShopFollower
from .serializers import ShopSerializer, CreateProductSerializer
from products.models import Product
from products.serializers import ProductSerializer
from orders.models import Order
from orders.serializers import OrderSerializer

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.filter(is_active=True)
    serializer_class = ShopSerializer
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_queryset(self):
        queryset = Shop.objects.filter(is_active=True)
        
        # Filter by owner for my-shop action
        if self.action == 'my_shop':
            return queryset.filter(owner=self.request.user)
        
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_shop(self, request):
        """ดูร้านค้าของตัวเอง"""
        try:
            shop = Shop.objects.get(owner=request.user)
            serializer = self.get_serializer(shop)
            return Response(serializer.data)
        except Shop.DoesNotExist:
            return Response({'error': 'คุณยังไม่มีร้านค้า'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """ดูสินค้าทั้งหมดของร้าน"""
        shop = self.get_object()
        products = Product.objects.filter(shop=shop)
        
        # Pagination
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_product(self, request, slug=None):
        """เพิ่มสินค้าใหม่"""
        shop = self.get_object()
        
        # Check if user is shop owner
        if shop.owner != request.user:
            return Response({'error': 'คุณไม่มีสิทธิ์เพิ่มสินค้าในร้านนี้'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        serializer = CreateProductSerializer(data=request.data, context={'shop': shop})
        if serializer.is_valid():
            product = serializer.save()
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def orders(self, request, slug=None):
        """ดูคำสั่งซื้อทั้งหมดของร้าน"""
        shop = self.get_object()
        
        # Check if user is shop owner
        if shop.owner != request.user:
            return Response({'error': 'คุณไม่มีสิทธิ์ดูข้อมูลนี้'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        # Get orders that contain products from this shop
        orders = Order.objects.filter(items__product__shop=shop).distinct()
        
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = OrderSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def follow(self, request, slug=None):
        """ติดตามร้านค้า"""
        shop = self.get_object()
        
        follower, created = ShopFollower.objects.get_or_create(
            shop=shop,
            user=request.user
        )
        
        if created:
            return Response({'message': 'ติดตามร้านค้าสำเร็จ'})
        return Response({'message': 'คุณติดตามร้านนี้อยู่แล้ว'})
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unfollow(self, request, slug=None):
        """เลิกติดตามร้านค้า"""
        shop = self.get_object()
        
        try:
            follower = ShopFollower.objects.get(shop=shop, user=request.user)
            follower.delete()
            return Response({'message': 'เลิกติดตามร้านค้าสำเร็จ'})
        except ShopFollower.DoesNotExist:
            return Response({'error': 'คุณไม่ได้ติดตามร้านนี้'}, 
                          status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, slug=None):
        """สถิติร้านค้า"""
        shop = self.get_object()
        
        # Check if user is shop owner
        if shop.owner != request.user:
            return Response({'error': 'คุณไม่มีสิทธิ์ดูข้อมูลนี้'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        stats = {
            'total_products': shop.products.count(),
            'total_orders': Order.objects.filter(items__product__shop=shop).distinct().count(),
            'total_revenue': sum(order.total for order in Order.objects.filter(
                items__product__shop=shop, 
                status='delivered'
            ).distinct()),
            'pending_orders': Order.objects.filter(
                items__product__shop=shop, 
                status__in=['pending', 'confirmed']
            ).distinct().count(),
            'followers': shop.followers.count(),
        }
        
        return Response(stats)