import React, { useContext, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ArrowUpRight } from 'lucide-react';
import ProgressiveImage from './ProgressiveImage';

const CATEGORIES = [
  {
    name: 'Kurtis',
    imageUrl: 'https://tahiliya.com/cdn/shop/files/1_bed339ee-3f4f-44af-ab58-455caf8aac35.webp?v=1758201541&width=800',
    tag: 'Women',
    description: 'Elegant, handcrafted designs',
  },
  {
    name: 'Lehangas',
    imageUrl: 'https://static3.azafashions.com/tr:w-450/uploads/product_gallery/samirah_1506-0264510001623775747.jpg',
    tag: 'Women',
    description: 'Royal elegance redefined',
  },
  {
    name: 'Kurtas',
    imageUrl: 'https://img.perniaspopupshop.com/catalog/product/a/v/AVKPR052308_1.jpg?impolicy=detailimageprod',
    tag: 'Men',
    description: 'Classic and contemporary styles',
  },
  {
    name: 'Sherwanis',
    imageUrl: 'https://img.perniaspopupshop.com/catalog/product/s/e/SEGCM052529_1.jpeg?impolicy=detailimageprod',
    tag: 'Men',
    description: 'Regal attire for special moments',
  },
];

const Collections = () => {
  const context = useContext(ShopContext);
  const setSelectedSubCategory = context?.setSelectedSubCategory ?? (() => {});
  const revealRefs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const r = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(to bottom, #f9f5f1, #ffffff)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={r} className="reveal text-center mb-10 sm:mb-14">
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: '#AF8255' }}>
            Explore
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-3"
              style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", color: '#2A1506' }}>
            Our Collections
          </h2>
          <p className="text-sm sm:text-base font-light max-w-md mx-auto" style={{ color: 'rgba(42,21,6,0.55)' }}>
            Explore handcrafted ethnic wear — each piece telling its own story
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <div ref={r} key={cat.name}
                 className="reveal"
                 style={{ transitionDelay: `${i * 0.07}s` }}>
              <NavLink
                to={`/shop/${cat.name}`}
                onClick={() => setSelectedSubCategory(cat.name)}
                className="group block h-full"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-white active:scale-[0.98]">

                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f0ece8]">
                    <ProgressiveImage
                      src={cat.imageUrl}
                      alt={cat.name}
                      width={500}
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-400" />

                    {/* Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] uppercase tracking-widest font-semibold text-white/80 bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-full">
                        {cat.tag}
                      </span>
                    </div>

                    {/* Arrow icon */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      <ArrowUpRight size={14} className="text-white" />
                    </div>

                    {/* Bottom text over image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <h3 className="text-white font-semibold text-base sm:text-lg leading-tight mb-0.5"
                          style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '0.01em' }}>
                        {cat.name}
                      </h3>
                      <p className="text-white/65 text-xs font-light">{cat.description}</p>
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Collections;
