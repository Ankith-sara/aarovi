import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '✦', title: 'AI Design Studio',      desc: 'Co-create your outfit using our intelligent design canvas rooted in ethnic wear principles.' },
  { icon: '◈', title: 'Curated Collection',     desc: 'Kurtis, lehengas, kurtas & sherwanis — each piece hand-selected for quality and craft.' },
  { icon: '◎', title: 'Expert Consultation',    desc: 'Work directly with our design team to bring your perfect traditional ensemble to life.' },
];

const Hero = () => {
  const revealRefs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.15 }
    );
    revealRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const r = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  return (
    <div className="mt-[68px]">

      {/* ── Banner ─────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden" style={{ background: '#FBF7F3' }}>

        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(79,32,13,0.065) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-20 -left-20 w-[380px] h-[380px] rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(175,130,85,0.07) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.022]"
               style={{ backgroundImage: 'repeating-linear-gradient(0deg,#4F200D 0,#4F200D 1px,transparent 1px,transparent 64px),repeating-linear-gradient(90deg,#4F200D 0,#4F200D 1px,transparent 1px,transparent 64px)' }} />
        </div>

        <div className="flex items-center justify-center text-center z-10 max-w-7xl mx-auto px-5 lg:px-8 w-full py-20 lg:py-28">
          <div className="max-w-4xl">

            {/* Headline */}
            <h1 ref={r} className="reveal leading-[1.08] tracking-tight mb-6"
                style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2.8rem,6vw,4.5rem)', fontWeight: 300, color: '#2A1506', transitionDelay: '0.1s' }}>
              Where Style<br />
              <em className="not-italic" style={{ color: '#4F200D' }}>Meets Your Soul</em>
            </h1>

            {/* Rule */}
            <div ref={r} className="reveal flex items-center justify-center gap-4 mb-7" style={{ transitionDelay: '0.18s' }}>
              <div className="h-px w-10" style={{ background: '#AF8255' }} />
              <span className="text-[10px] tracking-[0.28em] uppercase font-medium" style={{ color: '#AF8255' }}>Est. Tradition</span>
              <div className="h-px w-14" style={{ background: 'rgba(175,130,85,0.35)' }} />
            </div>

            <p ref={r} className="reveal text-base sm:text-lg font-light leading-relaxed max-w-xl mb-10"
               style={{ color: 'rgba(42,21,6,0.6)', transitionDelay: '0.22s' }}>
              Find the perfect dress for any occasion — ready-made from our curated collection,
              or crafted entirely to your vision.
            </p>

            {/* CTAs */}
            <div ref={r} className="reveal flex flex-col sm:flex-row justify-center gap-3 sm:gap-4" style={{ transitionDelay: '0.3s' }}>
              <Link to="/customize"
                    className="group inline-flex items-center justify-center gap-2.5 text-white px-7 py-4 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: '#4F200D', boxShadow: '0 8px 32px rgba(79,32,13,0.28)' }}>
                <Sparkles size={15} className="group-hover:rotate-12 transition-transform duration-300" />
                Start Designing
              </Link>
              <Link to="/shop/collection"
                    className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5"
                    style={{ border: '2px solid rgba(79,32,13,0.25)', color: '#4F200D' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#4F200D'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(79,32,13,0.25)'}>
                Browse Collection
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature strip ─────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 overflow-hidden rounded-2xl shadow-sm" style={{ border: '1px solid #f0ece8', gap: '1px', background: '#f0ece8' }}>
          {FEATURES.map(({ icon, title, desc }, i) => (
            <div ref={r} key={title}
                 className="reveal group bg-white p-8 sm:p-10 hover:bg-[#FBF7F3] transition-colors duration-300 cursor-default"
                 style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="text-2xl mb-5 font-light group-hover:scale-110 transition-transform duration-300 origin-left" style={{ color: '#AF8255' }}>{icon}</div>
              <h3 className="font-semibold mb-2.5 text-sm tracking-wide" style={{ color: '#2A1506' }}>{title}</h3>
              <p className="text-sm leading-relaxed font-light" style={{ color: 'rgba(42,21,6,0.55)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Hero;
