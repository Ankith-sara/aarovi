import React, { useEffect } from 'react';
import { Scale, FileText, AlertTriangle, Shield, Link, CreditCard, User, ShoppingCart, Gavel, Mail, Phone, ArrowRight } from 'lucide-react';

const TermsConditions = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions | Aarovi'
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            Terms & Conditions
          </h1>
          <p className="text-lg sm:text-xl text-text/70 mb-8 max-w-3xl mx-auto font-light">
            These terms outline the rules and guidelines for using Aarovi's website, services, and purchasing our handcrafted and custom-made fashion products.
          </p>
        </div>
      </div>

      {/* Company Information */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Company Information</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E8DCC4]">
              <p className="text-text/80 leading-relaxed mb-6">
                These terms and conditions apply to AAROVI and all users interacting with our platform, products, or services.
              </p>
              <div className="bg-gradient-to-br from-background/30 to-primary p-6 rounded-lg">
                <h4 className="font-serif font-semibold text-text mb-3">Legal Entity</h4>
                <p className="font-medium text-text">AAROVI FASHIONS</p>
                <p className="text-sm text-text/70 mt-3">
                  Registered / Operational Address:<br />
                  Hyderabad, Telangana - 502345, India
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-background/20 to-primary p-8 rounded-lg shadow-sm border border-[#E8DCC4]">
              <h3 className="font-serif font-semibold text-text mb-6 text-xl">Definitions</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-text">"We", "Us", "Our"</p>
                  <p className="text-text/70 text-sm">Refers to Aarovi / Aarovi Fashions</p>
                </div>
                <div>
                  <p className="font-semibold text-text">"You", "User", "Customer"</p>
                  <p className="text-text/70 text-sm">Any individual accessing our website or purchasing our products</p>
                </div>
                <div>
                  <p className="font-semibold text-text">"Services"</p>
                  <p className="text-text/70 text-sm">Website features, product catalog, customization tools, consultation services, and customer support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Website Usage Terms */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Scale className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Website Usage Terms</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: FileText,
                title: "Content Updates",
                description: "Aarovi reserves the right to update or modify website content, pricing, or product availability at any time without prior notice."
              },
              {
                icon: AlertTriangle,
                title: "Accuracy of Information",
                description: "While we ensure all details are accurate, Aarovi does not guarantee completeness, reliability, or error-free information on the website."
              },
              {
                icon: User,
                title: "User Responsibilities",
                description: "You are responsible for maintaining the confidentiality of your account details and for all actions performed under your account."
              },
              {
                icon: Shield,
                title: "Prohibited Activities",
                description: "Illegal or fraudulent activity, uploading malicious code, or attempting to misuse website features or data."
              },
              {
                icon: Link,
                title: "Third-Party Links",
                description: "Aarovi is not responsible for the content, safety, or policies of external websites linked on our platform."
              },
              {
                icon: Gavel,
                title: "Governing Law",
                description: "All disputes fall under the jurisdiction of Hyderabad, Telangana (India)."
              }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-lg shadow-sm border border-background hover:shadow-md transition-shadow">
                <item.icon className="w-8 h-8 text-secondary mb-4" />
                <h3 className="font-serif font-semibold text-text mb-3">{item.title}</h3>
                <p className="text-text/70 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Terms */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Purchase Terms</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-lg shadow-sm border border-background">
              <p className="text-text/80 leading-relaxed mb-6">
                By placing an order with Aarovi, you agree to provide accurate and complete purchase details.
              </p>
              <div className="bg-gradient-to-br from-background/30 to-primary p-6 rounded-lg">
                <h4 className="font-serif font-semibold text-[#2C1810] mb-4">Order Process</h4>
                <ul className="space-y-2 text-sm text-[#2C1810]/80">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                    Order confirmation within 24 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                    Payment verification
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                    Product preparation (0–7 days depending on design)
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                    Shipping with tracking information
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-background/20 to-primary p-8 rounded-lg shadow-sm border border-[#E8DCC4]">
              <CreditCard className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-serif font-semibold text-text mb-4 text-xl">Payment Terms</h3>
              <p className="text-text/80 text-sm leading-relaxed mb-6">
                Orders may be cancelled if fraudulent activity or unauthorized payment is detected.
              </p>
              <div className="bg-white/60 p-5 rounded-lg">
                <h4 className="font-semibold text-text mb-3">Accepted Payment Methods:</h4>
                <ul className="space-y-2 text-sm text-text/80">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    UPI
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    Debit/Credit Cards
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    Digital Wallets
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                    Bank Transfers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liability & Disclaimer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Liability & Disclaimer</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertTriangle,
                title: "Limitation of Liability",
                description: "Aarovi shall not be held responsible for any direct or indirect damages arising from website usage, order processing, or product handling."
              },
              {
                icon: Shield,
                title: "Product Disclaimer",
                description: "Handmade and custom-designed pieces may have natural variations. We ensure accurate product images and descriptions to help you make informed decisions."
              },
              {
                icon: Scale,
                title: "Force Majeure",
                description: "Aarovi is not liable for delays or failures caused by events outside our control, such as natural disasters, transportation issues, or unexpected disruptions."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-background">
                <item.icon className="w-8 h-8 text-secondary mb-4" />
                <h3 className="font-serif font-semibold text-text mb-3">{item.title}</h3>
                <p className="text-text/70 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Data Protection */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Privacy & Data Protection</h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <p className="text-center text-text/80 text-lg mb-10 leading-relaxed">
              Aarovi values your privacy and follows strict measures to protect your personal information.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-background">
                <h4 className="font-serif font-semibold text-text mb-5 text-lg">Information We Collect</h4>
                <ul className="space-y-3 text-sm text-text/80">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    Name, email, and phone number
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    Shipping & billing addresses
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    Payment details (encrypted)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    Browsing and order history
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-background/20 to-primary p-8 rounded-lg shadow-sm border border-background">
                <h4 className="font-serif font-semibold text-text mb-5 text-lg">How We Use Your Data</h4>
                <ul className="space-y-3 text-sm text-text/80">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    To process orders
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    To provide customer support
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    To improve our services
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    Marketing (only with consent)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary mb-4">Questions About These Terms?</h2>
            <p className="text-text/70 text-lg max-w-2xl mx-auto">
              We're here to help. Contact Aarovi support anytime for clarity regarding these terms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center">
              <Phone className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-2">Phone Support</h4>
              <p className="text-xl text-text mb-1">+91 9399336666</p>
              <p className="text-sm text-text/60">Mon–Sat: 9 AM – 6 PM</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center">
              <Mail className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-2">Email Support</h4>
              <p className="text-xl text-text mb-1">aaroiviofficial@gmail.com</p>
              <p className="text-sm text-text/60">Reply within 24 hours</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-background to-primary text-text p-10 rounded-lg max-w-3xl mx-auto text-center shadow-lg">
            <h3 className="font-serif text-2xl font-semibold mb-4">Agreement to Terms</h3>
            <p className="leading-relaxed text-text/90">
              By using our website and services, you acknowledge that you have read and agreed to these Terms & Conditions. Continued use after updates constitutes acceptance of all changes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;