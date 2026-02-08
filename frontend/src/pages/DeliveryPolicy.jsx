import React, { useEffect } from 'react';
import { Truck, Globe, Package, Clock, MapPin, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const ShippingDeliveryPolicy = () => {
  useEffect(() => {
    document.title = 'Shipping & Delivery Policy | Aarovi'
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            Shipping & Delivery
          </h1>
          <p className="text-lg sm:text-xl text-text/70 mb-8 max-w-3xl mx-auto font-light">
            We ensure your handcrafted Aarovi pieces reach you safely and promptly, whether you're in India or anywhere across the globe.
          </p>
        </div>
      </div>

      {/* Shipping Methods */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Shipping Methods</h2>
            <p className="text-text/70 mt-4 max-w-2xl mx-auto">
              We partner with trusted courier services to deliver your orders safely
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* International Shipping */}
            <div className="bg-white rounded-lg shadow-sm border border-background overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-background/20 to-primary p-6 border-b border-background">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center">
                    <Globe size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-text">International Shipping</h3>
                    <p className="text-sm text-text/60">Worldwide Delivery</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-text/80 font-light leading-relaxed">
                  For our global customers, we ship through registered international courier companies and international speed post services.
                </p>
                
                <div className="bg-gradient-to-br from-background/20 to-primary p-5 rounded-lg">
                  <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-secondary" />
                    Available Services
                  </h4>
                  <ul className="space-y-2 text-sm text-text/80">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Registered International Courier Companies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>International Speed Post</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Tracking & Insurance Included</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    All international shipments include tracking and insurance for your peace of mind.
                  </p>
                </div>
              </div>
            </div>

            {/* Domestic Shipping */}
            <div className="bg-white rounded-lg shadow-sm border border-background overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-background/20 to-primary p-6 border-b border-background">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center">
                    <MapPin size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-text">Domestic Shipping</h3>
                    <p className="text-sm text-text/60">All Across India</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-text/80 font-light leading-relaxed">
                  Within India, we ensure reliable delivery through registered domestic courier companies and speed post services.
                </p>
                
                <div className="bg-gradient-to-br from-background/20 to-primary p-5 rounded-lg">
                  <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-secondary" />
                    Available Services
                  </h4>
                  <ul className="space-y-2 text-sm text-text/80">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Registered Domestic Courier Companies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Speed Post Services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Coverage Across Major Cities & Towns</span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-start gap-2 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    Fast and secure delivery across all major cities and towns in India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processing Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Clock className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Processing Timeline</h2>
            <p className="text-text/70 mt-4 max-w-2xl mx-auto">
              Your order journey from confirmation to delivery
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg border border-background overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-background to-primary p-10 text-center">
                <div className="inline-block mb-4">
                  <div className="text-6xl font-serif font-bold text-secondary">0-7</div>
                  <div className="text-xl font-semibold text-text mt-2">Business Days</div>
                </div>
                <h3 className="text-2xl font-serif font-semibold text-text mb-3">Order Processing & Shipping</h3>
                <p className="text-text/70 font-light leading-relaxed max-w-2xl mx-auto">
                  Orders are processed and shipped within 0-7 days from order confirmation, 
                  or as per the delivery date agreed at the time of order placement.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-background text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={28} className="text-secondary" />
                </div>
                <h4 className="font-serif font-semibold text-text mb-2">Order Confirmation</h4>
                <p className="text-sm text-text/60">Within 24 hours of payment verification</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-background text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={28} className="text-secondary" />
                </div>
                <h4 className="font-serif font-semibold text-text mb-2">Processing Time</h4>
                <p className="text-sm text-text/60">0-7 days preparation and quality check</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-background text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck size={28} className="text-secondary" />
                </div>
                <h4 className="font-serif font-semibold text-text mb-2">Shipment</h4>
                <p className="text-sm text-text/60">Handed to courier with tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Important Information</h2>
            <p className="text-text/70 mt-4 max-w-2xl mx-auto">
              Please read these important shipping details carefully
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-background">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-secondary" />
                </div>
                <h3 className="font-serif font-semibold text-text">Delivery Responsibility</h3>
              </div>
              <p className="text-sm text-text/70 leading-relaxed">
                <strong className="text-text">Aarovi is not liable for delays by courier companies.</strong> We guarantee to hand over your order to the courier within the specified timeframe from confirmation and payment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-background">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-secondary" />
                </div>
                <h3 className="font-serif font-semibold text-text">Delivery Address</h3>
              </div>
              <p className="text-sm text-text/70 leading-relaxed">
                All orders are delivered to the address you provide during checkout. Please ensure your address is complete and accurate to avoid delays.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-background">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-background/30 to-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-secondary" />
                </div>
                <h3 className="font-serif font-semibold text-text">Tracking Information</h3>
              </div>
              <p className="text-sm text-text/70 leading-relaxed">
                You'll receive tracking information via email once your order is dispatched. Use this to monitor your package's journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary mb-4">Need Shipping Support?</h2>
            <p className="text-text/70 max-w-2xl mx-auto">
              For any issues with your shipment or delivery, our customer support team is ready to assist you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center">
              <Phone className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-3">Phone Support</h4>
              <p className="text-xl text-text mb-2">+91 7416964805</p>
              <p className="text-sm text-text/60">Mon-Sat: 9 AM - 6 PM</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center">
              <Mail className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-3">Email Support</h4>
              <p className="text-xl text-text mb-2">aaroviofficial@gmail.com</p>
              <p className="text-sm text-text/60">Response within 24 hours</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-gradient-to-r from-background to-primary p-10 rounded-lg text-center shadow-lg">
            <Package className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-semibold text-text mb-4">Track Your Order</h3>
            <p className="text-text/90 leading-relaxed">
              Once your order is shipped, you'll receive a tracking number via email. 
              Use this number to track your package's journey from our facility to your doorstep.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingDeliveryPolicy;