import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';

const ProductItem = ({ id, image, name, price }) => {
  const { currency, toggleWishlist, isInWishlist, navigate, token } = useContext(ShopContext);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      navigate('/login');
      return;
    }

    setIsWishlistLoading(true);
    try {
      await toggleWishlist(id);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const isWishlisted = isInWishlist(id);

  return (
    <Link
      className="group cursor-pointer block"
      to={`/product/${id}`}
    >
      <div className="relative bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            src={image[0]}
            alt={name}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {image[1] && (
            <img
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100"
              src={image[1]}
              alt={`${name} alternate view`}
            />
          )}

          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
              isWishlisted
                ? 'bg-secondary text-white scale-100 opacity-100'
                : 'bg-white/80 hover:bg-white text-gray-700 hover:text-secondary scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
            } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={18}
              className={`${isWishlisted ? 'fill-current' : ''} transition-all duration-200`}
            />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-base font-medium text-gray-900 mb-2 tracking-wide leading-snug line-clamp-2 group-hover:text-secondary transition-colors duration-300">
            {name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {currency}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {price}
              </span>
            </div>
            
            {/* Arrow Indicator */}
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <svg
                className="w-4 h-4 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;