import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StarIcon, HeartIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(dummyProduct);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/');
      setRelatedProducts(response.data.slice(0, 6));
    } catch (error) {
      setRelatedProducts(dummyRelatedProducts);
    }
  };

  const dummyProduct = {
    id: 1,
    name: 'เสื้อยืดคอกลม ผ้าคอตตอน 100% สีพื้น ใส่สบาย คุณภาพดี',
    price: 199,
    original_price: 399,
    discount_percentage: 50,
    rating: 4.8,
    sold: 1234,
    stock: 50,
    description: 'เสื้อยืดคอกลมผ้าคอตตอน 100% เนื้อผ้านุ่ม ใส่สบาย ระบายอากาศได้ดี ไม่อับชื้น เหมาะสำหรับการใส่ในชีวิตประจำวัน มีหลายสีให้เลือก',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
    ],
    variants: [
      { name: 'สี', options: ['ดำ', 'ขาว', 'เทา', 'น้ำเงิน', 'แดง'] },
      { name: 'ไซส์', options: ['S', 'M', 'L', 'XL', 'XXL'] }
    ],
    specifications: [
      { label: 'วัสดุ', value: 'คอตตอน 100%' },
      { label: 'แบรนด์', value: 'No Brand' },
      { label: 'จัดส่งจาก', value: 'กรุงเทพมหานคร' },
      { label: 'น้ำหนัก', value: '200g' }
    ]
  };

  const dummyRelatedProducts = [
    {
      id: 2,
      name: 'เสื้อโปโล ผ้าดี ใส่สบาย',
      price: 299,
      original_price: 599,
      discount_percentage: 50,
      rating: 4.7,
      sold: 856,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300'
    },
    {
      id: 3,
      name: 'เสื้อเชิ้ต แขนยาว ทรงสวย',
      price: 399,
      original_price: 799,
      discount_percentage: 50,
      rating: 4.6,
      sold: 654,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300'
    },
  ];

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 w-3/4"></div>
                <div className="bg-gray-200 h-12 w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    console.log('=== Add to Cart Debug ===');
    console.log('Product:', product);
    console.log('Quantity:', quantity);
    console.log('Variant:', selectedVariant);
    
    addToCart(product, quantity, selectedVariant);
    
    alert(`เพิ่ม "${product.name}" (${quantity} ชิ้น) ลงตะกร้าแล้ว!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="bg-white py-3 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#ee4d2d]">Shopee</Link>
            <span>/</span>
            <Link to="/" className="hover:text-[#ee4d2d]">เสื้อผ้าแฟชั่น</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name.substring(0, 30)}...</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                />
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-[#ee4d2d]' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 border border-[#ee4d2d] text-[#ee4d2d] py-3 rounded-lg hover:bg-[#fff5f5] flex items-center justify-center gap-2">
                  <HeartIcon className="w-5 h-5" />
                  ถูกใจ
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  แชร์
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-block bg-[#ee4d2d] text-white text-xs px-3 py-1 rounded">
                สินค้าขายดี
              </div>

              <h1 className="text-2xl font-normal text-gray-900">{product.name}</h1>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-[#ee4d2d]">
                    <span className="text-lg font-semibold mr-1">{product.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIconSolid
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'text-[#ee4d2d]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-l pl-6">
                  <span className="text-gray-600">{product.sold} ขายแล้ว</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-4">
                  {product.original_price && (
                    <span className="text-gray-400 text-lg line-through">
                      ฿{product.original_price}
                    </span>
                  )}
                  <span className="text-[#ee4d2d] text-4xl font-semibold">
                    ฿{product.price}
                  </span>
                  {product.discount_percentage > 0 && (
                    <span className="bg-[#ee4d2d] text-white px-2 py-1 rounded text-sm font-bold">
                      -{product.discount_percentage}%
                    </span>
                  )}
                </div>
              </div>

              {product.variants?.map((variant, idx) => (
                <div key={idx}>
                  <label className="block text-gray-700 mb-2">{variant.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedVariant({ ...selectedVariant, [variant.name]: option })}
                        className={`px-4 py-2 border rounded-lg hover:border-[#ee4d2d] ${
                          selectedVariant?.[variant.name] === option
                            ? 'border-[#ee4d2d] text-[#ee4d2d]'
                            : 'border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-gray-700 mb-2">จำนวน</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x border-gray-300 py-2 outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600">มีสินค้า {product.stock} ชิ้น</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-[#ee4d2d] text-[#ee4d2d] py-3 rounded-lg hover:bg-[#fff5f5] flex items-center justify-center gap-2 font-semibold"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  เพิ่มลงตะกร้า
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#ee4d2d] text-white py-3 rounded-lg hover:bg-[#d73211] font-semibold"
                >
                  ซื้อเลย
                </button>
              </div>

              <div className="border-t pt-4 mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <TruckIcon className="w-5 h-5 text-gray-400" />
                  <span>ฟรีค่าจัดส่ง สำหรับคำสั่งซื้อเกิน ฿200</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                  <span>รับประกันความเสียหายระหว่างขนส่ง</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t">
            <div className="flex space-x-8 border-b">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-2 border-b-2 ${
                  activeTab === 'description'
                    ? 'border-[#ee4d2d] text-[#ee4d2d]'
                    : 'border-transparent text-gray-600'
                }`}
              >
                รายละเอียดสินค้า
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`py-4 px-2 border-b-2 ${
                  activeTab === 'specifications'
                    ? 'border-[#ee4d2d] text-[#ee4d2d]'
                    : 'border-transparent text-gray-600'
                }`}
              >
                คุณลักษณะ
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-2 border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-[#ee4d2d] text-[#ee4d2d]'
                    : 'border-transparent text-gray-600'
                }`}
              >
                รีวิวสินค้า
              </button>
            </div>

            <div className="py-6">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <table className="w-full">
                  <tbody>
                    {product.specifications?.map((spec, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-3 text-gray-600 w-1/3">{spec.label}</td>
                        <td className="py-3 text-gray-900">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-8 text-gray-500">
                  ยังไม่มีรีวิว
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;