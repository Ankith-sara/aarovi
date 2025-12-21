import React from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExclusiveOffers = () => {
  return (
    <section className="relative h-[95vh] overflow-hidden">
      <div className="flex h-full flex-col lg:flex-row">
        {/* Left Side */}
        <div className="w-full lg:w-1/3 bg-gradient-to-br from-white to-background/30 flex items-center justify-center px-8 sm:px-12 lg:px-16 py-12 lg:py-0 relative z-10">
          <div className="max-w-xl">
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-6 leading-tight"
              data-aos="fade-up"
            >
              Exclusive<br />Offers
            </h1>
            <div className="w-24 h-1 bg-secondary mb-6 rounded-full" data-aos="fade-up" />
            <p className="text-base sm:text-lg text-text/60 font-light leading-relaxed mb-8" data-aos="fade-up">
              Upgrade your wardrobe with timeless pieces, carefully curated to celebrate heritage and style.
            </p>
            <Link to="/shop/collection">
              <button 
                className="group inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                data-aos="fade-up"
              >
                <Tag size={18} />
                <span>Shop Now</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-2/3 h-64 lg:h-full relative">
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: "url('https://images.cdn-files-a.com/ready_uploads/media/2848388/2000_5e10368d5839d.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default ExclusiveOffers;