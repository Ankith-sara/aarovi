import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import { ArrowRight } from 'lucide-react';

const RecentlyViewed = () => {
  const { getRecentlyViewed, navigate } = useContext(ShopContext);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const viewed = getRecentlyViewed();
    setRecentlyViewed(viewed);
  }, [getRecentlyViewed]);

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-background shadow-lg overflow-hidden">
      <div className="p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <h2 className="text-2xl font-serif font-bold text-text">Recently Viewed</h2>
              <p className="text-sm text-text/60 font-light">Items you've checked out recently</p>
            </div>
          </div>
          {recentlyViewed.length > 5 && (
            <button 
              onClick={() => navigate && navigate('/collection')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              <span className="text-sm">View All</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {recentlyViewed.slice(0, 10).map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.images}
              company={item.company}
            />
          ))}
        </div>

        {recentlyViewed.length > 5 && (
          <div className="mt-6 sm:hidden">
            <button
              onClick={() => navigate && navigate('/collection')}
              className="w-full py-3 border-2 border-background text-text font-semibold rounded-lg hover:bg-background/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>View All Products</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyViewed;