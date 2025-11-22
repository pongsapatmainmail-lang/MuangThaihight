import { useState } from 'react';
import { ShoppingCartIcon, MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="bg-gradient-to-r from-[#ee4d2d] to-[#f05d40] sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#ee4d2d]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-white text-sm">
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-200">ช่องผู้ขาย</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-200">ดาวน์โหลดเร็วๆนี้</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-200">ติดตามเราบน</a>
            </div>
            <div className="flex space-x-4 items-center">
              <a href="#" className="hover:text-gray-200 flex items-center">
                <BellIcon className="w-4 h-4 mr-1" />
                การแจ้งเตือน
              </a>
              <a href="#" className="hover:text-gray-200">ช่วยเหลือ</a>
              <a href="#" className="hover:text-gray-200">ภาษาไทย</a>
              <a href="#" className="hover:text-gray-200">สมัครสมาชิก</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-200">เข้าสู่ระบบ</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <a href="/" className="text-white text-3xl font-bold">
              <svg viewBox="0 0 192 65" className="w-40 h-10 fill-white">
                <text x="0" y="45" className="font-bold text-5xl">Shopee</text>
              </svg>
            </a>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white rounded-sm overflow-hidden w-[600px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาสินค้า"
                className="flex-1 px-4 py-2 outline-none text-gray-700"
              />
              <button
                type="submit"
                className="bg-[#fb5533] hover:bg-[#ee4d2d] px-6 py-2 text-white"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>
            </form>
          </div>

          {/* Cart Icon */}
          <a href="/cart" className="relative text-white hover:opacity-80">
            <ShoppingCartIcon className="w-8 h-8" />
            <span className="absolute -top-2 -right-2 bg-white text-[#ee4d2d] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              0
            </span>
          </a>
        </div>

        {/* Search Keywords */}
        <div className="hidden md:flex mt-2 ml-48 space-x-3 text-white text-sm">
          <a href="#" className="hover:text-gray-200">เสื้อผ้าแฟชั่น</a>
          <a href="#" className="hover:text-gray-200">กระเป๋า</a>
          <a href="#" className="hover:text-gray-200">เครื่องสำอาง</a>
          <a href="#" className="hover:text-gray-200">โทรศัพท์</a>
          <a href="#" className="hover:text-gray-200">คอมพิวเตอร์</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;