import React, { useEffect, useRef } from 'react';
import { Scissors, Truck, RotateCcw, MessageCircle } from 'lucide-react';

const SERVICES = [
  { icon: Scissors, title: 'Custom Tailoring', desc: 'Expert tailoring for a perfect fit on every handcrafted piece.' },
  { icon: Truck,    title: 'Free Shipping',    desc: 'Free delivery on all orders above ₹2,000 anywhere in India.' },
  { icon: RotateCcw,title: 'Easy Returns',     desc: 'Hassle-free returns within 30 days. No questions asked.' },
  { icon: MessageCircle, title: 'Style Consultation', desc: 'Personalised styling advice from our in-house fashion experts.' },
];

const Services = () => {
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')), { threshold: 0.15 });
    refs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const r = el => { if (el && !refs.current.includes(el)) refs.current.push(el); };

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(to bottom, #ffffff, #FBF7F3)' }}>
      <div className="max-w-6xl mx-auto">

        <div ref={r} className="reveal text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: '#AF8255' }}>Why Aarovi</p>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", color: '#2A1506' }}>
            The Aarovi Promise
          </h2>
          <div className="w-10 h-px mx-auto mt-4" style={{ background: '#AF8255' }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden shadow-sm" style={{ background: '#f0ece8' }}>
          {SERVICES.map(({ icon: Icon, title, desc }, i) => (
            <div ref={r} key={title}
                 className="reveal group bg-white p-8 hover:bg-[#FBF7F3] transition-colors duration-300 text-center"
                 style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 transition-all duration-300 group-hover:scale-110"
                   style={{ background: 'rgba(79,32,13,0.07)' }}>
                <Icon className="w-6 h-6 transition-colors duration-300 group-hover:text-white"
                      style={{ color: '#4F200D' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'white'}
                      onMouseLeave={e => e.currentTarget.style.color = '#4F200D'} />
              </div>
              <h3 className="font-semibold text-sm mb-2 tracking-wide" style={{ color: '#2A1506' }}>{title}</h3>
              <p className="text-xs leading-relaxed font-light" style={{ color: 'rgba(42,21,6,0.55)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
