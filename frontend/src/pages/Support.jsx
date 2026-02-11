import React, { useEffect } from 'react';
import { Phone, Mail, Clock, HelpCircle, Truck, RefreshCw, CreditCard, MapPin, MessageCircle, CheckCircle } from 'lucide-react';

const Support = () => {
  useEffect(() => {
    document.title = 'Customer Support | Aarovi'
  });

  const supportCategories = [
    {
      icon: Truck,
      title: "Orders & Shipping",
      description: "Track orders, shipping updates, delivery issues",
      topics: ["Order status", "Tracking", "Delivery delays", "Shipping charges"]
    },
    {
      icon: RefreshCw,
      title: "Returns & Exchanges",
      description: "Return requests, refund status, exchange policies",
      topics: ["Return policy", "Refund status", "Exchange requests", "Return pickup"]
    },
    {
      icon: CreditCard,
      title: "Payment & Billing",
      description: "Payment issues, billing queries, transaction problems",
      topics: ["Payment failed", "Refund queries", "Invoice requests", "Payment methods"]
    },
    {
      icon: HelpCircle,
      title: "General Support",
      description: "Account issues, technical problems, product queries",
      topics: ["Account access", "Technical issues", "Product information", "Website problems"]
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            Customer Support
          </h1>
          <p className="text-lg sm:text-xl text-text/70 mb-8 max-w-3xl mx-auto font-light">
            We're here to help! Get in touch with our support team for assistance with orders, returns, or any questions about your handcrafted Aarovi experience.
          </p>
        </div>
      </div>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Get In Touch</h2>
            <p className="text-text/70 mt-4 max-w-2xl mx-auto">
              Choose your preferred way to reach us. Our team is ready to assist you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-background hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-background/30 to-primary rounded-xl flex items-center justify-center">
                  <Phone className="text-secondary" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-semibold text-text">Phone Support</h3>
                  <p className="text-sm text-text/60">Speak with our team</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-background/20 to-primary p-5 rounded-lg">
                  <p className="text-2xl font-serif font-semibold text-text mb-2">+91 7416964805</p>
                  <div className="flex items-center text-sm text-text/70">
                    <Clock size={16} className="mr-2" />
                    <span>Mon-Sat: 9:00 AM - 6:00 PM IST</span>
                  </div>
                </div>
                <p className="text-sm text-text/70 italic">Direct assistance for urgent matters</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-background hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-background/30 to-primary rounded-xl flex items-center justify-center">
                  <Mail className="text-secondary" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-semibold text-text">Email Support</h3>
                  <p className="text-sm text-text/60">Get detailed assistance</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-background/20 to-primary p-5 rounded-lg">
                  <p className="text-xl font-serif font-semibold text-text mb-2">aaroiviofficial@gmail.com</p>
                  <p className="text-sm text-text/70">Response within 24 hours</p>
                </div>
                <p className="text-sm text-text/70 italic">Perfect for detailed inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">How Can We Help?</h2>
            <p className="text-text/70 mt-4 max-w-2xl mx-auto">
              Find quick answers and support for common inquiries
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {supportCategories.map((category, index) => {
              const IconComponent = category.icon;

              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-background hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-background/30 to-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="text-secondary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-text mb-1">{category.title}</h3>
                      <p className="text-sm text-text/70">{category.description}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-background/20 to-primary p-5 rounded-lg">
                    <h4 className="font-semibold text-text mb-3 text-sm">Common Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-3 py-1.5 bg-white text-xs text-text/80 rounded-full font-medium border border-background shadow-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-background/40 to-primary p-10 rounded-lg shadow-sm border border-background">
              <div className="text-center mb-10">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-secondary" />
                <h3 className="text-2xl font-serif font-semibold text-text mb-3">Quick Tips for Faster Support</h3>
                <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <p className="text-text/80 font-light">Include your <span className="font-semibold">order number</span> for order-related inquiries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <p className="text-text/80 font-light">Provide <span className="font-semibold">screenshots</span> for technical issues</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <p className="text-text/80 font-light">Check our <span className="font-semibold">FAQ page</span> first - your question might already be answered</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">4</span>
                    </div>
                    <div>
                      <p className="text-text/80 font-light">Be as <span className="font-semibold">specific as possible</span> about your issue</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary mb-4">Professional Support Team</h2>
            <p className="text-text/70 max-w-2xl mx-auto leading-relaxed">
              Our dedicated customer support team understands the value of handcrafted artistry and
              is committed to ensuring your complete satisfaction with every Aarovi purchase.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center">
              <Phone className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-3">Phone Support</h4>
              <p className="text-xl text-text mb-2">+91 7416964805</p>
              <p className="text-sm text-text/60">Mon-Sat: 9 AM - 6 PM</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center">
              <Mail className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-3">Email Support</h4>
              <p className="text-xl text-text mb-2">aaroiviofficial@gmail.com</p>
              <p className="text-sm text-text/60">Response within 24 hours</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center">
              <MapPin className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-3">Address</h4>
              <p className="text-sm text-text/80 leading-relaxed">
                Hyderabad, Telangana<br />
                India
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-serif text-2xl font-semibold text-text mb-4">Always Here to Help</h3>
            <p className="text-text/90 leading-relaxed">
              Whether you have questions about our handcrafted collection, need help with an order,
              or want to learn more about our artisan partners, we're committed to providing
              exceptional customer service every step of the way.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;