import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem, { ProductItemSkeleton } from './ProductItem';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const selectBalanced = (products, max = 10) => {
  const seen = new Set();
  const result = [];
  // One pass: prefer variety by rotating through subCategories
  const bySub = {};
  products.forEach(p => {
    const k = p.subCategory || 'other';
    if (!bySub[k]) bySub[k] = [];
    bySub[k].push(p);
  });
  const keys = Object.keys(bySub);
  let i = 0;
  while (result.length < max) {
    let added = false;
    for (const k of keys) {
      if (result.length >= max) break;
      const avail = bySub[k].find(p => !seen.has(p._id));
      if (avail) { result.push(avail); seen.add(avail._id); added = true; }
    }
    if (!added) break;
    if (++i > 20) break;
  }
  return result;
};

function LatestCollection() {
  const context = useContext(ShopContext);
  const products = context?.products ?? [];
  const isLoading = context?.isLoading ?? false;
  const [latest, setLatest] = useState([]);
  const refs = useRef([]);

  useEffect(() => {
    if (products?.length) setLatest(selectBalanced(products, 10));
    else setLatest([]);
  }, [products]);

  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')), { threshold: 0.1 });
    refs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [latest]);

  const r = el => { if (el && !refs.current.includes(el)) refs.current.push(el); };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(to bottom, #ffffff, #FBF7F3)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={r} className="reveal flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: '#AF8255' }}>New In</p>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight mb-2" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", color: '#2A1506' }}>
              Latest Collection
            </h2>
            <p className="text-sm font-light" style={{ color: 'rgba(42,21,6,0.55)' }}>
              Newest handcrafted pieces, celebrating heritage and style
            </p>
          </div>
          <NavLink to="/shop/collection"
                   className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wide transition-all duration-300 self-start lg:self-auto hover:-translate-y-0.5"
                   style={{ color: '#4F200D' }}>
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </NavLink>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => <ProductItemSkeleton key={i} />)}
          </div>
        ) : latest.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {latest.map((item, i) => (
              <div ref={r} key={item._id} className="reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
                <ProductItem id={item._id} image={item.images} name={item.name} price={item.price} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border" style={{ background: '#FBF7F3', borderColor: 'rgba(79,32,13,0.08)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(79,32,13,0.07)' }}>
              <ShoppingBag size={28} style={{ color: '#4F200D' }} />
            </div>
            <h3 className="text-xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2A1506' }}>No Products Available</h3>
            <p className="text-sm font-light mb-6" style={{ color: 'rgba(42,21,6,0.5)' }}>New arrivals coming soon</p>
            <NavLink to="/shop/collection"
                     className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300"
                     style={{ border: '2px solid #4F200D', color: '#4F200D' }}>
              Explore Collections <ArrowRight size={15} />
            </NavLink>
          </div>
        )}

        {latest.length > 0 && (
          <div className="mt-10 text-center lg:hidden">
            <NavLink to="/shop/collection"
                     className="inline-flex items-center gap-2 text-sm font-semibold group transition-colors"
                     style={{ color: '#4F200D' }}>
              View All Products
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestCollection;
