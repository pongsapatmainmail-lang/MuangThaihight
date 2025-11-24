import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('min_price') || '',
    maxPrice: searchParams.get('max_price') || '',
    minRating: searchParams.get('min_rating') || '',
    sortBy: searchParams.get('ordering') || '-created_at'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.minRating) params.append('min_rating', filters.minRating);
      if (filters.sortBy) params.append('ordering', filters.sortBy);

      const response = await axios.get(`http://localhost:8000/api/products/?${params}`);
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key === 'search' ? 'q' : key === 'sortBy' ? 'ordering' : key, value);
    } else {
      params.delete(key === 'search' ? 'q' : key === 'sortBy' ? 'ordering' : key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sortBy: '-created_at'
    });
    setSearchParams({});
  };

  const sortOptions = [
    { value: '-created_at', label: 'ใหม่ล่าสุด' },
    { value: 'price', label: 'ราคา: ต่ำไปสูง' },
    { value: '-price', label: 'ราคา: สูงไปต่ำ' },
    { value: '-sold', label: 'ยอดขายสูงสุด' },
    { value: '-rating', label: 'คะแนนสูงสุด' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <Link to="/" className="hover:text-[#ee4d2d]">หน้าแรก</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">
            {filters.search ? `ค้นหา: "${filters.search}"` : 'สินค้าทั้งหมด'}
          </span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {filters.search ? `ผลการค้นหา "${filters.search}"` : 'สินค้าทั้งหมด'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                พบ {products.length} รายการ
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="w-5 h-5" />
              ตัวกรอง
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  ตัวกรอง
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#ee4d2d] hover:underline"
                >
                  ล้างทั้งหมด
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">หมวดหมู่</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={!filters.category}
                      onChange={() => handleFilterChange('category', '')}
                      className="w-4 h-4 text-[#ee4d2d]"
                    />
                    <span className="ml-2 text-gray-700">ทั้งหมด</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        checked={filters.category === String(cat.id)}
                        onChange={() => handleFilterChange('category', String(cat.id))}
                        className="w-4 h-4 text-[#ee4d2d]"
                      />
                      <span className="ml-2 text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">ช่วงราคา</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="฿ ต่ำสุด"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="฿ สูงสุด"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ee4d2d]"
                    />
                  </div>

                  {/* Quick Price Ranges */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleFilterChange('minPrice', '0');
                        handleFilterChange('maxPrice', '100');
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    >
                      ฿0 - ฿100
                    </button>
                    <button
                      onClick={() => {
                        handleFilterChange('minPrice', '100');
                        handleFilterChange('maxPrice', '500');
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    >
                      ฿100 - ฿500
                    </button>
                    <button
                      onClick={() => {
                        handleFilterChange('minPrice', '500');
                        handleFilterChange('maxPrice', '1000');
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    >
                      ฿500 - ฿1,000
                    </button>
                    <button
                      onClick={() => {
                        handleFilterChange('minPrice', '1000');
                        handleFilterChange('maxPrice', '');
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                    >
                      ฿1,000+
                    </button>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">คะแนน</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        checked={filters.minRating === String(rating)}
                        onChange={() => handleFilterChange('minRating', String(rating))}
                        className="w-4 h-4 text-[#ee4d2d]"
                      />
                      <div className="ml-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                        <span className="ml-1 text-sm text-gray-600">ขึ้นไป</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">เรียงตาม:</span>
                <div className="flex gap-2 overflow-x-auto">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange('sortBy', option.value)}
                      className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                        filters.sortBy === option.value
                          ? 'bg-[#ee4d2d] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg h-80 animate-pulse"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-16 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  ไม่พบสินค้าที่ค้นหา
                </h3>
                <p className="text-gray-500 mb-4">
                  ลองเปลี่ยนคำค้นหาหรือตัวกรองอื่นๆ
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-[#ee4d2d] text-white rounded-lg hover:bg-[#d73211]"
                >
                  ล้างตัวกรอง
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;