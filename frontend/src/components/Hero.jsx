import React from 'react';
import { Sparkles, ShoppingBag, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Sparkles,
    title: 'AI Design Suggestions',
    description: 'Intelligent recommendations rooted in traditional ethnic wear principles.',
  },
  {
    icon: ShoppingBag,
    title: 'Curated Collection',
    description: 'Kurtis, lehengas, kurtas, and sherwanis — ready to wear, ready to love.',
  },
  {
    icon: Users,
    title: 'Expert Consultation',
    description: 'Work with our design team to create your perfect traditional ensemble.',
  },
];

const Hero = () => (
  <div className="mt-16 min-h-screen">
    {/* ── Banner ── */}
    <section className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-secondary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-5">
          Handcrafted Indian fashion
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-text mb-5 tracking-wide leading-[1.15]">
          Elegant Styles<br className="hidden sm:block" /> Await You
        </h1>

        <div className="w-16 h-[2px] bg-secondary mx-auto mb-6" />

        <p className="text-base sm:text-lg text-text/65 font-light leading-relaxed max-w-xl mx-auto mb-10">
          Find the perfect dress for any occasion — ready-made or made entirely for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/customize"
            className="inline-flex items-center justify-center gap-2 bg-secondary text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Sparkles size={16} />
            Start Designing
          </Link>
          <Link
            to="/shop/collection"
            className="inline-flex items-center justify-center gap-2 border-2 border-secondary text-secondary px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-secondary/5 hover:-translate-y-0.5 transition-all duration-300 group"
          >
            Browse Collection
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>

    {/* ── Feature cards ── */}
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="group text-center p-8 rounded-2xl border border-gray-100 hover:border-secondary/30 hover:shadow-lg transition-all duration-300">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/8 mb-5 group-hover:bg-secondary/15 transition-colors duration-300">
              <Icon className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="font-serif text-base font-semibold mb-2 text-text">{title}</h3>
            <p className="text-text/60 text-sm leading-relaxed font-light">{description}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Hero;
