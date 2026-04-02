import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: '#1A0D04' }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>

          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <p className="text-3xl font-light text-white mb-2" style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: '0.04em' }}>Aarovi</p>
              <div className="w-8 h-px mb-4" style={{ background: '#AF8255' }} />
              <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Bringing you the finest curated handcrafted fashion with a commitment to quality, authenticity, and exceptional service. Each piece tells a story of artisan craftsmanship and cultural heritage.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#AF8255' }}>Connect With Us</p>
              <div className="flex gap-2.5">
                {[
                  { href: 'https://www.instagram.com/aaroviofficial/', icon: Instagram },
                  { href: 'https://in.linkedin.com/company/aarovi', icon: Linkedin },
                  { href: 'https://twitter.com/aaroviofficial', icon: Twitter },
                ].map(({ href, icon: Icon }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                     className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                     style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                     onMouseEnter={e => { e.currentTarget.style.background = '#AF8255'; e.currentTarget.style.borderColor = '#AF8255'; }}
                     onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                    <Icon size={16} className="text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              {
                title: 'Quick Links',
                links: [{ to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact Us' }, { to: '/shop/collection', label: 'Collection' }, { to: '/customize', label: 'Customize' }]
              },
              {
                title: 'Policies',
                links: [{ to: '/shippingpolicy', label: 'Shipping Policy' }, { to: '/refundpolicy', label: 'Return Policy' }, { to: '/privacypolicy', label: 'Privacy Policy' }, { to: '/termsconditions', label: 'Terms & Conditions' }]
              },
              {
                title: 'Support',
                links: [{ to: '/support', label: 'Get Help' }, { to: '/faqs', label: 'FAQs' }, { to: '/orders', label: 'My Orders' }]
              },
            ].map(({ title, links }) => (
              <div key={title} className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#AF8255' }}>{title}</h4>
                <ul className="space-y-2.5">
                  {links.map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className="text-xs font-light transition-colors duration-200 hover:text-white"
                            style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#AF8255' }}>Contact</h4>
              <ul className="space-y-3">
                {[
                  { icon: Phone, content: <a href="tel:+917416964805" className="hover:text-white transition-colors">+91 7416964805</a> },
                  { icon: Mail,  content: <a href="mailto:aaroviofficial@gmail.com" className="hover:text-white transition-colors break-all">aaroviofficial@gmail.com</a> },
                  { icon: MapPin, content: <span>Hyderabad, Telangana<br />502345, India</span> },
                ].map(({ icon: Icon, content }, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    <Icon size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#AF8255' }} />
                    <div>{content}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>
            &copy; {year} <span style={{ color: '#AF8255' }}>Aarovi Fashions</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <Link to="/support" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
