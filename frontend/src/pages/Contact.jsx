import React, { useEffect } from 'react';
import NewsletterBox from '../components/NewsletterBox';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

const Contact = () => {
  useEffect(() => {
    document.title = 'Contact Customer Service | Aarovi'
  });

  return (
    <div className="min-h-screen">
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden" style={{ background: "#FBF7F3" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-4" style={{ color: '#AF8255' }}>Get In Touch</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2A1506' }}>
              Let's Connect
            </h1>
            <div className="w-10 h-px mx-auto mb-6" style={{ background: '#AF8255' }} />
            <p className="text-base sm:text-lg font-light leading-relaxed" style={{ color: 'rgba(42,21,6,0.6)' }}>
              Have questions about our handcrafted pieces? Need assistance with your order? We're here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-white rounded-2xl p-8 border border-[#FBF7F3]/50 hover:shadow-xl hover:border-[#4F200D]/30 transition-all duration-300">
              <div className="w-14 h-14 bg-[#4F200D]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone size={24} className="text-[#4F200D]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-text mb-1">Call Us</h3>
              <p className="text-sm text-text/50 font-light mb-4">Mon - Sat: 9 AM - 6 PM</p>
              <a href="tel:+917416964805" className="text-lg font-semibold text-[#4F200D] hover:text-[#4F200D]/80 transition-colors flex items-center gap-2 group">
                +91 7416964805
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="group bg-white rounded-2xl p-8 border border-[#FBF7F3]/50 hover:shadow-xl hover:border-[#4F200D]/30 transition-all duration-300">
              <div className="w-14 h-14 bg-[#4F200D]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail size={24} className="text-[#4F200D]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-text mb-1">Email Us</h3>
              <p className="text-sm text-text/50 font-light mb-4">Response within 24 hours</p>
              <a href="mailto:aaroviofficial@gmail.com" className="text-lg font-semibold text-[#4F200D] hover:text-[#4F200D]/80 transition-colors flex items-center gap-2 group break-all">
                aaroviofficial@gmail.com
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0" />
              </a>
            </div>
            <div className="group bg-white rounded-2xl p-8 border border-[#FBF7F3]/50 hover:shadow-xl hover:border-[#4F200D]/30 transition-all duration-300">
              <div className="w-14 h-14 bg-[#4F200D]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin size={24} className="text-[#4F200D]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-text mb-1">Visit Us</h3>
              <p className="text-sm text-text/50 font-light mb-4">Our Studio</p>
              <p className="text-text/70 font-light">
                Hyderabad, Telangana<br />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FBF7F3]/20 to-[#FBF7F3]/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-6" style={{ fontFamily: "'Cormorant Garamond',Georgia,serif" }}>
                More Than Just Customer Service
              </h2>
              <div className="space-y-4 text-text/70 text-base leading-relaxed font-light">
                <p> At Aarovi, we believe every conversation is an opportunity to share our passion for heritage craft and conscious fashion. Our team doesn't just handle inquiries — we connect stories, traditions, and dreams.</p>
                <p> Whether you need styling advice, order assistance, or want to learn about the artisans behind your favorite pieces, we're here to help make your experience as meaningful as the craftsmanship we celebrate.</p>
                <p> From size consultations to custom requests, tracking updates to care instructions, our dedicated team ensures your journey with Aarovi is seamless and memorable.</p>
              </div>
              <div className="mt-8 p-6 bg-white rounded-2xl border-l-4 border-[#4F200D] shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4F200D]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageCircle size={20} className="text-[#4F200D]" />
                  </div>
                  <div>
                    <p className="text-lg font-serif font-semibold text-text mb-2"> We're Always Here for You</p>
                    <p className="text-sm text-text/60 font-light leading-relaxed"> Every question matters. Every concern is heard. Every customer is valued. That's the Aarovi way.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4F200D]/20 to-primary/20 rounded-3xl transform rotate-3"></div>
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    className="w-full h-[500px] object-cover"
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
                    alt="Aarovi Customer Service"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-text/40 via-transparent to-transparent"></div>

                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#4F200D] rounded-full flex items-center justify-center">
                        <Clock size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-text text-lg">Quick Response Time</p>
                        <p className="text-sm text-text/60 font-light">We typically reply within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <NewsletterBox />
      </section>
    </div>
  );
};

export default Contact;