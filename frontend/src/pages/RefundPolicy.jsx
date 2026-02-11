import React, { useEffect } from 'react';
import { RotateCcw, Shield, Clock, AlertCircle, CheckCircle, XCircle, Info, Mail, Phone, Package } from 'lucide-react';

const CancellationRefundPolicy = () => {
  useEffect(() => {
    document.title = 'Return & Exchange Policy | Aarovi'
  });

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-b from-background to-primary px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-6">
            Return & Exchange Policy
          </h1>
          <p className="text-lg sm:text-xl text-text/70 mb-8 max-w-3xl mx-auto font-light">
            At Aarovi, we take pride in creating authentic, handcrafted fashion pieces with care and precision. Each piece is custom-made with attention to detail, and slight variations in color, embroidery, or texture are a natural part of its charm—not a defect.
          </p>
        </div>
      </div>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/10 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6 text-center border border-background/50 hover:shadow-lg transition-all">
              <Clock className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="text-3xl font-bold text-text mb-1">6 Hours</div>
              <div className="text-sm text-text/60">Cancellation Window</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-background/50 hover:shadow-lg transition-all">
              <AlertCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="text-3xl font-bold text-text mb-1">2 Days</div>
              <div className="text-sm text-text/60">Report Issues</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-background/50 hover:shadow-lg transition-all">
              <Package className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="text-3xl font-bold text-text mb-1">7 Days</div>
              <div className="text-sm text-text/60">Final Deadline</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border border-background/50 hover:shadow-lg transition-all">
              <XCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
              <div className="text-3xl font-bold text-text mb-1">No Refunds</div>
              <div className="text-sm text-text/60">Exchange Only</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-secondary/5 to-primary rounded-2xl p-8 border border-secondary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-text text-xl mb-3">Important Notice</h3>
                <p className="text-text/70 leading-relaxed mb-4">
                  Please read this policy carefully before making a purchase. By placing an order, you acknowledge and accept these terms. Minor variations in handcrafted items are normal and reflect authenticity.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-text border border-background/50">
                    No Refunds
                  </span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-text border border-background/50">
                    Exchange Only
                  </span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-text border border-background/50">
                    Handcrafted Quality
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-background/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-3">Policy Details</h2>
            <p className="text-text/60 max-w-2xl mx-auto">
              Understanding our return and exchange guidelines for handcrafted products
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="group bg-white rounded-2xl p-6 border border-background/50 hover:shadow-xl transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform"> 1 </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-text text-lg mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-secondary" />
                    Order Cancellation Window
                  </h3>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Orders may be cancelled within <strong>6 hours of placement</strong> by emailing <strong>aaroiviofficial@gmail.com</strong>.
                    After this window, orders are processed and cannot be cancelled.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-background/50 hover:shadow-xl transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform"> 2 </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-text text-lg mb-2 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-secondary" />
                    No Refunds Policy
                  </h3>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Refunds are <strong>not offered</strong> under any circumstances. We provide replacements or exchanges for eligible cases only.
                    This policy supports our commitment to handcrafted quality.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-background/50 hover:shadow-xl transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform"> 3 </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-text text-lg mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-secondary" />
                    Handcrafted Nature
                  </h3>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Minor irregularities in color, embroidery, print, or fabric texture reflect the handcrafted nature of our products.
                    These variations are characteristics of authentic handmade ethnic wear, not defects.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-background/50 hover:shadow-xl transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform"> 4 </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-text text-lg mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-secondary" />
                    Report Damage Immediately
                  </h3>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Any damage or defect must be reported within <strong>2 working days</strong> of receiving the order.
                    Include clear photos and your order number when contacting us.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-background/50 hover:shadow-xl transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform"> 5 </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-text text-lg mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5 text-secondary" />
                    Return Conditions
                  </h3>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Items must be <strong>unused, unwashed</strong>, and in <strong>original packaging with tags intact</strong> for exchange.
                    Any alterations or signs of use will void exchange eligibility.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-background/50 hover:shadow-xl transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform"> 6 </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-text text-lg mb-2">Non-Returnable Items</h3>
                  <p className="text-text/70 text-sm leading-relaxed mb-3">
                    The following items are <strong>not eligible</strong> for return or exchange:
                  </p>
                  <div className="bg-background/30 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs text-text/70">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                      <span>Custom-made or personalized items</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text/70">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                      <span>Items purchased during sale periods</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text/70">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                      <span>Altered or tailored products</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text/70">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                      <span>Items without tags or packaging</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-background/50 hover:shadow-xl transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform"> 7 </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-text text-lg mb-2 flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-secondary" />
                    Size Exchanges
                  </h3>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Size exchanges are accepted <strong>only if the incorrect size was delivered</strong>.
                    If you ordered the wrong size, exchanges are subject to availability and approval.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-background/50 hover:shadow-xl transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform"> 8 </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-text text-lg mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Replacement Process
                  </h3>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Verified defective or damaged items will be <strong>replaced at the earliest</strong>.
                    Our team will verify the issue and process replacement within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-background/50 hover:shadow-xl transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform"> 9 </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-text text-lg mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-secondary" />
                    Do Not Self-Ship
                  </h3>
                  <p className="text-text/70 text-sm leading-relaxed">
                    Please <strong>do not self-ship returns</strong> without confirmation from our support team.
                    Unauthorized returns will not be processed, and shipping costs will not be reimbursed.
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-background/50 hover:shadow-xl transition-all">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform"> 10 </div>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-text text-lg mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-secondary" />
                    Contact Deadline
                  </h3>
                  <p className="text-text/70 text-sm leading-relaxed">
                    For all order-related concerns, contact us at <strong>aaroiviofficial@gmail.com</strong> within <strong>7 days of delivery</strong>.
                    After this period, we cannot process any return or exchange requests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <RotateCcw className="w-10 h-10 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-3">How to Request an Exchange</h2>
            <p className="text-text/60 max-w-2xl mx-auto">
              Follow these simple steps to process your exchange request
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="relative bg-white rounded-2xl p-8 border border-background/50 hover:shadow-xl transition-all">
              <div className="absolute -top-4 left-8">
                <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  1
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-serif font-bold text-text text-xl mb-3">Contact Support</h3>
                <p className="text-text/70 text-sm leading-relaxed">
                  Email <strong>aaroiviofficial@gmail.com</strong> within 2 working days of receiving your order.
                  Include your order number, photos of the issue, and a detailed description.
                </p>
              </div>
            </div>

            <div className="relative bg-white rounded-2xl p-8 border border-background/50 hover:shadow-xl transition-all">
              <div className="absolute -top-4 left-8">
                <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  2
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-serif font-bold text-text text-xl mb-3">Verification</h3>
                <p className="text-text/70 text-sm leading-relaxed">
                  Our team will review your case and verify the issue. Keep the item unused and in original packaging
                  with all tags attached during this process.
                </p>
              </div>
            </div>

            <div className="relative bg-white rounded-2xl p-8 border border-background/50 hover:shadow-xl transition-all">
              <div className="absolute -top-4 left-8">
                <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  3
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-serif font-bold text-text text-xl mb-3">Resolution</h3>
                <p className="text-text/70 text-sm leading-relaxed">
                  Once approved, we'll arrange pickup and send a replacement. The entire process typically
                  takes 5-7 business days from verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/10 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <XCircle className="w-10 h-10 mx-auto mb-4 text-secondary" />
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-3">Items We Cannot Exchange</h2>
            <p className="text-text/60 max-w-2xl mx-auto">
              Understanding what falls outside our exchange policy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div key={index} className="bg-white p-6 rounded-2xl border border-background/50 hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-serif font-bold text-text mb-2">{item.title}</p>
                    <p className="text-sm text-text/60 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-4">Need Help With Your Order?</h2>
            <p className="text-text/60 text-lg max-w-2xl mx-auto">
              Our customer service team is here to assist you with any return or exchange queries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-8 text-center border border-background/50 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="font-serif font-bold text-text mb-3 text-lg">Phone Support</h4>
              <p className="text-xl font-bold text-text mb-2">+91 7416964805</p>
              <p className="text-sm text-text/60">Mon–Sat: 9 AM – 6 PM IST</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center border border-background/50 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="font-serif font-bold text-text mb-3 text-lg">Email Support</h4>
              <p className="text-lg font-bold text-text mb-2">aaroiviofficial@gmail.com</p>
              <p className="text-sm text-text/60">Response within 24 hours</p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center border border-background/50 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="font-serif font-bold text-text mb-3 text-lg">Deadline</h4>
              <p className="text-4xl font-serif text-secondary font-bold mb-2">7 Days</p>
              <p className="text-sm text-text/60">From delivery date</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary to-secondary/90 text-white p-10 rounded-2xl max-w-4xl mx-auto text-center shadow-xl">
            <h3 className="font-serif text-2xl font-bold mb-4">Our Commitment to Quality</h3>
            <p className="leading-relaxed text-white/90">
              At Aarovi, we're dedicated to delivering handcrafted ethnic wear of the highest quality. While we stand behind our products, we also ask for your understanding of the unique characteristics that make each piece special. Your satisfaction is our priority.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CancellationRefundPolicy;