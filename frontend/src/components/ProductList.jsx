import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // ถ้า API ยังไม่พร้อม ใช้ข้อมูลตัวอย่าง
      setProducts(dummyProducts);
    } finally {
      setLoading(false);
    }
  };

  // ข้อมูลตัวอย่างกรณี Backend ยังไม่พร้อม
  const dummyProducts = [
    {
      id: 1,
      name: 'เสื้อยืดคอกลม ผ้าคอตตอน 100% สีพื้น ใส่สบาย',
      price: 199,
      original_price: 399,
      discount_percentage: 50,
      rating: 4.8,
      sold: 1234,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'กระเป๋าสะพายข้าง หนัง PU คุณภาพดี ดีไซน์เก๋',
      price: 459,
      original_price: 899,
      discount_percentage: 49,
      rating: 4.6,
      sold: 856,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'หูฟังบลูทูธ ไร้สาย เสียงดี ใส่สบาย กันเหงื่อ',
      price: 899,
      original_price: 1990,
      discount_percentage: 55,
      rating: 4.9,
      sold: 2341,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'รองเท้าผ้าใบ สไตล์เกาหลี น้ำหนักเบา ใส่สบาย',
      price: 599,
      original_price: 1290,
      discount_percentage: 54,
      rating: 4.7,
      sold: 1567,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'เคสโทรศัพท์ ซิลิโคน กันกระแทก ลายการ์ตูนน่ารัก',
      price: 79,
      original_price: 149,
      discount_percentage: 47,
      rating: 4.5,
      sold: 3421,
      stock: 200,
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'แว่นตากันแดด UV400 กรอบทรงสวย เลนส์คุณภาพดี',
      price: 299,
      original_price: 599,
      discount_percentage: 50,
      rating: 4.6,
      sold: 987,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'กางเกงยีนส์ขายาว ทรงสลิม ผ้ายืด ใส่สบาย',
      price: 399,
      original_price: 799,
      discount_percentage: 50,
      rating: 4.8,
      sold: 1876,
      stock: 80,
      image: 'https://images.unsplash.com/photo-1542272454315-7ad1cf1aa3e3?w=300&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'นาฬิกาข้อมือ ดิจิตอล กันน้ำ สายซิลิโคน',
      price: 499,
      original_price: 999,
      discount_percentage: 50,
      rating: 4.7,
      sold: 1234,
      stock: 55,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-96 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="bg-white p-4 mb-4 flex items-center">
          <h2 className="text-[#ee4d2d] text-lg font-semibold uppercase">
            สินค้าแนะนำ
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="bg-white border border-gray-300 hover:bg-gray-50 px-16 py-3 text-gray-700">
            ดูเพิ่มเติม
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;