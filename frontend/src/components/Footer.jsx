import React from 'react';
import {
  Instagram, Linkedin, Twitter, Mail, Phone, MapPin, Shield, Truck, Heart, ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-white mb-4">Aasvi</h2>
              <p className="text-white/60 leading-relaxed font-light text-sm">
                Bringing you the finest curated handcrafted fashion with a commitment to quality,
                authenticity, and exceptional service. Each piece tells a story of artisan craftsmanship
                and cultural heritage.
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Connect With Us</h4>
              <div className="flex space-x-3">
                <a
                  href="https://www.instagram.com/aasviofficial/"
                  target='_blank'
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 hover:bg-secondary hover:border-secondary transition-all duration-300 rounded-lg group backdrop-blur-sm"
                >
                  <Instagram size={18} className="text-white" />
                </a>
                <a
                  href="https://in.linkedin.com/company/aasvi"
                  target='_blank'
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 hover:bg-secondary hover:border-secondary transition-all duration-300 rounded-lg group backdrop-blur-sm"
                >
                  <Linkedin size={18} className="text-white" />
                </a>
                <a
                  href="https://twitter.com/aasviofficial"
                  target='_blank'
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20 hover:bg-secondary hover:border-secondary transition-all duration-300 rounded-lg group backdrop-blur-sm"
                >
                  <Twitter size={18} className="text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="text-white text-sm font-semibold tracking-wider uppercase border-b border-secondary/90 pb-2">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href='/about' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">About Us</span>
                    </a>
                  </li>
                  <li>
                    <a href='/contact' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Contact Us</span>
                    </a>
                  </li>
                  <li>
                    <a href='/shop/collection' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Collection</span>
                    </a>
                  </li>
                  <li>
                    <a href='/shop/new-arrivals' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">New Arrivals</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Policies */}
              <div className="space-y-4">
                <h4 className="text-white text-sm font-semibold tracking-wider uppercase border-b border-secondary/90 pb-2">
                  Policies
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href='/shippingpolicy' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Shipping Policy</span>
                    </a>
                  </li>
                  <li>
                    <a href='/refundpolicy' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Return Policy</span>
                    </a>
                  </li>
                  <li>
                    <a href='/privacypolicy' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Privacy Policy</span>
                    </a>
                  </li>
                  <li>
                    <a href='/termsconditions' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Terms & Conditions</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div className="space-y-4">
                <h4 className="text-white text-sm font-semibold tracking-wider uppercase border-b border-secondary/90 pb-2">
                  Support
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a href='/support' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Get Help</span>
                    </a>
                  </li>
                  <li>
                    <a href='/faqs' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">FAQs</span>
                    </a>
                  </li>
                  <li>
                    <a href='/track-order' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Track Order</span>
                    </a>
                  </li>
                  <li>
                    <a href='/size-guide' className="text-white/60 hover:text-white transition-colors font-light flex items-center group text-sm">
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Size Guide</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-white text-sm font-semibold tracking-wider uppercase border-b border-secondary/90 pb-2">
                  Contact
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-white/60 font-light text-sm">
                    <Phone size={16} className="text-white/60 flex-shrink-0 mt-0.5" />
                    <div>
                      <a href="tel:+919399336666" className="hover:text-white transition-colors block">
                        +91 9399336666
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-white/60 font-light text-sm">
                    <Mail size={16} className="text-white/60 flex-shrink-0 mt-0.5" />
                    <div>
                      <a href="mailto:aasviofficial@gmail.com" className="hover:text-white transition-colors break-all">
                        aasviofficial@gmail.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-white/60 font-light text-sm">
                    <MapPin size={16} className="text-white/60 flex-shrink-0 mt-0.5" />
                    <span>
                      Hyderabad, Telangana<br />502345, India
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-white/60 text-sm font-light">
                &copy; {currentYear} <span className="text-secondary font-semibold">Aasvi Fashions</span>. All rights reserved.
              </p>
            </div>

            {/* Quick Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <a href="/faqs" className="text-white/60 hover:text-white transition-colors duration-300 font-light">
                FAQs
              </a>
              <span className="text-white/20">•</span>
              <a href="/support" className="text-white/60 hover:text-white transition-colors duration-300 font-light">
                Support
              </a>
              <span className="text-white/20">•</span>
              <a href="/sitemap" className="text-white/60 hover:text-white transition-colors duration-300 font-light">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;