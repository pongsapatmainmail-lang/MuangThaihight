import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ClipboardDocumentListIcon, TruckIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/orders/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.results || data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'รอดำเนินการ' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'ยืนยันแล้ว' },
      processing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'กำลังเตรียมสินค้า' },
      shipping: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'กำลังจัดส่ง' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'จัดส่งแล้ว' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'ยกเลิก' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const config = {
      pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'รอชำระเงิน' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'ชำระเงินแล้ว' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'ชำระเงินไม่สำเร็จ' },
    };

    const statusConfig = config[status] || config.pending;
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
        {statusConfig.label}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const tabs = [
    { key: 'all', label: 'ทั้งหมด', count: orders.length },
    { key: 'pending', label: 'รอดำเนินการ', count: orders.filter(o => o.status === 'pending').length },
    { key: 'processing', label: 'กำลังเตรียม', count: orders.filter(o => o.status === 'processing').length },
    { key: 'shipping', label: 'กำลังจัดส่ง', count: orders.filter(o => o.status === 'shipping').length },
    { key: 'delivered', label: 'จัดส่งแล้ว', count: orders.filter(o => o.status === 'delivered').length },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-7 h-7" />
            คำสั่งซื้อของฉัน
          </h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link to="/" className="hover:text-[#ee4d2d]">หน้าแรก</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">คำสั่งซื้อของฉัน</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 whitespace-nowrap border-b-2 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-[#ee4d2d] text-[#ee4d2d]'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600">หมายเลขคำสั่งซื้อ</p>
                      <p className="font-semibold text-gray-800">{order.order_number}</p>
                    </div>
                    <div className="border-l pl-4">
                      <p className="text-sm text-gray-600">วันที่สั่งซื้อ</p>
                      <p className="font-medium text-gray-800">
                        {new Date(order.created_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPaymentStatusBadge(order.payment_status)}
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.product_image || 'https://via.placeholder.com/80'}
                          alt={item.product_name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-1">
                            {item.product_name}
                          </h3>
                          {item.variant && (
                            <p className="text-sm text-gray-500 mb-1">
                              {Object.entries(item.variant).map(([key, value]) => `${key}: ${value}`).join(', ')}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">x{item.quantity}</span>
                            <span className="font-semibold text-gray-900">
                              ฿{parseFloat(item.subtotal).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>วิธีการชำระเงิน: <span className="font-medium">{order.payment_method_display}</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">ยอดรวมทั้งหมด</p>
                      <p className="text-xl font-bold text-[#ee4d2d]">
                        ฿{parseFloat(order.total).toFixed(2)}
                      </p>
                    </div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="px-6 py-2 bg-white border-2 border-[#ee4d2d] text-[#ee4d2d] rounded-lg hover:bg-[#fff5f5] font-semibold"
                    >
                      ดูรายละเอียด
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-16 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              ไม่มีคำสั่งซื้อ
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'all' 
                ? 'คุณยังไม่มีคำสั่งซื้อ เริ่มช้อปปิ้งกันเลย!'
                : `ไม่มีคำสั่งซื้อในสถานะนี้`
              }
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-[#ee4d2d] text-white rounded-lg hover:bg-[#d73211] font-semibold"
            >
              เริ่มช้อปปิ้ง
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;