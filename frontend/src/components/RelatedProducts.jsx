import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import { Package } from 'lucide-react';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0 && category && subCategory) {
      let filteredProducts = products
        .filter((item) => item.category === category && item.subCategory === subCategory)
        .filter((item) => item._id !== currentProductId);
      setRelated(filteredProducts.slice(0, 5));
    }
  }, [products, category, subCategory, currentProductId]);

  return (
    <div className="bg-white rounded-lg border border-background shadow-lg overflow-hidden">
      <div className="p-6 border-b border-background bg-gradient-to-r from-background/20 to-primary">
        <div className="flex items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold text-text">Related Products</h2>
            <p className="text-sm text-text/60 font-light">You might also like these items</p>
          </div>
        </div>
      </div>

      {/* Products Grid or Empty State */}
      <div className="p-6">
        {related.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mb-6">
              <Package size={28} className="text-secondary" />
            </div>
            <div className="text-center max-w-md">
              <h3 className="text-xl font-serif font-semibold text-text mb-2">No Related Products</h3>
              <p className="text-text/60 font-light leading-relaxed">
                We couldn't find similar items at the moment. Browse our collection for more options.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {related.map((item) => (
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
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;