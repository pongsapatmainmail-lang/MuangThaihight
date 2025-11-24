import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  CubeIcon,
  UserGroupIcon,
  PlusIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const SellerDashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchShopData();
  }, [isAuthenticated, navigate]);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');

      // Fetch shop info
      const shopResponse = await fetch('http://localhost:8000/api/shops/my_shop/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (shopResponse.status === 404) {
        navigate('/seller/create-shop');
        return;
      }

      if (shopResponse.ok) {
        const shopData = await shopResponse.json();
        setShop(shopData);

        // Fetch stats
        const statsResponse = await fetch(`http://localhost:8000/api/shops/${shopData.slug}/stats/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statsResponse.ok) {
          setStats(await statsResponse.json());
        }

        // Fetch recent orders
        const ordersResponse = await fetch(`http://localhost:8000/api/shops/${shopData.slug}/orders/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders((ordersData.results || ordersData).slice(0, 5));
        }

        // Fetch products
        const productsResponse = await fetch(`http://localhost:8000/api/shops/${shopData.slug}/products/`);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts((productsData.results || productsData).slice(0, 5));
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return null;
  }

  const statCards = [
    {
      title: 'สินค้าทั้งหมด',
      value: stats?.total_products || 0,
      icon: CubeIcon,
      color: 'bg-blue-500',
      link: '/seller/products'
    },
    {
      title: 'คำสั่งซื้อ',
      value: stats?.total_orders || 0,
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
      link: '/seller/orders'
    },
    {
      title: 'รอดำเนินการ',
      value: stats?.pending_orders || 0,
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
      link: '/seller/orders?status=pending'
    },
    {
      title: 'ผู้ติดตาม',
      value: stats?.followers || 0,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <BuildingStorefrontIcon className="w-7 h-7" />
            ศูนย์ผู้ขาย - {shop.name}
          </h1>
          <p className="text-gray-600 mt-1">จัดการร้านค้าและสินค้าของคุณ</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.link}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">คำสั่งซื้อล่าสุด</h2>
              <Link to="/seller/orders" className="text-[#ee4d2d] text-sm hover:underline">
                ดูทั้งหมด
              </Link>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{order.order_number}</span>
                      <span className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{order.items?.length} รายการ</span>
                      <span className="font-semibold text-[#ee4d2d]">
                        ฿{parseFloat(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBagIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>ยังไม่มีคำสั่งซื้อ</p>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">สินค้าของฉัน</h2>
              <Link
                to="/seller/products/add"
                className="flex items-center gap-1 text-[#ee4d2d] text-sm hover:underline"
              >
                <PlusIcon className="w-4 h-4" />
                เพิ่มสินค้า
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex gap-3 border rounded-lg p-3 hover:bg-gray-50">
                    <img
                      src={product.image || 'https://via.placeholder.com/60'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">คงเหลือ: {product.stock}</span>
                        <span className="font-semibold text-gray-900">฿{product.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CubeIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="mb-3">ยังไม่มีสินค้า</p>
                <Link
                  to="/seller/products/add"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#ee4d2d] text-white rounded-lg hover:bg-[#d73211]"
                >
                  <PlusIcon className="w-5 h-5" />
                  เพิ่มสินค้าแรก
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/seller/products/add"
            className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-[#ee4d2d]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <PlusIcon className="w-6 h-6 text-[#ee4d2d]" />
            </div>
            <p className="font-medium text-gray-900">เพิ่มสินค้า</p>
          </Link>

          <Link
            to="/seller/orders"
            className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBagIcon className="w-6 h-6 text-blue-500" />
            </div>
            <p className="font-medium text-gray-900">จัดการคำสั่งซื้อ</p>
          </Link>

          <Link
            to="/seller/products"
            className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CubeIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="font-medium text-gray-900">จัดการสินค้า</p>
          </Link>

          <Link
            to={`/shop/${shop.slug}`}
            className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <BuildingStorefrontIcon className="w-6 h-6 text-purple-500" />
            </div>
            <p className="font-medium text-gray-900">ดูหน้าร้าน</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;