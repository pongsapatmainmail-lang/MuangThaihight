import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const SellerProductsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/products/my_products/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.results || data);
      } else if (response.status === 404) {
        // ยังไม่มีร้านค้า
        alert('กรุณาสร้างร้านค้าก่อน');
        navigate('/seller/create-shop');
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/products/${productId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('ลบสินค้าสำเร็จ');
        fetchProducts();
      } else {
        alert('ไม่สามารถลบสินค้าได้');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาด');
    }
  };

  const handleToggleStock = async (productId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/products/${productId}/toggle_stock/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filter === 'all' || 
                       (filter === 'in_stock' && product.stock > 0) ||
                       (filter === 'out_of_stock' && product.stock === 0);
    return matchSearch && matchFilter;
  });

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">จัดการสินค้า</h1>
            <p className="text-gray-600 mt-1">จัดการสินค้าทั้งหมดของคุณ</p>
          </div>
          <Link
            to="/seller/products/add"
            className="flex items-center gap-2 bg-[#ee4d2d] text-white px-6 py-3 rounded-lg hover:bg-[#d73211] font-semibold"
          >
            <PlusIcon className="w-5 h-5" />
            เพิ่มสินค้าใหม่
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm mb-1">สินค้าทั้งหมด</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm mb-1">มีสินค้า</p>
            <p className="text-3xl font-bold text-green-600">{stats.inStock}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-sm mb-1">สินค้าหมด</p>
            <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-[#ee4d2d] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ทั้งหมด ({stats.total})
              </button>
              <button
                onClick={() => setFilter('in_stock')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'in_stock'
                    ? 'bg-[#ee4d2d] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                มีสินค้า ({stats.inStock})
              </button>
              <button
                onClick={() => setFilter('out_of_stock')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'out_of_stock'
                    ? 'bg-[#ee4d2d] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                สินค้าหมด ({stats.outOfStock})
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ee4d2d] border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4">กำลังโหลด...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">สินค้า</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">หมวดหมู่</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ราคา</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">คงเหลือ</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ขายแล้ว</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">สถานะ</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || 'https://via.placeholder.com/60'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-2">{product.name}</p>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{product.category_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">฿{parseFloat(product.price).toFixed(2)}</p>
                        {product.original_price && (
                          <p className="text-sm text-gray-400 line-through">
                            ฿{parseFloat(product.original_price).toFixed(2)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${
                          product.stock > 10 ? 'text-green-600' :
                          product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{product.sold}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStock(product.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            product.stock > 0
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {product.stock > 0 ? 'เปิดขาย' : 'ปิดขาย'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="ดูสินค้า"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/seller/products/edit/${product.id}`}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="ลบ"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">ไม่พบสินค้า</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? 'ไม่พบสินค้าที่ค้นหา' : 'คุณยังไม่มีสินค้าในร้าน'}
              </p>
              {!searchQuery && (
                <Link
                  to="/seller/products/add"
                  className="inline-flex items-center gap-2 bg-[#ee4d2d] text-white px-6 py-3 rounded-lg hover:bg-[#d73211] font-semibold"
                >
                  <PlusIcon className="w-5 h-5" />
                  เพิ่มสินค้าแรก
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProductsPage;