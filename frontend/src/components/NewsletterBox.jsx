import React, { useContext, useState } from "react";
import { Mail } from "lucide-react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { backendUrl } = useContext(ShopContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/newsletter/subscribe`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: response.data.message || "Check your inbox for the WhatsApp join link!",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: response.data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to subscribe. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-stone-50 via-white to-stone-50 py-16 px-4">
      <div className="max-w-7xl w-full mx-auto">
        <div className="bg-white p-8 md:p-16 shadow-lg border border-stone-100">

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-black flex items-center justify-center">
              <Mail size={32} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-black mb-4 text-center">
            JOIN THE <span className="font-medium">AHARYAS</span> COMMUNITY
          </h1>

          {/* Divider */}
          <div className="w-24 h-0.5 bg-black mx-auto mb-8"></div>

          {/* Description */}
          <p className="text-gray-700 text-base md:text-lg font-light leading-relaxed mb-12 max-w-3xl mx-auto text-center">
            Be the first to explore handcrafted collections, exclusive artisan
            stories, and meaningful initiatives. Join a community that celebrates
            heritage, sustainability, and conscious fashion.
          </p>

          {/* Newsletter Form */}
          <form onSubmit={onSubmitHandler} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-3 items-stretch">

              {/* Email Input */}
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail
                    size={20}
                    className="text-gray-400 group-focus-within:text-black transition-colors duration-300"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-14 pr-4 py-5 bg-white border-b-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 font-light text-lg"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Subscribe Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="md:w-auto px-12 py-5 bg-black text-white text-sm uppercase font-light tracking-widest hover:bg-gray-900 transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>

            {/* Success/Error Message */}
            {message.text && (
              <div
                className={`mt-6 p-5 text-center border-l-4 ${message.type === "success"
                    ? "bg-green-50 text-green-900 border-green-600"
                    : "bg-red-50 text-red-900 border-red-600"
                  }`}
              >
                <p className="font-medium text-sm md:text-base">{message.text}</p>
              </div>
            )}
          </form>

          {/* Privacy text */}
          <div className="space-y-3 text-center">
            <p className="text-gray-600 font-light text-sm md:text-base">
              By subscribing, you agree to our{" "}
              <button
                type="button"
                className="text-black font-light hover:font-normal transition-all duration-300 border-b border-transparent hover:border-black pb-0.5"
              >
                Privacy Policy
              </button>
            </p>
            <p className="text-xs md:text-sm text-gray-500 font-light">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBox;