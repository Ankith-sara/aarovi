import React from 'react';
import { Sparkles, ShoppingBag, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="mt-16 min-h-screen">
      <div className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="headers-description box shadow-lg rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 p-8 sm:p-12 mb-20">
            <div>
              <div className="headers-text-orders text-center">
                <div data-aos="slide-up" className="aos-init aos-animate">
                  <h1 className="m-h-item header1 text-4xl sm:text-5xl lg:text-6xl font-light text-text mb-4 tracking-wide font-serif">
                    Elegant Styles Await
                  </h1>
                </div>
                <div className="line headers-text-separator w-24 h-1 bg-secondary mx-auto mb-6"></div>
                <div data-aos="slide-up" className="aos-init aos-animate">
                  <h2 className="m-h-item header2 text-xl sm:text-2xl text-text/80 font-light">
                    Find the perfect dress for any occasion.
                  </h2>
                </div>
              </div>
              <div className="header-spacer pt-6" data-text-exist="true" data-action-exist="false"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to='/customize' className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-md font-medium hover:bg-secondary/90 transition-all w-full sm:w-auto">
                  Start Designing
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to='/shop/collection' className="inline-flex items-center justify-center gap-2 border-2 border-secondary bg-white text-secondary px-6 py-3 rounded-md font-medium hover:bg-secondary/5 transition-all w-full sm:w-auto">
                  Browse Collection
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="font-serif text-lg font-semibold mb-2 text-text/90">AI Design Suggestions</h3>
              <p className="text-text/80">
                Get intelligent design recommendations based on traditional ethnic wear principles.
              </p>
            </div>

            <div className="text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="font-serif text-lg font-semibold mb-2 text-text/90">Curated Collection</h3>
              <p className="text-text/80">
                Browse exquisite kurtis, lehengas, kurtas, and sherwanis ready for immediate purchase.
              </p>
            </div>

            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="font-serif text-lg font-semibold mb-2 text-text/90">Expert Consultation</h3>
              <p className="text-text/80">
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