import React from 'react';
import { Scissors, Truck, MessageCircle, RotateCcw } from 'lucide-react';

const services = [
  {
    icon: Scissors,
    title: 'Custom Tailoring',
    description: 'Expert tailoring for a perfect fit on every handcrafted piece.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free delivery on all orders above ₹2,000 anywhere in India.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Hassle-free returns within 30 days. No questions asked.',
  },
  {
    icon: MessageCircle,
    title: 'Style Consultation',
    description: 'Personalised styling advice from our in-house fashion experts.',
  },
];

const Services = () => (
  <section className="bg-gradient-to-b from-white to-background/30 py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-3">Why Aarovi</p>
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-text">Our Services</h2>
        <div className="w-12 h-[2px] bg-secondary mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group text-center p-7 rounded-2xl bg-white border border-gray-100 hover:border-secondary/30 hover:shadow-xl transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/8 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300 mb-5 shadow-sm">
              <Icon className="w-7 h-7 text-secondary group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-sm text-text mb-2">{title}</h3>
            <p className="text-text/55 text-xs leading-relaxed font-light">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
