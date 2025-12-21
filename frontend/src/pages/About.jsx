import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  useEffect(() => {
    document.title = 'About Aasvi | Custom Ethnic Wear';
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-background to-white px-4 sm:px-6 lg:px-8 py-32 sm:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            About Us
          </h1>
          <div className="w-24 h-1 bg-secondary mx-auto mb-8"></div>
          <p className="text-xl sm:text-2xl text-text/90 max-w-4xl mx-auto font-light leading-relaxed">
            Our passion lies in providing the most elegant and stylish dresses for all occasions. Crafted with care and a touch of sophistication, our collection is designed to highlight individuality and beauty.
          </p>
        </div>
      </div>

      {/* Main Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <img
                  className="w-full h-[500px] object-cover"
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
                  alt="Aasvi Craftsmanship"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/30 to-transparent"></div>
              </div>
              <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-secondary rounded-lg"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border-2 border-secondary rounded-lg"></div>
            </div>

            <div>
              <div className="mb-8">
                <Sparkles className="w-12 h-12 text-secondary mb-4" />
                <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text mb-6">
                  Our Story
                </h2>
              </div>

              <div className="space-y-5 text-text/80 text-lg leading-relaxed font-light">
                <p>
                  Each dress is selected to ensure comfort, quality, and style. Whether for a casual outing or a glamorous gala, we have the apparel to make you shine.
                </p>
                <p>
                  At Aasvi, we believe that fashion is more than just clothing—it's a form of self-expression. Our collection celebrates the rich heritage of ethnic wear while embracing contemporary design sensibilities.
                </p>
                <p>
                  Every piece in our collection is crafted with meticulous attention to detail, using premium fabrics and traditional techniques passed down through generations. We work closely with skilled artisans who bring decades of expertise to every stitch.
                </p>
                <div className="bg-gradient-to-br from-background/30 to-primary p-6 rounded-lg border-l-4 border-secondary mt-8">
                  <p className="text-xl italic text-text font-light">
                    "Join us in celebrating confidence through fashion. At Aasvi, we don't just create dresses—we create experiences that make you feel extraordinary."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-6">
            Experience the Aasvi Difference
          </h2>
          <p className="text-xl text-text/70 mb-10 leading-relaxed">
            Discover our exquisite collection of handcrafted ethnic wear and find the perfect piece that celebrates your unique style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-secondary/80 to-secondary/90 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all text-lg">
              Explore Collection
            </button>
            <Link to='/contact' className="inline-flex items-center justify-center gap-2 border-2 border-secondary bg-white text-secondary px-8 py-4 rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all text-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;