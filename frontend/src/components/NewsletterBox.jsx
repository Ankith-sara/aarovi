import React, { useState } from "react";
import { Mail, Send, Check, AlertCircle } from "lucide-react";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // Simulate API call
    setTimeout(() => {
      setMessage({
        type: "You've successfully subscribed to our newsletter.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl border border-[#E8DCC4] overflow-hidden">
          <div className="pt-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                <Mail size={32} className="text-white" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-4">
              Join the <span className="text-secondary">Aarovi</span> Community
            </h2>

            <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6"></div>

            <p className="text-text/70 text-base sm:text-lg font-light leading-relaxed max-w-4xl mx-auto">
              Be the first to explore handcrafted collections, exclusive artisan
              stories, and meaningful initiatives. Join a community that celebrates
              heritage, sustainability, and conscious fashion.
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8 sm:p-12">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">

                {/* Email Input */}
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail
                      size={20}
                      className="text-text/40 group-focus-within:text-secondary transition-colors duration-300"
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-background/20 to-primary border-2 border-background focus:border-secondary rounded-lg focus:outline-none transition-all duration-300 font-light text-base placeholder:text-text/40"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={onSubmitHandler}
                  disabled={isSubmitting || !email}
                  className="sm:w-auto px-8 py-4 bg-secondary text-white text-sm uppercase font-semibold tracking-wider rounded-lg hover:bg-secondary/80 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>

              {/* Success/Error Message */}
              {message.text && (
                <div
                  className={`p-5 rounded-lg border-l-4 flex items-start gap-3 ${message.type === "success"
                      ? "bg-green-50 text-green-800 border-green-500"
                      : "bg-red-50 text-red-800 border-red-500"
                    }`}
                >
                  {message.type === "success" ? (
                    <Check size={20} className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium text-sm sm:text-base">{message.text}</p>
                </div>
              )}
            </div>

            {/* Privacy Section */}
            <div className="mt-8 pt-8 border-t border-background/50 text-center space-y-3">
              <p className="text-text/70 font-light text-sm sm:text-base">
                By subscribing, you agree to our{" "}
                <button
                  onClick={() => window.location.href = '/privacy-policy'}
                  className="text-secondary font-medium hover:underline transition-all duration-300"
                >
                  Privacy Policy
                </button>
              </p>
              <p className="text-xs sm:text-sm text-text/50 font-light">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBox;