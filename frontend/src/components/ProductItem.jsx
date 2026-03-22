import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

// Skeleton loader exported for use in grid parents
export const ProductItemSkeleton = () => (
  <div className="rounded-xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="bg-gray-200 aspect-[3/4] w-full" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

const ProductItem = ({ id, image, name, price }) => {
  const { currency, toggleWishlist, isInWishlist, navigate } = useContext(ShopContext);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      className="group cursor-pointer block h-full"
      to={`/product/${id}`}
      aria-label={`View details for ${name}`}
    >
      <article className="relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
        {/* Image area */}
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
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
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${secondaryLoaded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}
                  src={image[1]}
                  alt={`${name} — alternate view`}
                  loading="lazy"
                  onLoad={() => setSecondaryLoaded(true)}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xl">✕</span>
              </div>
              <span className="text-gray-400 text-xs">Image unavailable</span>
            </div>
          )}

          {/* Wishlist button — always visible when wishlisted, hover-only otherwise */}
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 shadow-md
              ${isWishlisted
                ? 'bg-secondary text-white opacity-100 scale-100'
                : 'bg-white/90 text-gray-600 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 hover:text-secondary'
              }
              ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={15}
              className={isWishlisted ? 'fill-current' : ''}
              strokeWidth={2}
            />
          </button>

          {/* Bottom gradient for readability */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          <h3 className="text-sm sm:text-[0.9rem] font-medium text-gray-800 mb-2.5 leading-snug line-clamp-2 group-hover:text-secondary transition-colors duration-300 flex-grow min-h-[2.5rem]">
            {name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-400 font-medium">{currency}</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductItem;