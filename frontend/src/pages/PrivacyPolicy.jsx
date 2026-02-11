import React, { useEffect } from 'react';
import { Shield, Eye, Lock, Cookie, Database, Settings, AlertCircle, Mail, Phone, MapPin, Bell, UserCheck, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Aarovi'
  });

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl text-text/70 mb-8 max-w-3xl mx-auto font-light">
            Your privacy matters to us. This policy explains how Aarovi collects, uses, and protects your personal information when you visit our website or purchase our handcrafted fashion products.
          </p>
        </div>
      </div>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Our Commitment to Privacy</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E8DCC4]">
              <p className="text-text/80 leading-relaxed mb-6">
                Aarovi Fashions is committed to ensuring that your privacy is protected. When you provide information that identifies you on our website, you can be assured it will only be used in accordance with this privacy statement.
              </p>
              <div className="bg-gradient-to-br from-background/30 to-primary p-6 rounded-lg">
                <h4 className="font-serif font-semibold text-text mb-3">About This Policy</h4>
                <p className="text-sm text-text/80">
                  This privacy policy sets out how Aarovi Fashions uses and protects any information 
                  you provide when you visit our website and/or agree to purchase from us.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-background/20 to-primary p-8 rounded-lg shadow-sm border border-[#E8DCC4]">
              <AlertCircle className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-serif font-semibold text-text mb-4 text-xl">Policy Updates</h3>
              <p className="text-text/70 leading-relaxed">
                We may change this policy from time to time by updating this page. 
                You should check this page periodically to ensure that you adhere to these changes. 
                Your continued use of our services after any modifications constitutes acceptance of the updated policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Database className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Information We Collect</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-background">
              <UserCheck className="w-10 h-10 text-secondary mb-4" />
              <h3 className="font-serif font-semibold text-text mb-5 text-xl">Personal Information</h3>
              <p className="text-text/70 text-sm mb-4">We may collect the following information:</p>
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-background/30 to-primary p-4 rounded-lg">
                  <p className="font-semibold text-text text-sm mb-1">Name & Contact Details</p>
                  <p className="text-xs text-text/70">For order processing and communication</p>
                </div>
                <div className="bg-gradient-to-br from-background/30 to-primary p-4 rounded-lg">
                  <p className="font-semibold text-text text-sm mb-1">Email Address</p>
                  <p className="text-xs text-text/70">For order updates and customer support</p>
                </div>
                <div className="bg-gradient-to-br from-background/30 to-primary p-4 rounded-lg">
                  <p className="font-semibold text-text text-sm mb-1">Shipping Information</p>
                  <p className="text-xs text-text/70">Including address, postcode, and delivery preferences</p>
                </div>
                <div className="bg-gradient-to-br from-background/30 to-primary p-4 rounded-lg">
                  <p className="font-semibold text-text text-sm mb-1">Payment Details</p>
                  <p className="text-xs text-text/70">Securely encrypted for transaction processing</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-background">
                <Eye className="w-10 h-10 text-secondary mb-4" />
                <h3 className="font-serif font-semibold text-text mb-5 text-xl">When We Collect Information</h3>
                <div className="space-y-3 text-sm text-text/80">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <p>When you create an account on our website</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <p>During the purchase and checkout process</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <p>When you subscribe to our newsletter or updates</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <p>When you participate in surveys or provide feedback</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <p>When you contact our customer support team</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-background/20 to-primary p-8 rounded-lg shadow-sm border border-background">
                <Lock className="w-10 h-10 text-secondary mb-4" />
                <h3 className="font-serif font-semibold text-text mb-4 text-xl">Information Security</h3>
                <p className="text-text/70 text-sm leading-relaxed">
                  We are committed to ensuring that your information is secure. To prevent unauthorized access 
                  or disclosure, we have implemented suitable physical, electronic, and managerial procedures 
                  to safeguard and secure the information we collect online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Settings className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">How We Use Your Information</h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <p className="text-center text-text/80 text-lg mb-10 leading-relaxed">
              We require this information to understand your needs and provide you with better service, particularly for the following reasons:
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  title: "Internal Record Keeping",
                  description: "Maintaining accurate customer records and order history"
                },
                {
                  icon: Settings,
                  title: "Service Improvement",
                  description: "Enhancing our products, website, and customer experience"
                },
                {
                  icon: Bell,
                  title: "Promotional Communications",
                  description: "Sending emails about new collections, special offers, and updates"
                },
                {
                  icon: Eye,
                  title: "Market Research",
                  description: "Understanding customer preferences and fashion trends"
                },
                {
                  icon: UserCheck,
                  title: "Personalization",
                  description: "Customizing the website according to your interests and style"
                },
                {
                  icon: Shield,
                  title: "Order Processing",
                  description: "Fulfilling your custom-made and handcrafted orders efficiently"
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
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Cookie className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">How We Use Cookies</h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white p-10 rounded-lg shadow-sm border border-background mb-8">
              <p className="text-text/80 leading-relaxed text-lg mb-6">
                A cookie is a small file which asks permission to be placed on your computer's hard drive. 
                Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-background/30 to-primary p-6 rounded-lg">
                  <h4 className="font-serif font-semibold text-text mb-4">What Cookies Do</h4>
                  <ul className="space-y-2 text-sm text-text/80">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Allow web applications to respond to you as an individual</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Tailor operations to your needs, likes, and dislikes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Gather and remember information about your preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Help us analyze webpage traffic and improve our website</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-background/30 to-primary p-6 rounded-lg">
                  <h4 className="font-serif font-semibold text-text mb-4">Traffic Log Cookies</h4>
                  <p className="text-sm text-text/80 leading-relaxed">
                    We use traffic log cookies to identify which pages are being used. This helps us analyze 
                    data about webpage traffic and improve our website to tailor it to customer needs. 
                    We only use this information for statistical analysis purposes and then the data is removed from the system.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-background to-primary p-8 rounded-lg shadow-sm border border-background">
              <h4 className="font-serif font-semibold text-text mb-4 text-lg">Your Cookie Choices</h4>
              <p className="text-sm text-text/80 leading-relaxed">
                You can choose to accept or decline cookies. Most web browsers automatically accept cookies, 
                but you can usually modify your browser setting to decline cookies if you prefer. 
                This may prevent you from taking full advantage of the website. A cookie in no way gives us 
                access to your computer or any information about you, other than the data you choose to share with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Settings className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Controlling Your Personal Information</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-background">
              <h3 className="font-serif font-semibold text-text mb-6 text-xl">Your Rights & Choices</h3>
              
              <p className="text-text/80 mb-6 leading-relaxed">
                You may choose to restrict the collection or use of your personal information in the following ways:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-background/30 to-primary p-5 rounded-lg">
                  <h4 className="font-semibold text-text mb-3">Restricting Data Collection</h4>
                  <ul className="space-y-2 text-sm text-text/80">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Look for opt-out boxes when filling forms on our website</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Indicate if you don't want information used for direct marketing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Change your mind at any time by contacting us</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Update your preferences through your account settings</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-background">
                <Shield className="w-10 h-10 text-secondary mb-4" />
                <h3 className="font-serif font-semibold text-text mb-4 text-xl">Third-Party Information Sharing</h3>
                
                <div className="bg-gradient-to-br from-background/20 to-primary p-6 rounded-lg mb-4">
                  <h4 className="font-semibold text-text mb-3">Our Promise</h4>
                  <p className="text-sm text-text/80 leading-relaxed">
                    <strong>We will not sell, distribute, or lease your personal information to third parties</strong> 
                    unless we have your permission or are required by law to do so. We may use your personal 
                    information to send you promotional information about third parties which we think you may 
                    find interesting if you tell us that you wish this to happen.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-background/20 to-primary p-8 rounded-lg shadow-sm border border-background">
                <h3 className="font-serif font-semibold text-text mb-4 text-xl">Data Accuracy</h3>
                <p className="text-sm text-text/80 leading-relaxed">
                  If you believe that any information we are holding about you is incorrect or incomplete, 
                  please contact us as soon as possible. We will promptly correct any information found to be incorrect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Bell className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Marketing Communications</h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <p className="text-center text-text/80 text-lg mb-10 leading-relaxed">
              We may periodically send promotional emails about new collections, special offers, or other information 
              which we think you may find interesting using the email address you have provided.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-background">
                <h3 className="font-serif font-semibold text-text mb-5 text-lg">Communication Methods</h3>
                <p className="text-sm text-text/80 mb-4">
                  From time to time, we may also use your information to contact you for market research purposes. 
                  We may contact you by:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-gradient-to-br from-background/30 to-primary p-4 rounded-lg">
                    <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-sm text-text">Email</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gradient-to-br from-background/30 to-primary p-4 rounded-lg">
                    <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-sm text-text">Phone</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-background/20 to-primary p-8 rounded-lg shadow-sm border border-background">
                <h3 className="font-serif font-semibold text-text mb-5 text-lg">Opt-Out Options</h3>
                <p className="text-sm text-text/80 leading-relaxed">
                  If you have previously agreed to us using your personal information for direct marketing purposes, 
                  you may change your mind at any time by writing to or emailing us at:
                </p>
                <div className="mt-4 p-4 bg-white/60 rounded-lg">
                  <p className="text-text font-semibold">aaroviofficial@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary mb-4">Contact Us About Privacy</h2>
            <p className="text-text/70 text-lg max-w-2xl mx-auto">
              If you believe that any information we are holding about you is incorrect or incomplete, 
              or if you have questions about our privacy practices, please contact us immediately.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center">
              <Phone className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-3">Phone</h4>
              <p className="text-lg text-text mb-2">+91 7416964805</p>
              <p className="text-sm text-text/60">Mon-Sat: 9 AM - 6 PM</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-background text-center">
              <Mail className="w-10 h-10 text-secondary mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-text mb-3">Email</h4>
              <p className="text-lg text-text mb-2">aaroviofficial@gmail.com</p>
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

          <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-background to-primary p-10 rounded-lg text-center shadow-lg">
            <h3 className="font-serif text-2xl font-semibold text-text mb-4">Your Privacy Matters</h3>
            <p className="text-text/90 leading-relaxed">
              At Aarovi, we are committed to protecting your privacy and handling your data with care and transparency. 
              Your trust is important to us, and we continuously work to ensure your information remains secure.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;