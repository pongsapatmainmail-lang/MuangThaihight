import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#ee4d2d] to-[#f05d40] sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#ee4d2d]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-white text-sm">
            <div className="flex space-x-4">
              <Link to="/seller/dashboard" className="hover:text-gray-200">
                ช่องผู้ขาย
              </Link>
              <span>|</span>
              <a href="#" className="hover:text-gray-200">ดาวน์โหลด</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-200">ติดตามเราบน</a>
            </div>
            <div className="flex space-x-4 items-center">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                    className="flex items-center space-x-2 hover:text-gray-200"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{user?.username}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 text-gray-700 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      {/* Menu Items */}
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4" />
                          <span>บัญชีของฉัน</span>
                        </div>
                      </Link>

                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <ShoppingCartIcon className="w-4 h-4" />
                          <span>คำสั่งซื้อของฉัน</span>
                        </div>
                      </Link>

                      {/* Seller Section */}
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      {user?.is_seller ? (
                        <>
                          <Link 
                            to="/seller/dashboard" 
                            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span className="font-medium">ศูนย์ผู้ขาย</span>
                            </div>
                          </Link>
                          <Link 
                            to="/seller/products" 
                            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2 pl-6">
                              <span className="text-sm">จัดการสินค้า</span>
                            </div>
                          </Link>
                          <Link 
                            to="/seller/orders" 
                            className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2 pl-6">
                              <span className="text-sm">คำสั่งซื้อที่เข้ามา</span>
                            </div>
                          </Link>
                        </>
                      ) : (
                        <Link 
                          to="/seller/create-shop" 
                          className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-[#ee4d2d] font-medium">สมัครเป็นผู้ขาย</span>
                          </div>
                        </Link>
                      )}

                      {/* Logout */}
                      <div className="border-t border-gray-100 my-2"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>ออกจากระบบ</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/register" className="hover:text-gray-200">สมัครสมาชิก</Link>
                  <span>|</span>
                  <Link to="/login" className="hover:text-gray-200">เข้าสู่ระบบ</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-white text-3xl font-bold hover:opacity-90 transition-opacity">
              Shopee
            </Link>

            <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white rounded-sm overflow-hidden w-[600px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาสินค้า"
                className="flex-1 px-4 py-2 outline-none text-gray-700"
              />
              <button type="submit" className="bg-[#fb5533] hover:bg-[#ee4d2d] px-6 py-2 text-white transition-colors">
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>
            </form>
          </div>

          <Link to="/cart" className="relative text-white hover:opacity-80 transition-opacity">
            <ShoppingCartIcon className="w-8 h-8" />
            {getItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#ee4d2d] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {getItemCount()}
              </span>
            )}
          </Link>
        </div>

        {/* Search Keywords */}
        <div className="hidden md:flex mt-2 ml-48 space-x-3 text-white text-sm">
          <Link to="/search?q=เสื้อผ้า" className="hover:text-gray-200">เสื้อผ้าแฟชั่น</Link>
          <Link to="/search?q=กระเป๋า" className="hover:text-gray-200">กระเป๋า</Link>
          <Link to="/search?q=เครื่องสำอาง" className="hover:text-gray-200">เครื่องสำอาง</Link>
          <Link to="/search?q=โทรศัพท์" className="hover:text-gray-200">โทรศัพท์</Link>
          <Link to="/search?q=คอมพิวเตอร์" className="hover:text-gray-200">คอมพิวเตอร์</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;