import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

const ProductItem = ({ id, image, name, price }) => {
  const { currency, toggleWishlist, isInWishlist, navigate, token } = useContext(ShopContext);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

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
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const isWishlisted = isInWishlist(id);

  return (
    <Link
      className="group cursor-pointer block h-full"
      to={`/product/${id}`}
      aria-label={`View details for ${name}`}
    >
      <article className="relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-[3/4]">
          {!imageError ? (
            <>
              <img
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                src={image[0]}
                alt={name}
                loading="lazy"
                onError={() => setImageError(true)}
              />

              {image[1] && (
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                  src={image[1]}
                  alt={`${name} - alternate view`}
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">Image unavailable</span>
            </div>
          )}

          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 shadow-lg
              ${isWishlisted 
                ? 'bg-secondary text-white scale-100 opacity-100' 
                : 'bg-white/90 hover:bg-white text-gray-700 hover:text-secondary scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
              } 
              ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart 
              size={16} 
              className={`${isWishlisted ? 'fill-current' : ''} transition-transform duration-200`} 
              strokeWidth={2}
            />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2 tracking-wide leading-snug line-clamp-2 group-hover:text-secondary transition-colors duration-300 flex-grow min-h-[2.5rem]">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {currency}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                {price.toLocaleString()}
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-secondary" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductItem;