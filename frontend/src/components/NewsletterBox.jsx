import React, { useState, useContext } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const NewsletterBox = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/newsletter/subscribe`, { email });
      if (res.data.success) {
        setDone(true);
        setEmail('');
      } else {
        toast.error(res.data.message || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-3">Stay Connected</p>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-text mb-4">
          Join the Aarovi Community
        </h2>
        <p className="text-text/55 font-light leading-relaxed mb-10 max-w-md mx-auto text-sm">
          New collections, artisan stories, and exclusive offers — straight to your inbox.
        </p>

        {done ? (
          <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-8 py-5">
            <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check size={18} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">You're in!</p>
              <p className="text-xs text-green-700 font-light">Check your inbox for a welcome message.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 focus:border-secondary rounded-xl outline-none transition-all text-sm text-text placeholder-gray-400 disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-secondary text-white rounded-xl font-semibold text-sm hover:bg-secondary/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Subscribe</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </form>
        )}

        <p className="text-text/35 text-xs mt-6 font-light">
          No spam. Unsubscribe anytime. We respect your{' '}
          <a href="/privacy-policy" className="text-secondary/70 hover:text-secondary underline underline-offset-2 transition-colors">
            privacy
          </a>.
        </p>
      </div>
    </section>
  );
};

export default NewsletterBox;
