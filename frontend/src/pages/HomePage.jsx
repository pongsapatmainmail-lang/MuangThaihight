import Navbar from '@/components/Navbar';
import CategoryGrid from '../components/CategoryGrid.jsx';
import BannerCarousel from '../components/BannerCarousel.jsx';
import ProductList from '../components/ProductList.jsx';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Banner Section */}
      <div className="container mx-auto px-4 py-6">
        <BannerCarousel />
      </div>

      {/* Categories */}
      <CategoryGrid />

      {/* Flash Sale Section (Optional - ถ้าต้องการ) */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-[#ee4d2d] text-xl font-bold uppercase">
                ⚡ Flash Sale
              </h2>
              <div className="flex space-x-1 text-white">
                <div className="bg-black px-2 py-1 rounded text-sm font-bold">00</div>
                <span className="text-black">:</span>
                <div className="bg-black px-2 py-1 rounded text-sm font-bold">00</div>
                <span className="text-black">:</span>
                <div className="bg-black px-2 py-1 rounded text-sm font-bold">00</div>
              </div>
            </div>
            <a href="#" className="text-[#ee4d2d] hover:text-[#f05d40]">
              ดูทั้งหมด →
            </a>
          </div>
          <div className="text-center text-gray-500 py-8">
            🎉 Flash Sale เริ่มเร็วๆ นี้
          </div>
        </div>
      </div>

      {/* Mall Section */}
      <div className="container mx-auto px-4 py-2">
        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#ee4d2d] text-xl font-bold">
              🏬 SHOPEE MALL
            </h2>
            <a href="#" className="text-[#ee4d2d] hover:text-[#f05d40]">
              ดูทั้งหมด →
            </a>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-4xl">🏪</span>
                </div>
                <p className="text-xs text-gray-600">ร้านค้า {i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product List */}
      <ProductList />

      {/* Footer */}
      <footer className="bg-white mt-8 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
            <div>
              <h3 className="font-bold mb-4">ช่วยเหลือ</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#ee4d2d]">การจัดส่ง</a></li>
                <li><a href="#" className="hover:text-[#ee4d2d]">การคืนเงิน</a></li>
                <li><a href="#" className="hover:text-[#ee4d2d]">ติดต่อเรา</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">เกี่ยวกับ Shopee</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#ee4d2d]">เกี่ยวกับเรา</a></li>
                <li><a href="#" className="hover:text-[#ee4d2d]">ร่วมงาน</a></li>
                <li><a href="#" className="hover:text-[#ee4d2d]">นโยบาย</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">การชำระเงิน</h3>
              <div className="flex flex-wrap gap-2">
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">ติดตามเรา</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-[#ee4d2d]">Facebook</a></li>
                <li><a href="#" className="hover:text-[#ee4d2d]">Instagram</a></li>
                <li><a href="#" className="hover:text-[#ee4d2d]">Line</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">ดาวน์โหลดแอป</h3>
              <div className="space-y-2">
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-500 text-xs mt-8 pt-8 border-t">
            © 2024 Shopee Clone. สร้างเพื่อการเรียนรู้
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;