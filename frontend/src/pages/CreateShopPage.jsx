import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { BuildingStorefrontIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CreateShopPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: 'กรุงเทพมหานคร',
    postal_code: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/shops/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        alert('🎉 สร้างร้านค้าสำเร็จ!');
        navigate(`/seller/dashboard`);
      } else {
        const error = await response.json();
        alert('เกิดข้อผิดพลาด: ' + (error.detail || 'ไม่สามารถสร้างร้านค้าได้'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-16 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              กรุณาเข้าสู่ระบบ
            </h2>
            <p className="text-gray-500 mb-6">
              คุณต้องเข้าสู่ระบบก่อนสมัครเป็นผู้ขาย
            </p>
            <Link
              to="/login"
              className="inline-block bg-[#ee4d2d] text-white px-8 py-3 rounded-lg hover:bg-[#d73211] font-semibold"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <BuildingStorefrontIcon className="w-7 h-7" />
            สมัครเป็นผู้ขาย
          </h1>
          <p className="text-gray-600 mt-1">เริ่มต้นขายสินค้าของคุณบน Shopee วันนี้</p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-[#ee4d2d]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="w-6 h-6 text-[#ee4d2d]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">เริ่มต้นง่าย</h3>
            <p className="text-sm text-gray-600">สมัครฟรี ไม่มีค่าใช้จ่ายล่วงหน้า</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-[#ee4d2d]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="w-6 h-6 text-[#ee4d2d]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">เข้าถึงลูกค้าหลายล้านคน</h3>
            <p className="text-sm text-gray-600">ขยายฐานลูกค้าของคุณ</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-[#ee4d2d]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="w-6 h-6 text-[#ee4d2d]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">เครื่องมือครบครัน</h3>
            <p className="text-sm text-gray-600">จัดการร้านค้าได้ง่าย</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">ข้อมูลร้านค้า</h2>

                <div className="space-y-4">
                  {/* Shop Name */}
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      ชื่อร้านค้า *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                      placeholder="ชื่อร้านค้าของคุณ"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ชื่อนี้จะแสดงต่อลูกค้า
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      คำอธิบายร้านค้า
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                      placeholder="บอกเล่าเกี่ยวกับร้านค้าของคุณ..."
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        เบอร์โทรศัพท์ *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                        placeholder="08X-XXX-XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        อีเมล *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                        placeholder="shop@example.com"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      ที่อยู่ *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                      placeholder="บ้านเลขที่ ซอย ถนน แขวง/ตำบล"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        จังหวัด *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                      >
                        <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                        <option value="เชียงใหม่">เชียงใหม่</option>
                        <option value="ภูเก็ต">ภูเก็ต</option>
                        <option value="ขอนแก่น">ขอนแก่น</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        รหัสไปรษณีย์ *
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        required
                        maxLength="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                        placeholder="10XXX"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">สรุป</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      ไม่มีค่าใช้จ่ายในการสมัคร
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      เริ่มขายได้ทันทีหลังสมัคร
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      รับเงินได้ง่ายผ่านบัญชีธนาคาร
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      เครื่องมือจัดการครบครัน
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
                >
                  {loading ? 'กำลังสมัคร...' : 'สมัครเป็นผู้ขาย'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  การสมัคร ถือว่าคุณยอมรับ{' '}
                  <a href="#" className="text-[#ee4d2d] hover:underline">
                    ข้อตกลงผู้ขาย
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShopPage;