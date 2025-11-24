from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # แสดงเฉพาะ orders ของ user ที่ login
        return Order.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Return order detail
        order_serializer = OrderSerializer(order)
        return Response(order_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """ยกเลิกคำสั่งซื้อ"""
        order = self.get_object()
        
        if order.status in ['delivered', 'cancelled']:
            return Response(
                {'error': 'ไม่สามารถยกเลิกคำสั่งซื้อนี้ได้'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        
        return Response({'message': 'ยกเลิกคำสั่งซื้อสำเร็จ'})
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """ดูคำสั่งซื้อทั้งหมดของฉัน"""
        orders = self.get_queryset()
        page = self.paginate_queryset(orders)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)