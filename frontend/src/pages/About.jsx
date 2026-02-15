import React, { useEffect } from 'react';
import { Sparkles, Heart, Users, Award, ArrowRight, Star } from 'lucide-react';

const About = () => {
  useEffect(() => {
    document.title = 'About Aarovi | Custom Ethnic Wear';
  }, []);

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-6">
              Crafting Elegance, <br className="hidden sm:block" />Celebrating Heritage
            </h1>
            <p className="text-lg text-text/60 font-light leading-relaxed"> At Aarovi, we believe fashion is more than clothing—it's self-expression, tradition, and artistry woven into every thread. </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-3xl transform rotate-3"></div>
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    className="w-full h-[500px] object-cover"
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
                    alt="Aarovi Craftsmanship"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-text/40 via-transparent to-transparent"></div>

                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                        <Star size={20} className="text-white fill-white" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-text text-lg">Handcrafted Excellence</p>
                        <p className="text-sm text-text/60 font-light">Traditional artistry meets modern design</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-6">Where Tradition Meets Contemporary Style</h2>
              <div className="space-y-4 text-text/70 text-base leading-relaxed font-light">
                <p> At Aarovi, we're passionate about creating elegant and stylish dresses for all occasions. Each piece in our collection is carefully selected to ensure comfort, quality, and timeless style.</p>
                <p> Whether you're dressing for a casual outing or a glamorous celebration, our curated collection offers the perfect blend of traditional craftsmanship and modern aesthetics to make you shine.</p>
                <p> We believe in celebrating individuality through fashion. Every dress tells a story—of skilled hands that crafted it, of traditions preserved, and of the confidence it brings to the wearer.</p>
              </div>
              <div className="mt-8 p-6 bg-gradient-to-br from-background/20 to-background/5 rounded-2xl border-l-4 border-secondary">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-lg font-serif font-semibold text-text mb-2"> Our Promise to You</p>
                    <p className="text-sm text-text/60 font-light leading-relaxed italic">"We don't just create dresses—we create experiences that celebrate your unique beauty and make you feel extraordinary."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-white to-background/20 rounded-3xl p-12 border border-background/50 shadow-xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
              <Sparkles size={14} className="text-secondary" />
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Start Your Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-4"> Experience Aarovi</h2>
            <p className="text-lg text-text/60 mb-8 font-light leading-relaxed max-w-3xl mx-auto"> Discover our exquisite collection of handcrafted ethnic wear and find the perfect piece that celebrates your unique style.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => handleNavigate('/shop/collection')} className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-all duration-300 shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/40 hover:-translate-y-0.5">
                <span>Explore Collection</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => handleNavigate('/contact')} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-background/50 text-text font-semibold rounded-full hover:border-secondary hover:shadow-lg transition-all duration-300">
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;