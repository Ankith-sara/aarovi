import React, { useState } from "react";
import { Mail, Send, Check, Sparkles } from "lucide-react";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setEmail("");
      setIsSubmitting(false);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-white to-background/20 rounded-3xl border border-background/50 shadow-2xl overflow-hidden">
          <div className="relative px-8 pt-12 pb-8 text-center bg-gradient-to-br from-background/10 to-transparent">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-4"> Join the Aarovi Community </h2>
              <p className="text-text/60 text-base font-light leading-relaxed max-w-4xl mx-auto"> Be the first to discover new collections, artisan stories, and exclusive offers. Subscribe to our newsletter for inspiration delivered to your inbox. </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-12">
            <div className="max-w-2xl mx-auto">
              {isSuccess ? (
                <div className="bg-green-50 rounded-2xl p-8 border-l-4 border-green-500 animate-fadeIn">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-green-900 mb-2">
                        Welcome to Aarovi!
                      </h3>
                      <p className="text-green-800 font-light leading-relaxed">
                        Thank you for subscribing! Check your inbox for a confirmation email and get ready to explore our latest collections.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Form
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Mail
                          size={18}
                          className="text-text/40 group-focus-within:text-secondary transition-colors duration-300"
                        />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-background/50 focus:border-secondary rounded-xl focus:outline-none transition-all duration-300 font-light text-base placeholder:text-text/40 focus:shadow-lg focus:shadow-secondary/10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      onClick={onSubmitHandler}
                      disabled={isSubmitting || !email}
                      className="group sm:w-auto px-8 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary/90 transition-all duration-300 shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Subscribing...</span>
                        </>
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              <div className="mt-8 pt-6 border-t border-background/30 text-center">
                <p className="text-text/60 font-light text-sm leading-relaxed">
                  We respect your privacy. By subscribing, you agree to our{" "}
                  <button
                    onClick={() => window.location.href = '/privacy-policy'}
                    className="text-secondary font-medium hover:underline transition-all duration-300"
                  >
                    Privacy Policy
                  </button>
                  . Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NewsletterBox;