import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ProgressiveImage from './ProgressiveImage';

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
  const { currency, toggleWishlist, isInWishlist } = useContext(ShopContext) ?? {};
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [showAlt, setShowAlt] = useState(false);

  const isWishlisted = isInWishlist(id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlistLoading) return;
    setIsWishlistLoading(true);
    try { await toggleWishlist(id); }
    finally { setIsWishlistLoading(false); }
  };

  return (
    <Link to={`/product/${id}`} className="group cursor-pointer block h-full" aria-label={`View ${name}`}>
      <article className="product-card relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl h-full flex flex-col">

        {/* Image */}
        <div
          className="relative overflow-hidden bg-[#f5f2ef] aspect-[3/4]"
          onMouseEnter={() => image?.[1] && setShowAlt(true)}
          onMouseLeave={() => setShowAlt(false)}
        >
          {/* Primary */}
          <div className={`absolute inset-0 transition-opacity duration-600 ${showAlt ? 'opacity-0' : 'opacity-100'}`}>
            <ProgressiveImage
              src={image?.[0]}
              alt={name}
              width={600}
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              fetchpriority="auto"
            />
          </div>

          {/* Alternate view */}
          {image?.[1] && (
            <div className={`absolute inset-0 transition-opacity duration-600 ${showAlt ? 'opacity-100' : 'opacity-0'}`}>
              <ProgressiveImage
                src={image[1]}
                alt={`${name} — alternate view`}
                width={600}
                className="object-cover object-top"
                loading="lazy"
              />
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 shadow-md
              ${isWishlisted
                ? 'bg-[#4F200D] text-white opacity-100 scale-100'
                : 'bg-white/90 text-gray-500 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 hover:text-[#4F200D]'
              }
              ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} className={isWishlisted ? 'fill-current' : ''} strokeWidth={2} />
          </button>

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          <h3 className="text-[0.82rem] sm:text-sm font-medium text-gray-800 mb-2.5 leading-snug line-clamp-2 group-hover:text-[#4F200D] transition-colors duration-300 flex-grow min-h-[2.5rem]">
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
