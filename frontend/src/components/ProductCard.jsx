import { StarIcon } from '@heroicons/react/24/solid';

const ProductCard = ({ product }) => {
  const discountedPrice = product.original_price 
    ? product.price 
    : null;

  return (
    <a
      href={`/product/${product.id}`}
      className="bg-white border border-transparent hover:border-[#ee4d2d] hover:shadow-lg transition-all duration-200 group"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1">
            {product.discount_percentage}% ลด
          </div>
        )}

        {/* Shopee Favorite Badge */}
        <div className="absolute top-2 left-0 bg-[#ee4d2d] text-white text-xs px-2 py-1 font-semibold">
          Shopee ชอบ
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Product Name */}
        <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 h-10 group-hover:text-[#ee4d2d]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center space-x-2 mb-2">
          {product.original_price && (
            <span className="text-gray-400 text-xs line-through">
              ฿{product.original_price}
            </span>
          )}
          <span className="text-[#ee4d2d] text-lg font-semibold">
            ฿{product.price}
          </span>
        </div>

        {/* Rating and Sold */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span>{product.rating || '0.0'}</span>
          </div>
          <span>ขายแล้ว {product.sold || 0}</span>
        </div>

        {/* Location */}
        <div className="mt-2 text-xs text-gray-500">
          กรุงเทพมหานคร
        </div>

        {/* Free Shipping Badge */}
        {product.stock > 10 && (
          <div className="mt-2 border border-[#ee4d2d] text-[#ee4d2d] text-xs px-2 py-1 inline-block">
            ส่งฟรี
          </div>
        )}
      </div>
    </a>
  );
};

export default ProductCard;