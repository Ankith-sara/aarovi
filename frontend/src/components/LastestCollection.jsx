import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

function LatestCollection() {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Helper function to get products by category/subcategory
  const getProductsByCategory = (products, categoryName, subcategories) => {
    return products.filter(item => {
      const itemCategory = item.category?.toLowerCase();
      const itemSubCategory = item.subCategory?.toLowerCase();

      return subcategories.some(sub =>
        itemCategory?.includes(sub.toLowerCase()) ||
        itemSubCategory?.includes(sub.toLowerCase())
      );
    });
  };

  // Helper function to select at least minCount products from each subcategory
  const selectBalancedProducts = (products, categories, minPerCategory = 2) => {
    const selectedProducts = [];
    const usedProductIds = new Set();

    categories.forEach(({ name, subcategories }) => {
      const categoryProducts = getProductsByCategory(products, name, subcategories);

      // Group by subcategory for more balanced selection
      const productsBySubcategory = {};
      subcategories.forEach(sub => {
        productsBySubcategory[sub] = categoryProducts.filter(item =>
          item.category?.toLowerCase().includes(sub.toLowerCase()) ||
          item.subCategory?.toLowerCase().includes(sub.toLowerCase())
        );
      });

      // Select at least minPerCategory from each subcategory if available
      Object.values(productsBySubcategory).forEach(subProducts => {
        const availableProducts = subProducts.filter(p => !usedProductIds.has(p._id));
        const toSelect = Math.min(minPerCategory, availableProducts.length);

        for (let i = 0; i < toSelect; i++) {
          selectedProducts.push(availableProducts[i]);
          usedProductIds.add(availableProducts[i]._id);
        }
      });
    });

    const remainingProducts = products.filter(p => !usedProductIds.has(p._id));
    const remainingSlots = Math.max(0, 10 - selectedProducts.length);

    for (let i = 0; i < Math.min(remainingSlots, remainingProducts.length); i++) {
      selectedProducts.push(remainingProducts[i]);
    }

    return selectedProducts.slice(0, 10);
  };

  useEffect(() => {
    if (products && products.length > 0) {
      if (selectedCategory === 'All') {
        // Define all categories and their subcategories
        const allCategories = [
          {
            name: 'Women',
            subcategories: ['Kurtis', 'Kurta Sets', 'Dresses']
          },
          {
            name: 'Men',
            subcategories: ['Shirts', 'Sleeve Shirts', 'Trousers']
          },
          {
            name: 'Home',
            subcategories: ['Home', 'Wall Decor', 'Kitchenware']
          },
          {
            name: 'Accessories',
            subcategories: ['Bags', 'Pouches', 'Accessories']
          }
        ];

        const balancedProducts = selectBalancedProducts(products, allCategories, 2);
        setLatestProducts(balancedProducts);

      } else {
        if (categoryConfig.name) {
          const balancedProducts = selectBalancedProducts(products, [categoryConfig], 2);
          setLatestProducts(balancedProducts);
        } else {
          setLatestProducts(products.slice(0, 10));
        }
      }
    } else {
      setLatestProducts([]);
    }
  }, [products, selectedCategory]);

  return (
    <section className="bg-gradient-to-b from-white to-background/20 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text mb-3">
              Latest Collection
            </h2>
            <p className="text-text/60 font-light text-lg max-w-2xl">
              Discover our newest handcrafted pieces, carefully curated to celebrate heritage and style
            </p>
          </div>
          
          <NavLink 
            to="/shop/collection" 
            className="group inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg self-start lg:self-auto"
          >
            <span>View All Collection</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </NavLink>
        </div>

        {latestProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {latestProducts.map((item, index) => (
              <div 
                key={index} 
                className="group relative"
                style={{ 
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` 
                }}
              >
                <div className="relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 border border-background">
                  <ProductItem
                    id={item._id}
                    image={item.images}
                    name={item.name}
                    price={item.price}
                    company={item.company}
                  />
                  
                  {/* New Badge */}
                  {index < 1 && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-secondary text-white text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide shadow-lg flex items-center gap-1">
                        <Sparkles size={12} />
                        <span>New</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-2 -right-2 w-12 h-12 border-2 border-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-background shadow-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={32} className="text-secondary" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-text mb-3">
              No Products Available
            </h3>
            <p className="text-text/60 font-light text-lg mb-6">
              New arrivals coming soon
            </p>
            <NavLink 
              to="/shop/collection"
              className="inline-flex items-center gap-2 border-2 border-secondary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all duration-300"
            >
              <span>Explore Other Collections</span>
              <ArrowRight size={18} />
            </NavLink>
          </div>
        )}

        {/* View More Link (Mobile) */}
        {latestProducts.length > 0 && (
          <div className="mt-12 text-center lg:hidden">
            <NavLink 
              to="/shop/collection" 
              className="inline-flex items-center gap-2 text-secondary font-semibold hover:text-secondary/80 transition-colors group"
            >
              <span>View All Products</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </NavLink>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default LatestCollection;