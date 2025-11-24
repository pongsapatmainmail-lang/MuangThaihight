import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    toggleSelectItem,
    selectAll,
    getTotal,
    getSelectedCount
  } = useCart();

  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
      navigate('/login');
      return;
    }

    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert('กรุณาเลือกสินค้าที่ต้องการสั่งซื้อ');
      return;
    }

    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-sm p-16 text-center">
            <ShoppingBagIcon className="w-32 h-32 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              ตะกร้าสินค้าว่างเปล่า
            </h2>
            <p className="text-gray-500 mb-6">
              เริ่มช้อปปิ้งและเพิ่มสินค้าลงในตะกร้ากันเถอะ!
            </p>
            <Link
              to="/"
              className="inline-block bg-[#ee4d2d] text-white px-8 py-3 rounded-lg hover:bg-[#d73211] font-semibold"
            >
              เริ่มช้อปปิ้ง
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
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            ตะกร้าสินค้า ({cartItems.length} รายการ)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => selectAll(e.target.checked)}
                  className="w-5 h-5 text-[#ee4d2d] border-gray-300 rounded focus:ring-[#ee4d2d]"
                />
                <span className="ml-3 text-gray-700 font-semibold">
                  เลือกทั้งหมด ({cartItems.length} รายการ)
                </span>
              </label>
            </div>

            {/* Cart Items List */}
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex gap-4">
                  {/* Checkbox */}
                  <div className="flex items-start pt-2">
                    <input
                      type="checkbox"
                      checked={item.selected || false}
                      onChange={() => toggleSelectItem(item.cartItemId)}
                      className="w-5 h-5 text-[#ee4d2d] border-gray-300 rounded focus:ring-[#ee4d2d]"
                    />
                  </div>

                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-gray-800 hover:text-[#ee4d2d] font-medium line-clamp-2 mb-2"
                    >
                      {item.name}
                    </Link>

                    {/* Variant */}
                    {item.variant && (
                      <div className="text-sm text-gray-500 mb-2">
                        {Object.entries(item.variant).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price & Quantity */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#ee4d2d] text-xl font-semibold">
                          ฿{item.price}
                        </span>
                        {item.original_price && (
                          <span className="text-gray-400 text-sm line-through">
                            ฿{item.original_price}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.cartItemId, parseInt(e.target.value) || 1)}
                            className="w-12 text-center border-x border-gray-300 py-1 outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-600"
                          >
                            +
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-red-500 p-2"
                          title="ลบ"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                สรุปคำสั่งซื้อ
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>สินค้าที่เลือก</span>
                  <span>{getSelectedCount()} รายการ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ยอดรวมสินค้า</span>
                  <span>฿{getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ค่าจัดส่ง</span>
                  <span className="text-green-600">ฟรี</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">ยอดรวมทั้งหมด</span>
                  <span className="text-[#ee4d2d] text-2xl font-bold">
                    ฿{getTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={getSelectedCount() === 0}
                className="w-full bg-[#ee4d2d] hover:bg-[#d73211] text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ดำเนินการสั่งซื้อ
              </button>

              <div className="mt-4 text-center">
                <Link to="/" className="text-[#ee4d2d] text-sm hover:underline">
                  ← เลือกซื้อสินค้าเพิ่ม
                </Link>
              </div>

              {/* Voucher Section */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 text-sm">คูปองส่วนลด</span>
                  <button className="text-[#ee4d2d] text-sm hover:underline">
                    เลือกคูปอง
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="ใส่รหัสคูปอง"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ee4d2d]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;