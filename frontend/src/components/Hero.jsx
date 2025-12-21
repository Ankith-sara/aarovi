import React from 'react';
import { Sparkles, ShoppingBag, Users, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-Bodoni font-bold text-text mb-6">
              Style Your Soul with<br />Custom Ethnic Wear
            </h1>
            <p className="text-lg sm:text-xl text-text/70 mb-8 max-w-2xl mx-auto">
              Discover the perfect blend of heritage and contemporary style. Design your own kurti, lehenga, kurta, or sherwani with AI-powered suggestions tailored to your unique taste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-all w-full sm:w-auto">
                Start Designing
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 border-2 border-secondary bg-white text-secondary px-6 py-3 rounded-md font-medium hover:bg-secondary/5 transition-all w-full sm:w-auto">
                Browse Collection
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="font-Bodoni text-lg font-semibold mb-2 text-text">AI Design Suggestions</h3>
              <p className="text-text/70">
                Get intelligent design recommendations based on traditional ethnic wear principles.
              </p>
            </div>

            <div className="text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="font-Bodoni text-lg font-semibold mb-2 text-text">Curated Collection</h3>
              <p className="text-text/70">
                Browse exquisite kurtis, lehengas, kurtas, and sherwanis ready for immediate purchase.
              </p>
            </div>

            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="font-Bodoni text-lg font-semibold mb-2 text-text">Expert Consultation</h3>
              <p className="text-text/70">
                Work with our design experts to create your perfect traditional ensemble.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;