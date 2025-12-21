import React, { useEffect } from 'react';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import { MapPin, Phone, Mail, Briefcase, Clock, Send, Users, MessageCircle } from 'lucide-react';

const Contact = () => {
  useEffect(() => {
    document.title = 'Contact Customer Service | Aasvi'
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-b from-background to-white px-4 sm:px-6 lg:px-8 py-32 sm:py-40 overflow-hidden">
        {/* Content */}
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            Get in Touch
          </h1>
          <div className="w-24 h-1 bg-secondary mx-auto mb-8"></div>
          <p className="text-xl sm:text-2xl text-text/90 max-w-4xl mx-auto font-light leading-relaxed">
            We believe in the power of connection — between artisan and buyer, tradition and modernity, story and style. At Aasvi, every conversation matters.
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <img
                  className="w-full h-[500px] object-cover"
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
                  alt="Aasvi Contact"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/30 to-transparent"></div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-secondary rounded-lg"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border-2 border-secondary rounded-lg"></div>
            </div>

            {/* Content Side */}
            <div>
              <div className="mb-8">
                <MessageCircle className="w-12 h-12 text-secondary mb-4" />
                <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text mb-6">
                  We're Here to Help
                </h2>
              </div>

              <div className="space-y-5 text-text/80 text-lg leading-relaxed font-light">
                <p>
                  Whether you have questions about our handcrafted pieces, need assistance with your order, or want to learn more about the artisans behind your favorite garments, we're here to help.
                </p>
                <p>
                  Our customer service team understands that each Aasvi piece carries a story, and we're committed to ensuring your experience with us is as meaningful as the craftsmanship we celebrate.
                </p>
                <p>
                  From styling advice to order tracking, size consultations to custom requests, our dedicated team is ready to assist you with all your needs.
                </p>
                <div className="bg-gradient-to-br from-background/30 to-primary p-6 rounded-lg border-l-4 border-secondary mt-8">
                  <p className="text-xl italic text-text font-light">
                    "Every question is an opportunity to share our passion for heritage craft and conscious fashion."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-text mb-4">
              How to Reach Us
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-xl text-text/70 font-light max-w-2xl mx-auto">
              Choose your preferred way to connect with our team
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Visit Us Card */}
            <div className="group relative">
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-background h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-background/30 to-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="text-secondary" size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-text">Visit Us</h3>
                </div>
                
                <div className="w-16 h-1 bg-secondary mb-6"></div>
                
                <div className="space-y-3 text-text/70 font-light">
                  <p className="font-medium text-text">Our Studio</p>
                  <p>Hyderabad, Telangana</p>
                  <p className="font-semibold text-secondary text-lg">PIN: 502345</p>
                </div>
              </div>
              {/* Decorative corner */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 border-2 border-secondary/20 rounded-lg -z-10"></div>
            </div>

            {/* Call Us Card */}
            <div className="group relative">
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-background h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-background/30 to-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="text-secondary" size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-text">Call Us</h3>
                </div>
                
                <div className="w-16 h-1 bg-secondary mb-6"></div>
                
                <div className="space-y-3 text-text/70 font-light">
                  <p className="font-medium text-text">Customer Service</p>
                  <a href="tel:+91939933666" className="block text-lg font-semibold text-secondary hover:text-[#8B6F47] transition-colors">
                    +91 9399336666
                  </a>
                  <div className="flex items-center gap-2 text-sm text-text/50 pt-2">
                    <Clock size={14} />
                    <span>Mon - Sat: 9 AM - 6 PM</span>
                  </div>
                </div>
              </div>
              {/* Decorative corner */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 border-2 border-secondary/20 rounded-lg -z-10"></div>
            </div>

            {/* Email Us Card */}
            <div className="group relative md:col-span-2 lg:col-span-1">
              <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-background h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-background/30 to-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="text-secondary" size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-text">Email Us</h3>
                </div>
                
                <div className="w-16 h-1 bg-secondary mb-6"></div>
                
                <div className="space-y-3 text-text/70 font-light">
                  <p className="font-medium text-text">General Inquiries</p>
                  <a href="mailto:aharyasofficial@gmail.com" className="block text-lg font-semibold text-secondary hover:text-[#8B6F47] transition-colors break-all">
                    aasviofficial@gmail.com
                  </a>
                  <div className="flex items-center gap-2 text-sm text-text/50 pt-2">
                    <Send size={14} />
                    <span>We respond within 24 hours</span>
                  </div>
                </div>
              </div>
              {/* Decorative corner */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 border-2 border-secondary/20 rounded-lg -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-background">
        <NewsletterBox />
      </section>
    </div>
  );
};

export default Contact;