import React from 'react';
import { Scissors, Truck, RefreshCw, MessageCircle } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Scissors,
      title: 'Custom Tailoring',
      description: 'Expert tailoring services to ensure a perfect fit for your handcrafted ethnic wear.'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Enjoy free shipping on all orders above ₹2000 across India.'
    },
    {
      icon: MessageCircle,
      title: 'Style Consultation',
      description: 'Get personalized styling advice from our fashion experts.'
    }
  ];

  return (
    <section className="bg-gradient-to-b from-white to-background py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-3">
            Our Services
          </h2>
          <p className="text-text/60 font-light max-w-2xl mx-auto">
            Exceptional services designed to enhance your Aasvi shopping experience
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="group text-center p-8 rounded-xl bg-white border border-background hover:shadow-xl hover:border-secondary transition-all duration-300"
              >
                {/* Icon Container */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-background/30 to-primary group-hover:from-secondary group-hover:to-secondary/80 group-hover:scale-110 transition-all duration-300 mb-5 shadow-md">
                  <Icon className="w-10 h-10 text-secondary group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-serif font-semibold text-text mb-3 group-hover:text-secondary transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text/60 font-light leading-relaxed">
                  {service.description}
                </p>

                {/* Decorative Line */}
                <div className="mt-5 pt-4 border-t border-background/30">
                  <div className="w-12 h-1 bg-secondary rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;