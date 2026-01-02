import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Package, Truck, RotateCcw, Shield, User, HelpCircle, Mail, Phone } from 'lucide-react';

const FAQs = () => {
  const [openItems, setOpenItems] = useState(new Set());

  useEffect(() => {
    document.title = 'Frequently Asked Questions | aarovi';
  }, []);

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    newOpenItems.has(index) ? newOpenItems.delete(index) : newOpenItems.add(index);
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    {
      title: "Orders & Shopping",
      icon: Package,
      faqs: [
        { question: "How do I place an order?", answer: "Browse our collection, add to cart, and checkout securely. You'll need an account or guest checkout to complete your purchase." },
        { question: "Can I modify or cancel my order?", answer: "Yes, within 2 hours of placing it. After that, contact support — we'll try our best before the order is processed." },
        { question: "What payment methods do you accept?", answer: "We accept cards, UPI, net banking, and major wallets — all secured with modern encryption." },
        { question: "Do you offer bulk or wholesale pricing?", answer: "Yes, for custom or bulk orders. Email us at aharyasofficial@gmail.com for a tailored quote." }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: Truck,
      faqs: [
        { question: "What are your shipping charges?", answer: "Free shipping on orders above ₹999. For smaller orders, minimal delivery charges apply based on your location." },
        { question: "How long does delivery take?", answer: "0–7 business days for domestic orders. Timelines may vary based on courier and destination." },
        { question: "Do you ship internationally?", answer: "Yes, worldwide shipping available through trusted courier partners with tracking and insurance." },
        { question: "Can I track my order?", answer: "Absolutely! You'll receive a tracking link via email once your order ships." }
      ]
    },
    {
      title: "Returns & Refunds",
      icon: RotateCcw,
      faqs: [
        { question: "What is your return policy?", answer: "We accept returns within 15 days for unused items in original packaging. Personalized pieces may not qualify." },
        { question: "How do I initiate a return?", answer: "Email us at aharyasofficial@gmail.com with your order details and reason. We'll guide you through it." },
        { question: "When will I receive my refund?", answer: "Within 5–7 business days after we receive and verify the return." },
        { question: "Do you offer exchanges?", answer: "Yes — for size, color, or variant swaps (subject to availability)." }
      ]
    },
    {
      title: "Products & Quality",
      icon: Shield,
      faqs: [
        { question: "Are your products authentic handcrafted items?", answer: "100%. Each piece is made by skilled artisans with authentic materials and craftsmanship." },
        { question: "How do you ensure product quality?", answer: "Every item undergoes strict quality checks before shipping — handcrafted doesn't mean imperfect here." },
        { question: "Can I see more product images or details?", answer: "Yes! Check product pages or contact us for custom photos or artisan details." },
        { question: "Do you offer custom or personalized items?", answer: "Yes, custom handcrafted pieces are available upon request." }
      ]
    },
    {
      title: "Account & Support",
      icon: User,
      faqs: [
        { question: "How do I create an account?", answer: "Click 'Sign Up' on top of any page or create one during checkout — quick and easy." },
        { question: "I forgot my password. How do I reset it?", answer: "Click 'Forgot Password', enter your email, and follow the reset link we send you." },
        { question: "Is my personal information secure?", answer: "Yes. All data is encrypted and protected — we never share it without consent." },
        { question: "How can I contact customer support?", answer: "Email aaroviofficial@gmail.com or call +91 9399336666 (Mon–Sat, 9AM–6PM)." }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-text/70 font-light leading-relaxed max-w-3xl mx-auto">
            Everything you need to know about Aharyas — from orders to quality and beyond.
          </p>
        </div>
      </div>

      {/* FAQ Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {faqCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <div key={categoryIndex}>
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary/70 to-secondary/80 rounded-full flex items-center justify-center">
                      <IconComponent className="text-white" size={24} />
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2C1810]">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const itemIndex = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openItems.has(itemIndex);
                    return (
                      <div
                        key={faqIndex}
                        className="bg-white rounded-lg shadow-sm border border-background hover:shadow-md transition-all"
                      >
                        <button
                          className="w-full px-6 py-5 text-left flex justify-between items-center"
                          onClick={() => toggleItem(itemIndex)}
                        >
                          <span className="font-serif font-semibold text-lg text-text pr-4">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp size={20} className="text-text flex-shrink-0" />
                          ) : (
                            <ChevronDown size={20} className="text-text flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 border-t border-background">
                            <p className="text-text/80 leading-relaxed pt-4">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/70 to-secondary/80 rounded-full flex items-center justify-center">
                <HelpCircle className="text-white" size={24} />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-text/90 mb-4">
              Need More Help?
            </h2>
            <p className="text-text/70 leading-relaxed max-w-2xl mx-auto text-lg">
              Couldn't find your answer? Our support team is here to help you with any queries about our handcrafted collection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center hover:shadow-md transition-shadow">
              <Mail className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-3">Email Support</h4>
              <p className="text-lg text-text mb-1">aaroviofficial@gmail.com</p>
              <p className="text-sm text-text/60 mt-2">Response within 24 hours</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center hover:shadow-md transition-shadow">
              <Phone className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-3">Helpdesk Phone</h4>
              <p className="text-lg text-text mb-1">+91 9399336666</p>
              <p className="text-sm text-text/60 mt-2">Mon–Sat: 9 AM – 6 PM IST</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Support */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-text mb-4">
              Quick Support Topics
            </h2>
            <p className="text-text/70 text-lg">Common areas where we can assist you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Package, title: "Order Issues", text: "Problems with placing or tracking orders" },
              { icon: Truck, title: "Shipping Questions", text: "Delivery times and shipping policies" },
              { icon: RotateCcw, title: "Returns & Refunds", text: "Return process and refund status" }
            ].map(({ icon: Icon, title, text }, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-sm border border-background hover:shadow-md transition-all text-center">
                <Icon className="text-secondary mx-auto mb-4" size={28} />
                <h4 className="font-serif font-semibold text-text mb-2 text-lg">{title}</h4>
                <p className="text-sm text-text/70 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-secondary/90 to-secondary/80 text-white p-10 rounded-lg max-w-4xl mx-auto text-center shadow-lg">
            <h3 className="font-serif text-2xl font-semibold mb-4">Professional Support Team</h3>
            <p className="leading-relaxed text-white/90 text-lg">
              Our team understands the value of handcrafted artistry and ensures every Aharyas purchase brings satisfaction and pride.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;