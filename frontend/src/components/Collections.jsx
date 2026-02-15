import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
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
    <section className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3">
            Our Collections
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Explore handcrafted ethnic wear, each piece telling its own story
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="group h-full"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              <NavLink
                to={`/shop/${category.name}`}
                onClick={() => handleCategoryClick(category.name)}
                className="block h-full"
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 active:scale-[0.98] h-full flex flex-col">
                  <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-md lg:text-xl font-serif font-bold text-gray-900 mb-1.5 group-hover:text-secondary transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                          <ArrowRight size={18} className="text-secondary transition-colors duration-300 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Smooth tap feedback for mobile */
        @media (hover: none) {
          .group:active {
            transform: scale(0.98);
            transition: transform 0.1s;
          }
        }
      `}</style>
    </section>
  );
};

export default Collections;