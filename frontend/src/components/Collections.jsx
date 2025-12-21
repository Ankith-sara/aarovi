import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import { ArrowRight, Sparkles } from 'lucide-react';

const Collections = () => {
  const { setSelectedSubCategory } = useContext(ShopContext);

  const handleCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

  const categories = [
    {
      name: 'Kurtis',
      imageUrl: 'https://tahiliya.com/cdn/shop/files/1_bed339ee-3f4f-44af-ab58-455caf8aac35.webp?v=1758201541&width=800',
      description: 'Elegant, handcrafted designs'
    },
    {
      name: 'Lehengas',
      imageUrl: 'https://static3.azafashions.com/tr:w-450/uploads/product_gallery/samirah_1506-0264510001623775747.jpg',
      description: 'Royal elegance redefined'
    },
    {
      name: 'Kurtas',
      imageUrl: 'https://img.perniaspopupshop.com/catalog/product/a/v/AVKPR052308_1.jpg?impolicy=detailimageprod',
      description: 'Classic and contemporary styles'
    },
    {
      name: 'Sherwanis',
      imageUrl: 'https://img.perniaspopupshop.com/catalog/product/s/e/SEGCM052529_1.jpeg?impolicy=detailimageprod',
      description: 'Regal attire for special moments'
    },
  ];

  return (
    <section className="bg-gradient-to-b from-background/20 to-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text mb-4">
            Our Collections
          </h2>
          <p className="text-text/60 font-light text-lg max-w-2xl mx-auto">
            Explore our curated selection of handcrafted ethnic wear, each piece telling its own story
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.name} 
              className="group"
              style={{ 
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` 
              }}
            >
              <NavLink 
                to={`/shop/${category.name}`} 
                onClick={() => handleCategoryClick(category.name)} 
                className="block h-full"
              >
                <div className="relative h-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-background">
                  {/* Image Container */}
                  <div className="relative overflow-hidden ">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-serif font-bold text-text mb-2 group-hover:text-secondary transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-sm text-text/60 font-light leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                      
                      {/* Arrow Icon */}
                      <div className="ml-4 w-10 h-10 rounded-full bg-gradient-to-br from-secondary/80 to-secondary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-secondary flex-shrink-0">
                        <ArrowRight size={18} className="text-secondary group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 border-2 border-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
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
};

export default Collections;