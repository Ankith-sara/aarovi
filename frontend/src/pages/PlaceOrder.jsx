import React, { useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CreditCard, Home, Shield, ArrowLeft, MapPin, Phone, Mail, User, Package, CheckCircle } from 'lucide-react';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  function loadRazorpayScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await axios.get(`${backendUrl}/api/user/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          const user = res.data.user;

          setFormData(prev => ({
            ...prev,
            Name: user.name || '',
            email: user.email || '',
            street: user.addresses?.[0]?.address || '',
            city: user.addresses?.[0]?.city || '',
            state: user.addresses?.[0]?.state || '',
            pincode: user.addresses?.[0]?.zip || '',
            country: user.addresses?.[0]?.country || '',
            phone: user.addresses?.[0]?.phone || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [backendUrl]);

  useEffect(() => {
    document.title = 'Checkout | Aarovi'
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = async (order, userId, orderItems, totalAmount) => {
    await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Aarovi',
      description: 'Payment for order',
      order_id: order.id,
      handler: async (response) => {
        try {
          const verifyRes = await axios.post(`${backendUrl}/api/order/verifyRazorpay`, {
            ...response,
            userId,
            items: orderItems,
            amount: totalAmount,
            address: formData
          }, { headers: { Authorization: `Bearer ${token}` } });

          if (verifyRes.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(verifyRes.data.message);
          }
        } catch (err) {
          console.error('Error verifying Razorpay payment:', err);
          toast.error('Payment verification failed.');
        }
      },
      prefill: {
        name: formData.Name,
        email: formData.email,
        contact: formData.phone
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!agreeToTerms) {
      toast.error('Please agree to our Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    setIsLoading(true);

    const decoded = jwtDecode(token);

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const product = products.find((p) => p._id === items);
            if (product) {
              orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItems[items][item],
                size: item,
                image: product.images?.[0] || null
              });
            }
          }
        }
      }

      let orderData = {
        userId: decoded.id,
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case 'cod':
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { Authorization: `Bearer ${token}` } });
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { Authorization: `Bearer ${token}` } });
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order, decoded.id, orderItems, orderData.amount);
          } else {
            toast.error(responseRazorpay.data.message);
          }
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 min-h-screen">
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-2">
                Checkout
              </h1>
              <p className="text-text/50 font-light flex items-center gap-2">
                <Package size={16} />
                Complete your purchase
              </p>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="hidden sm:flex items-center gap-2 px-6 py-3 text-secondary hover:text-secondary/80 font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Cart</span>
            </button>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={onSubmitHandler} className="grid xl:grid-cols-[1.5fr_1fr] gap-10 mt-12">
            <div className="space-y-6">
              {/* Delivery Information */}
              <div className="bg-white rounded-2xl border border-background/50 shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-background/20 to-background/10 border-b border-background/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Home size={18} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-text">Delivery Information</h2>
                      <p className="text-xs text-text/50 font-light">Where should we send your order?</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-4 flex items-center gap-2">
                      <User size={14} className="text-secondary" />
                      Personal Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">
                          Full Name *
                        </label>
                        <input
                          onChange={onChangeHandler}
                          name="Name"
                          value={formData.Name}
                          className="w-full px-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                          type="text"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/40" />
                          <input
                            onChange={onChangeHandler}
                            name="email"
                            value={formData.email}
                            className="w-full pl-10 pr-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                            type="email"
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/40" />
                        <input
                          onChange={onChangeHandler}
                          name="phone"
                          value={formData.phone}
                          className="w-full pl-10 pr-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4 pt-6 border-t border-background/30">
                    <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-4 flex items-center gap-2">
                      <MapPin size={14} className="text-secondary" />
                      Delivery Address
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">
                          Street Address *
                        </label>
                        <input
                          onChange={onChangeHandler}
                          name="street"
                          value={formData.street}
                          className="w-full px-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                          type="text"
                          placeholder="House number, street name"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">
                            City *
                          </label>
                          <input
                            onChange={onChangeHandler}
                            name="city"
                            value={formData.city}
                            className="w-full px-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                            type="text"
                            placeholder="Your city"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">
                            State *
                          </label>
                          <input
                            onChange={onChangeHandler}
                            name="state"
                            value={formData.state}
                            className="w-full px-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                            type="text"
                            placeholder="Your state"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">
                            Postal Code *
                          </label>
                          <input
                            onChange={onChangeHandler}
                            name="pincode"
                            value={formData.pincode}
                            className="w-full px-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                            type="text"
                            placeholder="ZIP/Postal code"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">
                            Country *
                          </label>
                          <input
                            onChange={onChangeHandler}
                            name="country"
                            value={formData.country}
                            className="w-full px-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                            type="text"
                            placeholder="Your country"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="pt-6 border-t border-background/30">
                    <div className="bg-background/10 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center mt-1">
                          <input
                            type="checkbox"
                            id="agree-terms"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className="w-5 h-5 text-secondary bg-white border-background/50 focus:ring-secondary focus:ring-2 cursor-pointer rounded"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor="agree-terms" className="block text-sm text-text/80 cursor-pointer leading-relaxed font-light">
                            I agree to the{' '}
                            <a href="/termsconditions" target="_blank" className="text-secondary font-medium underline hover:text-secondary/80 transition-colors">Terms & Conditions</a>,{' '}
                            <a href="/privacypolicy" target="_blank" className="text-secondary font-medium underline hover:text-secondary/80 transition-colors">Privacy Policy</a>, and{' '}
                            <a href="/shippingpolicy" target="_blank" className="text-secondary font-medium underline hover:text-secondary/80 transition-colors">Shipping Policy</a>. 
                            I understand that orders are processed within 0-7 days and Aarovi is not liable for courier delays. *
                          </label>
                        </div>
                      </div>

                      {!agreeToTerms && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <p className="text-xs text-red-600 flex items-center gap-2 font-medium">
                            <Shield size={12} />
                            Please agree to our terms before placing your order
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-5 border border-background/30 rounded-xl bg-gradient-to-br from-background/5 to-background/10">
                      <h4 className="font-semibold text-text text-sm mb-3 flex items-center gap-2">
                        <CheckCircle size={14} className="text-secondary" />
                        Key Policy Highlights
                      </h4>
                      <ul className="text-xs text-text/70 space-y-2 font-light">
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-0.5">•</span>
                          <span>Processing time: 0-7 days from order confirmation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-0.5">•</span>
                          <span>Shipping via registered courier services (domestic & international)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-0.5">•</span>
                          <span>Aarovi ensures timely handover to courier companies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-secondary mt-0.5">•</span>
                          <span>Support available at +91 9063284008 or aaroviofficial@gmail.com</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-background/50 shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-background/20 to-background/10 border-b border-background/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <CreditCard size={18} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-text">Payment Method</h2>
                      <p className="text-xs text-text/50 font-light">Choose how you'd like to pay</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {/* <PaymentOption method={method} setMethod={setMethod} type="razorpay" logo={assets.razorpay_logo} /> */}
                  <PaymentOption method={method} setMethod={setMethod} type="cod" />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white to-background/20 rounded-2xl border border-background/50 shadow-xl sticky top-6">
                <div className="p-6 bg-gradient-to-r from-background/20 to-background/10 border-b border-background/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Package size={18} className="text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-text">Order Summary</h2>
                      <p className="text-xs text-text/50 font-light">Review your purchase</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <CartTotal />

                  <div className="space-y-3 pt-6 border-t border-background/30">
                    <button
                      type="submit"
                      disabled={isLoading || !agreeToTerms}
                      className={`group w-full py-4 font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-3 ${
                        !agreeToTerms
                          ? 'bg-background/30 text-text/40 cursor-not-allowed'
                          : 'bg-secondary text-white hover:bg-secondary/90'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Place Order</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/cart')}
                      className="w-full py-4 bg-background/30 text-text font-semibold rounded-full hover:bg-background/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Back to Cart</span>
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="pt-4 border-t border-background/30">
                    <div className="flex items-center justify-center gap-2 text-xs text-text/60 font-medium bg-green-50 py-3 rounded-xl">
                      <Shield size={16} className="text-green-600" />
                      <span>Secure SSL Encrypted Checkout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

const PaymentOption = ({ method, setMethod, type, logo }) => (
  <div
    onClick={() => setMethod(type)}
    className={`group flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
      method === type
        ? 'border-secondary bg-secondary/5 shadow-lg'
        : 'border-background/50 hover:border-background hover:shadow-md'
    }`}
  >
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
      method === type ? 'border-secondary' : 'border-background/50'
    }`}>
      {method === type && <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>}
    </div>

    {logo ? (
      <div className="flex items-center gap-3 flex-1">
        <img className="h-6 object-contain" src={logo} alt={`${type} payment`} />
        <div className="flex flex-col">
          <span className="font-semibold text-text capitalize">{type}</span>
          <span className="text-xs text-text/50 font-light">Credit/Debit Cards, UPI, Net Banking</span>
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-3 flex-1">
        <div className="bg-background/20 p-2 rounded-lg group-hover:bg-background/30 transition-colors">
          <Package size={18} className="text-text" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-text">Cash on Delivery</span>
          <span className="text-xs text-text/50 font-light">Pay when you receive your order</span>
        </div>
      </div>
    )}
  </div>
);

export default PlaceOrder;