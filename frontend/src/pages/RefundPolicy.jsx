import React, { useEffect } from 'react';
import { RotateCcw, Shield, Clock, AlertCircle, CheckCircle, PackageCheck, XCircle, Info, Mail, Phone, Package } from 'lucide-react';

const CancellationRefundPolicy = () => {
  useEffect(() => {
    document.title = 'Return & Exchange Policy | Aasvi'
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            Return & Exchange Policy
          </h1>
          <p className="text-lg sm:text-xl text-text/70 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            At Aasvi, we take pride in creating authentic, handcrafted fashion pieces with care and precision. Each piece is custom-made with attention to detail, and slight variations in color, embroidery, or texture are a natural part of its charm—not a defect.
          </p>
        </div>
      </div>

      {/* Policy Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-secondary">Policy Overview</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-lg shadow-sm border border-background">
              <p className="text-text/80 leading-relaxed mb-6">
                At Aasvi, we celebrate the art of handcrafted fashion. Each item tells a story of skilled craftsmanship and traditional techniques. This policy outlines our commitment to quality while respecting the unique nature of custom-made ethnic wear.
              </p>
              <div className="bg-gradient-to-br from-background/30 to-primary p-6 rounded-lg">
                <h4 className="font-serif font-semibold text-text mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Important Notice
                </h4>
                <p className="text-sm text-text/80">
                  Please read this policy carefully before making a purchase. By placing an order, you acknowledge and accept these terms. Minor variations in handcrafted items are normal and reflect authenticity.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-background/20 to-white p-8 rounded-lg shadow-sm border border-background">
              <h3 className="font-serif font-semibold text-text mb-6 text-xl">Key Policy Points</h3>
              <ul className="space-y-3 text-sm text-text/80">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>No Refunds:</strong> We offer replacements or exchanges only</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Quick Cancellation:</strong> Cancel within 6 hours of order placement</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Report Issues Fast:</strong> Contact us within 2 working days</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Final Deadline:</strong> All concerns must be raised within 7 days of delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Policy Points */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#FAF9F6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <PackageCheck className="w-12 h-12 mx-auto mb-4 text-[#8B6F47]" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2C1810]">Our Return & Exchange Policy</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Policy Point 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#2C1810] mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Order Cancellation Window
                  </h3>
                  <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                    Orders may be cancelled within <strong>6 hours of placement</strong> by emailing <strong>aasviofficial@gmail.com</strong>. 
                    After this window, orders are processed and cannot be cancelled.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Point 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#2C1810] mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    No Refunds Policy
                  </h3>
                  <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                    Refunds are <strong>not offered</strong> under any circumstances. We provide replacements or exchanges for eligible cases only. 
                    This policy supports our commitment to handcrafted quality.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Point 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#2C1810] mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Handcrafted Nature
                  </h3>
                  <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                    Minor irregularities in color, embroidery, print, or fabric texture reflect the handcrafted nature of our products. 
                    These variations are characteristics of authentic handmade ethnic wear, not defects.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Point 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#2C1810] mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Report Damage Immediately
                  </h3>
                  <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                    Any damage or defect must be reported within <strong>2 working days</strong> of receiving the order. 
                    Include clear photos and your order number when contacting us.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Point 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#2C1810] mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Return Conditions
                  </h3>
                  <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                    Items must be <strong>unused, unwashed</strong>, and in <strong>original packaging with tags intact</strong> for exchange. 
                    Any alterations or signs of use will void exchange eligibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Point 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  6
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#2C1810] mb-3">Non-Returnable Items</h3>
                  <p className="text-[#2C1810]/80 text-sm leading-relaxed mb-3">
                    The following items are <strong>not eligible</strong> for return or exchange:
                  </p>
                  <div className="bg-gradient-to-br from-[#E8DCC4]/20 to-[#FAF9F6] p-4 rounded-lg">
                    <ul className="space-y-1 text-xs text-[#2C1810]/80">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#8B6F47] rounded-full"></div>
                        Custom-made or personalized items
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#8B6F47] rounded-full"></div>
                        Items purchased during sale periods
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#8B6F47] rounded-full"></div>
                        Altered or tailored products
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#8B6F47] rounded-full"></div>
                        Items without tags or packaging
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Point 7 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  7
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#2C1810] mb-3 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Size Exchanges
                  </h3>
                  <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                    Size exchanges are accepted <strong>only if the incorrect size was delivered</strong>. 
                    If you ordered the wrong size, exchanges are subject to availability and approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Point 8 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  8
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#2C1810] mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Replacement Process
                  </h3>
                  <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                    Verified defective or damaged items will be <strong>replaced at the earliest</strong>. 
                    Our team will verify the issue and process replacement within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Point 9 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  9
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#2C1810] mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Do Not Self-Ship
                  </h3>
                  <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                    Please <strong>do not self-ship returns</strong> without confirmation from our support team. 
                    Unauthorized returns will not be processed, and shipping costs will not be reimbursed.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Point 10 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                  10
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[#2C1810] mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Contact Deadline
                  </h3>
                  <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                    For all order-related concerns, contact us at <strong>aasviofficial@gmail.com</strong> within <strong>7 days of delivery</strong>. 
                    After this period, we cannot process any return or exchange requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exchange Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <RotateCcw className="w-12 h-12 mx-auto mb-4 text-[#8B6F47]" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2C1810]">How to Request an Exchange</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold text-lg">
                  1
                </div>
                <h3 className="font-serif font-semibold text-[#2C1810] text-lg">Contact Support</h3>
              </div>
              <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                Email <strong>aasviofficial@gmail.com</strong> within 2 working days of receiving your order. 
                Include your order number, photos of the issue, and a detailed description.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold text-lg">
                  2
                </div>
                <h3 className="font-serif font-semibold text-[#2C1810] text-lg">Verification</h3>
              </div>
              <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                Our team will review your case and verify the issue. Keep the item unused and in original packaging 
                with all tags attached during this process.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E8DCC4] hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8B6F47] to-[#6B5437] text-white rounded-full flex items-center justify-center font-semibold text-lg">
                  3
                </div>
                <h3 className="font-serif font-semibold text-[#2C1810] text-lg">Resolution</h3>
              </div>
              <p className="text-[#2C1810]/80 text-sm leading-relaxed">
                Once approved, we'll arrange pickup and send a replacement. The entire process typically 
                takes 5-7 business days from verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Don't Accept */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF9F6] to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-[#8B6F47]" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2C1810]">Items We Cannot Exchange</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Change of Mind",
                description: "Returns due to personal preference or change of mind are not accepted."
              },
              {
                title: "Used or Washed Items",
                description: "Items that have been worn, washed, or altered cannot be exchanged."
              },
              {
                title: "Missing Tags or Packaging",
                description: "Items without original tags and packaging are not eligible for exchange."
              },
              {
                title: "Custom or Sale Items",
                description: "Custom-made items and products purchased during sales are final sale."
              },
              {
                title: "Minor Variations",
                description: "Natural variations in handcrafted items are not grounds for return or exchange."
              },
              {
                title: "Late Requests",
                description: "Requests made after 7 days of delivery cannot be processed."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-[#E8DCC4]">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#8B6F47] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-serif font-semibold text-[#2C1810] mb-2">{item.title}</p>
                    <p className="text-sm text-[#2C1810]/70">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#E8DCC4]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2C1810] mb-4">Need Help With Your Order?</h2>
            <p className="text-[#2C1810]/70 text-lg max-w-2xl mx-auto">
              Our customer service team is here to assist you with any return or exchange queries. 
              We're committed to resolving your concerns promptly and fairly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E8DCC4] text-center">
              <Phone className="w-10 h-10 text-[#8B6F47] mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-[#2C1810] mb-3">Phone Support</h4>
              <p className="text-lg text-[#2C1810] mb-1">+91 9399336666</p>
              <p className="text-sm text-[#2C1810]/60 mt-2">Mon–Sat: 9 AM – 6 PM IST</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E8DCC4] text-center">
              <Mail className="w-10 h-10 text-[#8B6F47] mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-[#2C1810] mb-3">Email Support</h4>
              <p className="text-lg text-[#2C1810] mb-1">aasviofficial@gmail.com</p>
              <p className="text-sm text-[#2C1810]/60 mt-2">Response within 24 hours</p>
              <p className="text-xs text-[#2C1810]/60 mt-1">Include order number in subject</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#E8DCC4] text-center">
              <AlertCircle className="w-10 h-10 text-[#8B6F47] mx-auto mb-4" />
              <h4 className="font-serif font-semibold text-[#2C1810] mb-3">Deadline</h4>
              <p className="text-2xl font-serif text-[#2C1810] font-semibold mb-1">7 Days</p>
              <p className="text-sm text-[#2C1810]/60 mt-2">From delivery date</p>
              <p className="text-xs text-[#2C1810]/60 mt-1">All concerns must be raised before deadline</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#8B6F47] to-[#6B5437] text-white p-10 rounded-lg max-w-3xl mx-auto text-center shadow-lg">
            <h3 className="font-serif text-2xl font-semibold mb-4">Our Commitment to Quality</h3>
            <p className="leading-relaxed text-white/90">
              At Aasvi, we're dedicated to delivering handcrafted ethnic wear of the highest quality. While we stand behind our products, we also ask for your understanding of the unique characteristics that make each piece special. Your satisfaction is our priority.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CancellationRefundPolicy;