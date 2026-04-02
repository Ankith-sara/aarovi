import React, { useState, useContext } from 'react';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const NewsletterBox = () => {
  const { backendUrl } = useContext(ShopContext) ?? {};
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/newsletter/subscribe`, { email });
      if (res.data.success) { setDone(true); setEmail(''); }
      else toast.error(res.data.message || 'Subscription failed.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: '#2A1506' }}>
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(175,130,85,0.12) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(79,32,13,0.4) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: '#AF8255' }}>Stay Connected</p>
        <h2 className="text-3xl sm:text-4xl font-light mb-4 text-white" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
          Join the Aarovi Community
        </h2>
        <p className="text-sm font-light leading-relaxed mb-10 max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
          New collections, artisan stories, and exclusive offers — straight to your inbox.
        </p>

        {done ? (
          <div className="inline-flex items-center gap-3 border rounded-2xl px-8 py-5" style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(175,130,85,0.3)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#AF8255' }}>
              <Check size={16} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-white">You're in!</p>
              <p className="text-xs font-light" style={{ color: 'rgba(255,255,255,0.55)' }}>Check your inbox for a welcome message.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                     placeholder="your@email.com" required disabled={loading}
                     className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none text-sm font-light transition-all disabled:opacity-60"
                     style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
                     onFocus={e => e.target.style.borderColor = '#AF8255'}
                     onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>
            <button type="submit" disabled={loading || !email}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                    style={{ background: '#AF8255', color: 'white' }}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <><span>Subscribe</span><ArrowRight size={14} /></>
              }
            </button>
          </form>
        )}

        <p className="text-[11px] mt-6 font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default NewsletterBox;
