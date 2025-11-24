import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { 
  TruckIcon, 
  MapPinIcon, 
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrderDetail();
  }, [id, isAuthenticated, navigate]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/orders/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        console.error('Failed to fetch order detail');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกคำสั่งซื้อนี้?')) {
      return;
    }

    setCancelling(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/orders/${id}/cancel/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('ยกเลิกคำสั่งซื้อสำเร็จ');
        fetchOrderDetail();
      } else {
        const error = await response.json();
        alert('ไม่สามารถยกเลิกคำสั่งซื้อได้: ' + (error.error || 'กรุณาลองใหม่อีกครั้ง'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาด');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { key: 'pending', label: 'รอดำเนินการ', icon: ClockIcon },
      { key: 'confirmed', label: 'ยืนยันแล้ว', icon: CheckCircleIcon },
      { key: 'processing', label: 'เตรียมสินค้า', icon: CheckCircleIcon },
      { key: 'shipping', label: 'กำลังจัดส่ง', icon: TruckIcon },
      { key: 'delivered', label: 'จัดส่งแล้ว', icon: CheckCircleIcon },
    ];

    const statusOrder = ['pending', 'confirmed', 'processing', 'shipping', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      active: index <= currentIndex,
      current: statusOrder[index] === currentStatus
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusSteps = getStatusSteps(order.status);
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <Link to="/" className="hover:text-[#ee4d2d]">หน้าแรก</Link>
          <span className="mx-2">/</span>
          <Link to="/orders" className="hover:text-[#ee4d2d]">คำสั่งซื้อของฉัน</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{order.order_number}</span>
        </div>

        {/* Order Status Timeline */}
        {order.status !== 'cancelled' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between relative">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 relative">
                    {index < statusSteps.length - 1 && (
                      <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                        step.active ? 'bg-green-500' : 'bg-gray-300'
                      }`} style={{ zIndex: 0 }}></div>
                    )}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${
                      step.current 
                        ? 'bg-[#ee4d2d] text-white' 
                        : step.active 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className={`mt-2 text-sm font-medium ${
                      step.active ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled Status */}
        {order.status === 'cancelled' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 flex items-center gap-4">
            <XCircleIcon className="w-12 h-12 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-red-700">คำสั่งซื้อถูกยกเลิก</h3>
              <p className="text-red-600">คำสั่งซื้อนี้ถูกยกเลิกแล้ว</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                สินค้าที่สั่งซื้อ ({order.items?.length} รายการ)
              </h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.product_image || 'https://via.placeholder.com/100'}
                      alt={item.product_name}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">
                        {item.product_name}
                      </h3>
                      {item.variant && (
                        <p className="text-sm text-gray-500 mb-2">
                          {Object.entries(item.variant).map(([key, value]) => `${key}: ${value}`).join(', ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">x{item.quantity}</span>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">฿{parseFloat(item.product_price).toFixed(2)}</p>
                          <p className="font-semibold text-gray-900">
                            ฿{parseFloat(item.subtotal).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <MapPinIcon className="w-6 h-6 text-[#ee4d2d] mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">ที่อยู่จัดส่ง</h2>
              </div>
              <div className="space-y-1 text-gray-700">
                <p className="font-semibold">{order.full_name}</p>
                <p>{order.phone}</p>
                <p>{order.address}</p>
                <p>{order.district}, {order.city} {order.postal_code}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">สรุปคำสั่งซื้อ</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>หมายเลขคำสั่งซื้อ</span>
                  <span className="font-medium text-gray-900">{order.order_number}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>วันที่สั่งซื้อ</span>
                  <span className="font-medium text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('th-TH')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>สถานะ</span>
                  <span className="font-medium text-gray-900">{order.status_display}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>ยอดรวมสินค้า</span>
                  <span>฿{parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ค่าจัดส่ง</span>
                  <span>{parseFloat(order.shipping_fee) === 0 ? 'ฟรี' : `฿${parseFloat(order.shipping_fee).toFixed(2)}`}</span>
                </div>
                {parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>ส่วนลด</span>
                    <span>-฿{parseFloat(order.discount).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">ยอดรวมทั้งหมด</span>
                  <span className="text-[#ee4d2d] text-2xl font-bold">
                    ฿{parseFloat(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <CreditCardIcon className="w-6 h-6 text-[#ee4d2d] mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">การชำระเงิน</h2>
              </div>
              <div className="space-y-2 text-gray-700">
                <p>
                  <span className="text-gray-600">วิธีการชำระเงิน:</span>{' '}
                  <span className="font-medium">{order.payment_method_display}</span>
                </p>
                <p>
                  <span className="text-gray-600">สถานะการชำระเงิน:</span>{' '}
                  <span className="font-medium">{order.payment_status_display}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="w-full py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-semibold disabled:opacity-50"
              >
                {cancelling ? 'กำลังยกเลิก...' : 'ยกเลิกคำสั่งซื้อ'}
              </button>
            )}

            <Link
              to="/orders"
              className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold text-center"
            >
              กลับไปคำสั่งซื้อทั้งหมด
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;