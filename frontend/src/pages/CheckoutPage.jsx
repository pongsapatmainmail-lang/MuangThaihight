import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { TruckIcon, CreditCardIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.first_name && user?.last_name 
      ? `${user.first_name} ${user.last_name}` 
      : '',
    phone: user?.phone || '',
    address: '',
    city: 'กรุงเทพมหานคร',
    district: '',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = getTotal();
  const shippingFee = subtotal >= 200 ? 0 : 30;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.district || !shippingInfo.postalCode) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      // สร้าง order data
      const orderData = {
        full_name: shippingInfo.fullName,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        district: shippingInfo.district,
        postal_code: shippingInfo.postalCode,
        payment_method: paymentMethod,
        items: selectedItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          variant: item.variant
        }))
      };

      console.log('Sending order data:', orderData);

      const response = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        alert(`สั่งซื้อสำเร็จ! 🎉\n\nเลขที่คำสั่งซื้อ: ${result.order_number}\nยอดรวม: ฿${result.total}`);
        clearCart();
        navigate('/');
      } else {
        console.error('Error response:', result);
        alert('เกิดข้อผิดพลาด: ' + (result.detail || result.error || 'ไม่สามารถสั่งซื้อได้'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              กรุณาเข้าสู่ระบบ
            </h2>
            <p className="text-gray-500 mb-6">
              คุณต้องเข้าสู่ระบบก่อนทำการสั่งซื้อ
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

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              ไม่มีสินค้าในการสั่งซื้อ
            </h2>
            <p className="text-gray-500 mb-6">
              กรุณาเลือกสินค้าในตะกร้าก่อนทำการสั่งซื้อ
            </p>
            <Link
              to="/cart"
              className="inline-block bg-[#ee4d2d] text-white px-8 py-3 rounded-lg hover:bg-[#d73211] font-semibold"
            >
              กลับไปที่ตะกร้า
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
          <h1 className="text-2xl font-semibold text-gray-800">ชำระเงิน</h1>
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <Link to="/" className="hover:text-[#ee4d2d]">หน้าแรก</Link>
            <span className="mx-2">/</span>
            <Link to="/cart" className="hover:text-[#ee4d2d]">ตะกร้าสินค้า</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">ชำระเงิน</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <MapPinIcon className="w-6 h-6 text-[#ee4d2d] mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">ที่อยู่จัดส่ง</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        ชื่อ-นามสกุล *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                        placeholder="ชื่อ-นามสกุล"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        เบอร์โทรศัพท์ *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                        placeholder="08X-XXX-XXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      ที่อยู่ *
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                      placeholder="บ้านเลขที่ ซอย ถนน"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        จังหวัด *
                      </label>
                      <select
                        name="city"
                        value={shippingInfo.city}
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
                        เขต/อำเภอ *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={shippingInfo.district}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                        placeholder="เขต/อำเภอ"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        รหัสไปรษณีย์ *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingInfo.postalCode}
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

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <TruckIcon className="w-6 h-6 text-[#ee4d2d] mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">วิธีจัดส่ง</h2>
                </div>

                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked
                        readOnly
                        className="w-4 h-4 text-[#ee4d2d]"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-800">การจัดส่งมาตรฐาน</p>
                        <p className="text-sm text-gray-600">ได้รับภายใน 3-5 วันทำการ</p>
                      </div>
                    </div>
                    <span className="text-gray-900 font-semibold">
                      {shippingFee === 0 ? 'ฟรี' : `฿${shippingFee}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <CreditCardIcon className="w-6 h-6 text-[#ee4d2d] mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">วิธีการชำระเงิน</h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#ee4d2d]">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#ee4d2d]"
                    />
                    <span className="ml-3 font-semibold text-gray-800">เก็บเงินปลายทาง (COD)</span>
                  </label>

                  <label className="flex items-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#ee4d2d]">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#ee4d2d]"
                    />
                    <span className="ml-3 font-semibold text-gray-800">โอนเงินผ่านธนาคาร</span>
                  </label>

                  <label className="flex items-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#ee4d2d]">
                    <input
                      type="radio"
                      name="payment"
                      value="credit"
                      checked={paymentMethod === 'credit'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#ee4d2d]"
                    />
                    <span className="ml-3 font-semibold text-gray-800">บัตรเครดิต/เดบิต</span>
                  </label>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  สินค้าที่สั่งซื้อ ({selectedItems.length} รายการ)
                </h2>

                <div className="space-y-4">
                  {selectedItems.map((item) => (
                    <div key={item.cartItemId} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-medium line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-sm text-gray-500 mb-1">
                            {Object.entries(item.variant).map(([key, value]) => `${key}: ${value}`).join(', ')}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">x{item.quantity}</span>
                          <span className="text-[#ee4d2d] font-semibold">
                            ฿{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">สรุปคำสั่งซื้อ</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>ยอดรวมสินค้า</span>
                    <span>฿{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>ค่าจัดส่ง</span>
                    <span className={shippingFee === 0 ? 'text-green-600' : ''}>
                      {shippingFee === 0 ? 'ฟรี' : `฿${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>ส่วนลด</span>
                      <span>-฿{discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">ยอดรวมทั้งหมด</span>
                    <span className="text-[#ee4d2d] text-2xl font-bold">
                      ฿{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
                </button>

                <div className="mt-4 flex items-start text-sm text-gray-600">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    คำสั่งซื้อของคุณจะได้รับการคุ้มครองโดย Shopee Guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;