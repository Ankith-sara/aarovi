import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { Country, State, City } from 'country-state-city';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CreditCard, Home, Shield, ArrowLeft, MapPin, Mail, User, Package,
  CheckCircle, QrCode, X, AlertCircle, ChevronDown, Search
} from 'lucide-react';

// ── Delivery fee constants ────────────────────────────────────────────────
const DELIVERY_FEE_TELANGANA     = 50;
const DELIVERY_FEE_INDIA         = 100;
const DELIVERY_FEE_INTERNATIONAL = 150;

const INDIA_ALIASES     = ['india', 'in', 'bharat', 'ind'];
const TELANGANA_ALIASES = ['telangana', 'tg', 'ts'];

const getDeliveryFee = (country = '', state = '') => {
  const c = country.trim().toLowerCase();
  const s = state.trim().toLowerCase();
  if (c && !INDIA_ALIASES.includes(c)) return DELIVERY_FEE_INTERNATIONAL;
  if (TELANGANA_ALIASES.includes(s))   return DELIVERY_FEE_TELANGANA;
  return DELIVERY_FEE_INDIA;
};

// ── Safe token decoder ────────────────────────────────────────────────────
const safeDecodeToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  if (token.split('.').length !== 3) return null;
  try { return jwtDecode(token); } catch { return null; }
};

// ── Reusable searchable dropdown ─────────────────────────────────────────
const SearchableSelect = ({ label, placeholder, options, value, onChange, disabled = false, required = false }) => {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const ref               = useRef(null);

  const filtered = useMemo(() =>
    options.filter(o => o.label.toLowerCase().includes(query.toLowerCase())).slice(0, 150),
    [options, query]
  );
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="space-y-2" ref={ref}>
      <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">
        {label}{required && ' *'}
      </label>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => { if (!disabled) { setOpen(o => !o); setQuery(''); } }}
          className={`w-full px-4 py-3 border rounded-lg bg-white text-left flex items-center justify-between transition-all font-light text-sm
            ${disabled
              ? 'bg-background/10 text-text/30 cursor-not-allowed border-background/30'
              : 'border-background/50 hover:border-background cursor-pointer focus:outline-none'}
            ${open ? 'border-secondary ring-2 ring-secondary/20' : ''}`}
        >
          <span className={selected ? 'text-text' : 'text-text/40'}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown size={14} className={`text-text/40 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-background/50 rounded-xl shadow-xl overflow-hidden">
            <div className="p-2 border-b border-background/20 flex items-center gap-2 bg-background/5">
              <Search size={12} className="text-text/40 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="flex-1 text-xs focus:outline-none bg-transparent"
              />
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0
                ? <p className="px-3 py-3 text-xs text-text/40">No results found</p>
                : filtered.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value, opt.label); setQuery(''); setOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary/5 transition-colors
                      ${opt.value === value ? 'bg-secondary/10 font-medium text-secondary' : 'font-light text-text'}`}
                  >
                    {opt.label}
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Dial code dropdown ────────────────────────────────────────────────────
const DialCodeSelect = ({ options, value, onChange }) => {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState('');
  const ref               = useRef(null);

  const filtered = useMemo(() =>
    options.filter(o =>
      o.label.includes(query) || o.country.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 150),
    [options, query]
  );
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setQuery(''); }}
        className={`h-full px-3 py-3 border rounded-l-lg bg-white flex items-center gap-1.5 hover:border-background transition-all cursor-pointer min-w-[88px]
          ${open ? 'border-secondary ring-2 ring-secondary/20' : 'border-background/50'}`}
      >
        <span className="text-sm font-light text-text whitespace-nowrap">
          {selected ? selected.label : '+?'}
        </span>
        <ChevronDown size={12} className={`text-text/40 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-40 bg-white border border-background/50 rounded-xl shadow-xl w-64 overflow-hidden">
          <div className="p-2 border-b border-background/20 flex items-center gap-2 bg-background/5">
            <Search size={12} className="text-text/40 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search country or code…"
              className="flex-1 text-xs focus:outline-none bg-transparent"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0
              ? <p className="px-3 py-3 text-xs text-text/40">No results</p>
              : filtered.map(opt => (
                <button
                  key={`${opt.isoCode}-${opt.value}`}
                  type="button"
                  onClick={() => { onChange(opt.value); setQuery(''); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary/5 transition-colors flex items-center justify-between gap-2
                    ${opt.value === value ? 'bg-secondary/10 font-medium text-secondary' : 'font-light text-text'}`}
                >
                  <span>{opt.label}</span>
                  <span className="text-text/40 text-[10px] truncate">{opt.country}</span>
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────
const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, products } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    Name: '', email: '', street: '', city: '',
    state: '', pincode: '', country: '', phone: '',
  });

  // Location cascade
  const [countryCode, setCountryCode] = useState('');
  const [stateCode,   setStateCode]   = useState('');
  const [cityName,    setCityName]    = useState('');

  // Phone
  const [dialCode,    setDialCode]    = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [isLoading,    setIsLoading]    = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showQRModal,  setShowQRModal]  = useState(false);
  const [transactionId,      setTransactionId]      = useState('');
  const [transactionIdError, setTransactionIdError] = useState('');

  // ── Option lists ──────────────────────────────────────────────────────────
  const countryOptions = useMemo(() =>
    Country.getAllCountries().map(c => ({ value: c.isoCode, label: `${c.flag} ${c.name}` })),
    []
  );

  const dialOptions = useMemo(() =>
    Country.getAllCountries()
      .filter(c => c.phonecode)
      .map(c => ({
        value: c.phonecode.replace(/[^0-9]/g, ''),
        isoCode: c.isoCode,
        label: `${c.flag} +${c.phonecode.replace(/[^0-9]/g, '')}`,
        country: c.name,
      }))
      .filter(c => c.value)
      .filter((c, i, arr) => arr.findIndex(x => x.value === c.value) === i),
    []
  );

  const stateOptions = useMemo(() =>
    countryCode ? State.getStatesOfCountry(countryCode).map(s => ({ value: s.isoCode, label: s.name })) : [],
    [countryCode]
  );

  const cityOptions = useMemo(() => {
    if (!countryCode) return [];
    const list = stateCode
      ? City.getCitiesOfState(countryCode, stateCode)
      : City.getCitiesOfCountry(countryCode);
    return (list || []).map(c => ({ value: c.name, label: c.name }));
  }, [countryCode, stateCode]);

  // ── Shipping fee — reacts to country + state ──────────────────────────────
  const shippingFee = useMemo(() =>
    getCartAmount() === 0 ? 0 : getDeliveryFee(formData.country, formData.state),
    [formData.country, formData.state, cartItems]
  );

  const shippingZoneLabel = useMemo(() => {
    if (!countryCode) return null;
    if (countryCode !== 'IN') return { label: `International shipping — ₹${DELIVERY_FEE_INTERNATIONAL}`, color: 'text-blue-600' };
    if (stateCode === 'TG')   return { label: `Telangana delivery — ₹${DELIVERY_FEE_TELANGANA}`,     color: 'text-green-600' };
    return { label: `India delivery — ₹${DELIVERY_FEE_INDIA}`, color: 'text-orange-600' };
  }, [countryCode, stateCode]);

  // ── Sync phone into formData ──────────────────────────────────────────────
  useEffect(() => {
    setFormData(d => ({ ...d, phone: phoneNumber ? `+${dialCode}${phoneNumber}` : '' }));
  }, [dialCode, phoneNumber]);

  const getToken = () => token || localStorage.getItem('token');

  const onChangeHandler = e => {
    const { name, value } = e.target;
    setFormData(d => ({ ...d, [name]: value }));
  };

  const handleCountryChange = (isoCode, label) => {
    const name = label.replace(/^\S+\s/, '');
    setCountryCode(isoCode);
    setStateCode('');
    setCityName('');
    const cd = Country.getCountryByCode(isoCode);
    if (cd?.phonecode) setDialCode(cd.phonecode.replace(/[^0-9]/g, ''));
    setFormData(d => ({ ...d, country: name, state: '', city: '', pincode: '' }));
  };

  const handleStateChange = (isoCode, label) => {
    setStateCode(isoCode);
    setCityName('');
    setFormData(d => ({ ...d, state: label, city: '' }));
  };

  const handleCityChange = (val, label) => {
    setCityName(val);
    setFormData(d => ({ ...d, city: label }));
  };

  // ── Pre-fill from profile ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const rawToken = getToken();
        if (!rawToken) return;
        const decoded = safeDecodeToken(rawToken);
        if (!decoded?.id) return;

        const res = await axios.get(`${backendUrl}/api/user/profile/${decoded.id}`, {
          headers: { Authorization: `Bearer ${rawToken}` }
        });
        if (!res.data.success) return;

        const u = res.data.user;
        const savedCountry = u.addresses?.[0]?.country || '';
        const savedState   = u.addresses?.[0]?.state   || '';
        const savedCity    = u.addresses?.[0]?.city    || '';

        const matchedCountry = Country.getAllCountries().find(
          c => c.name.toLowerCase() === savedCountry.toLowerCase() || c.isoCode === savedCountry.toUpperCase()
        );
        const cCode = matchedCountry?.isoCode || '';
        const matchedState = cCode
          ? State.getStatesOfCountry(cCode).find(
              s => s.name.toLowerCase() === savedState.toLowerCase() || s.isoCode === savedState.toUpperCase()
            )
          : null;

        setCountryCode(cCode);
        setStateCode(matchedState?.isoCode || '');
        setCityName(savedCity);

        const savedDial  = cCode ? Country.getCountryByCode(cCode)?.phonecode?.replace(/[^0-9]/g, '') : '91';
        const savedPhone = u.addresses?.[0]?.phone || '';
        let localPhone   = savedPhone.replace(/\D/g, '');
        if (savedDial && localPhone.startsWith(savedDial)) localPhone = localPhone.slice(savedDial.length);
        if (savedDial) setDialCode(savedDial);
        setPhoneNumber(localPhone);

        setFormData(prev => ({
          ...prev,
          Name:    u.name || '',
          email:   u.email || '',
          street:  u.addresses?.[0]?.address || '',
          city:    savedCity,
          state:   matchedState?.name || savedState,
          pincode: u.addresses?.[0]?.zip || '',
          country: matchedCountry?.name || savedCountry,
        }));
      } catch { /* silently ignore */ }
    };
    fetchUser();
  }, [backendUrl, token]);

  useEffect(() => { document.title = 'Checkout | Aarovi'; }, []);

  // ── Build order items ─────────────────────────────────────────────────────
  const buildOrderItems = () => {
    const orderItems = [];

    for (const productId in cartItems) {
      if (productId === 'customizations') continue;
      const sizes = cartItems[productId];
      if (typeof sizes !== 'object') continue;

      for (const sizeKey in sizes) {
        const entry = sizes[sizeKey];
        const qty   = typeof entry === 'object' ? (entry.quantity ?? 0) : entry;
        if (!qty || qty <= 0) continue;

        const product = products.find(p => p._id === productId);
        if (!product) continue;

        const neckStyle           = typeof entry === 'object' ? (entry.neckStyle           || '') : '';
        const sleeveStyle         = typeof entry === 'object' ? (entry.sleeveStyle         || '') : '';
        const specialInstructions = typeof entry === 'object' ? (entry.specialInstructions || '') : '';

        orderItems.push({
          productId: product._id, name: product.name, price: product.price,
          quantity: qty, size: sizeKey, image: product.images?.[0] || null,
          ...(neckStyle           && { neckStyle }),
          ...(sleeveStyle         && { sleeveStyle }),
          ...(specialInstructions && { specialInstructions }),
        });
      }
    }

    if (cartItems.customizations) {
      for (const customId in cartItems.customizations) {
        const custom = cartItems.customizations[customId];
        if (!custom?.quantity || custom.quantity <= 0) continue;
        orderItems.push({
          _id: customId, type: 'customization',
          name: `Custom ${custom.snapshot?.gender || ''} ${custom.snapshot?.dressType || 'Design'}`,
          quantity: custom.quantity, price: custom.price,
          gender: custom.snapshot?.gender || '', dressType: custom.snapshot?.dressType || '',
          fabric: custom.snapshot?.fabric || '', color: custom.snapshot?.color || '',
          size: custom.snapshot?.size || '', designNotes: custom.snapshot?.designNotes || '',
          measurements: custom.snapshot?.measurements || {}, canvasDesign: custom.snapshot?.canvasDesign || {},
          referenceImages: custom.snapshot?.referenceImages || [], aiPrompt: custom.snapshot?.aiPrompt || '',
          neckStyle: custom.snapshot?.neckStyle || '', sleeveStyle: custom.snapshot?.sleeveStyle || '',
          specialInstructions: custom.snapshot?.specialInstructions || '',
          image: custom.snapshot?.canvasDesign?.pngUrl || custom.snapshot?.canvasDesign?.png || ''
        });
      }
    }

    return orderItems;
  };

  // ── Razorpay ──────────────────────────────────────────────────────────────
  function loadRazorpayScript(src) {
    return new Promise(resolve => {
      const s = document.createElement('script');
      s.src = src; s.onload = () => resolve(true); s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  }

  const initPay = async (order, userId, orderItems, totalAmount) => {
    await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    const rawToken = getToken();
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount, currency: order.currency,
      name: 'Aarovi', description: 'Payment for order', order_id: order.id,
      handler: async (response) => {
        try {
          const verifyRes = await axios.post(`${backendUrl}/api/order/verifyRazorpay`, {
            ...response, userId, items: orderItems, amount: totalAmount, address: formData
          }, { headers: { Authorization: `Bearer ${rawToken}` } });
          if (verifyRes.data.success) { setCartItems({}); navigate('/orders'); }
          else toast.error(verifyRes.data.message);
        } catch { toast.error('Payment verification failed.'); }
      },
      prefill: { name: formData.Name, email: formData.email, contact: formData.phone }
    };
    new window.Razorpay(options).open();
  };

  // ── QR submit ─────────────────────────────────────────────────────────────
  const validateTransactionId = (value) => {
    const v = value.trim();
    if (!v)            { setTransactionIdError('Transaction ID is required'); return false; }
    if (v.length < 8)  { setTransactionIdError('Transaction ID must be at least 8 characters'); return false; }
    if (v.length > 50) { setTransactionIdError('Transaction ID is too long (max 50 characters)'); return false; }
    if (!/^[A-Za-z0-9\-_./]+$/.test(v)) { setTransactionIdError('Transaction ID contains invalid characters'); return false; }
    setTransactionIdError('');
    return true;
  };

  const handleTransactionIdChange = e => {
    setTransactionId(e.target.value);
    if (transactionIdError && e.target.value.trim()) setTransactionIdError('');
  };

  const handleQRSubmit = async () => {
    if (!validateTransactionId(transactionId)) { toast.error(transactionIdError || 'Please enter a valid transaction ID'); return; }
    const rawToken = getToken();
    if (!rawToken) { toast.error('Please log in to place your order.'); navigate('/login'); return; }
    const decoded = safeDecodeToken(rawToken);
    if (!decoded?.id) { toast.error('Your session has expired. Please log in again.'); localStorage.removeItem('token'); navigate('/login'); return; }

    setIsLoading(true);
    try {
      const orderItems = buildOrderItems();
      const response = await axios.post(`${backendUrl}/api/order/qr`, {
        userId: decoded.id, address: formData, items: orderItems,
        amount: getCartAmount() + shippingFee,
        transactionId: transactionId.trim()
      }, { headers: { Authorization: `Bearer ${rawToken}` } });

      if (response.data.success) {
        setCartItems({}); setShowQRModal(false); setTransactionId(''); setTransactionIdError('');
        toast.success('Order placed successfully'); navigate('/orders');
      } else { toast.error(response.data.message); }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally { setIsLoading(false); }
  };

  // ── Main submit ───────────────────────────────────────────────────────────
  const onSubmitHandler = async (event) => {
    event?.preventDefault();
    if (!agreeToTerms) { toast.error('Please agree to our Terms & Conditions and Privacy Policy to proceed.'); return; }
    if (method === 'qr') { setShowQRModal(true); return; }

    const rawToken = getToken();
    if (!rawToken) { toast.error('Please log in to place your order.'); navigate('/login'); return; }
    const decoded = safeDecodeToken(rawToken);
    if (!decoded?.id) { toast.error('Your session has expired. Please log in again.'); localStorage.removeItem('token'); navigate('/login'); return; }

    setIsLoading(true);
    try {
      const orderItems = buildOrderItems();
      if (orderItems.length === 0) { toast.error('Your cart is empty.'); setIsLoading(false); return; }

      const orderData = { userId: decoded.id, address: formData, items: orderItems, amount: getCartAmount() + shippingFee };

      switch (method) {
        case 'cod': {
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { Authorization: `Bearer ${rawToken}` } });
          if (response.data.success) { setCartItems({}); navigate('/orders'); }
          else toast.error(response.data.message);
          break;
        }
        case 'razorpay': {
          const res = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { Authorization: `Bearer ${rawToken}` } });
          if (res.data.success) initPay(res.data.order, decoded.id, orderItems, orderData.amount);
          else toast.error(res.data.message);
          break;
        }
        default: toast.error('Unknown payment method selected.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally { setIsLoading(false); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="mt-20 min-h-screen">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-2">Checkout</h1>
              <p className="text-text/50 font-light flex items-center gap-2"><Package size={16} /> Complete your purchase</p>
            </div>
            <button onClick={() => navigate('/cart')} className="hidden sm:flex items-center gap-2 px-6 py-3 text-secondary hover:text-secondary/80 font-medium transition-colors">
              <ArrowLeft size={18} /><span>Back to Cart</span>
            </button>
          </div>
        </div>
      </section>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-8">
            <div className="p-4 sm:p-6 border-b border-background/30 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <QrCode size={18} className="text-secondary" />
                </div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-text">Scan QR to Pay</h2>
              </div>
              <button onClick={() => { setShowQRModal(false); setTransactionId(''); setTransactionIdError(''); }} className="text-text/50 hover:text-text transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-background/10 to-background/5 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="bg-white p-3 rounded-lg shadow-lg mb-3">
                    <img src={assets.Qr_img} alt="Payment QR Code" className="w-40 h-40 sm:w-48 sm:h-48 object-contain" />
                  </div>
                  <p className="text-xs sm:text-sm text-text/70 text-center font-light mb-2">Scan with any UPI app</p>
                  <p className="text-xl sm:text-2xl font-bold text-secondary">₹{(getCartAmount() + shippingFee).toLocaleString()}</p>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-800 font-medium">ℹ️ Complete payment via UPI, then enter the transaction ID below</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-text/70 uppercase tracking-wider">Transaction ID / UTR Number *</label>
                    <input
                      type="text" value={transactionId}
                      onChange={handleTransactionIdChange}
                      onBlur={() => validateTransactionId(transactionId)}
                      placeholder="Enter UPI transaction/reference ID"
                      className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all font-light text-sm ${
                        transactionIdError
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-background/50 focus:border-secondary focus:ring-secondary/20'
                      }`}
                      required
                    />
                    {transactionIdError && (
                      <div className="flex items-start gap-2 text-red-600 text-xs">
                        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" /><span>{transactionIdError}</span>
                      </div>
                    )}
                    <p className="text-xs text-text/50 font-light">Found in your payment app after completing the transaction</p>
                  </div>
                  <button
                    onClick={handleQRSubmit}
                    disabled={isLoading || !transactionId.trim() || !!transactionIdError}
                    className={`w-full py-3 sm:py-3.5 font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
                      !transactionId.trim() || transactionIdError
                        ? 'bg-background/30 text-text/40 cursor-not-allowed'
                        : 'bg-secondary text-white hover:bg-secondary/90'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading
                      ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /><span>Processing...</span></>
                      : <><CheckCircle size={18} /><span>Confirm & Place Order</span></>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
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
                  {/* Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-text uppercase tracking-wider flex items-center gap-2">
                      <User size={14} className="text-secondary" /> Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">Full Name *</label>
                        <input onChange={onChangeHandler} name="Name" value={formData.Name}
                          className="w-full px-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                          type="text" placeholder="Enter your full name" required />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">Email Address *</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                          <input onChange={onChangeHandler} name="email" value={formData.email}
                            className="w-full pl-10 pr-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                            type="email" placeholder="you@example.com" required />
                        </div>
                      </div>
                    </div>

                    {/* Phone with dial code */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">Phone Number *</label>
                      <div className="flex">
                        <DialCodeSelect options={dialOptions} value={dialCode} onChange={setDialCode} />
                        <input
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 px-4 py-3 border border-l-0 border-background/50 rounded-r-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light text-sm"
                          type="tel" placeholder="Phone number" required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-4 pt-6 border-t border-background/30">
                    <h3 className="text-sm font-semibold text-text uppercase tracking-wider flex items-center gap-2">
                      <MapPin size={14} className="text-secondary" /> Delivery Address
                    </h3>

                    {/* Street */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">Street Address *</label>
                      <input onChange={onChangeHandler} name="street" value={formData.street}
                        className="w-full px-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                        type="text" placeholder="House number, street name" required />
                    </div>

                    {/* Country + State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SearchableSelect
                        label="Country" placeholder="Select country"
                        options={countryOptions} value={countryCode}
                        onChange={handleCountryChange} required
                      />
                      <div>
                        <SearchableSelect
                          label="State / Province"
                          placeholder={countryCode ? (stateOptions.length ? 'Select state' : 'No states listed') : 'Select country first'}
                          options={stateOptions} value={stateCode}
                          onChange={handleStateChange}
                          disabled={!countryCode || stateOptions.length === 0}
                        />
                        {shippingZoneLabel && (
                          <p className={`mt-1.5 text-[10px] font-light flex items-center gap-1 ${shippingZoneLabel.color}`}>
                            <MapPin size={9} /> {shippingZoneLabel.label}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* City + Pincode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SearchableSelect
                        label="City"
                        placeholder={countryCode ? (cityOptions.length ? 'Select city' : 'No cities listed') : 'Select country first'}
                        options={cityOptions} value={cityName}
                        onChange={handleCityChange}
                        disabled={!countryCode || cityOptions.length === 0}
                        required
                      />
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-text/70 uppercase tracking-wider">Postal Code *</label>
                        <input onChange={onChangeHandler} name="pincode" value={formData.pincode}
                          className="w-full px-4 py-3 border border-background/50 rounded-lg bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-light"
                          type="text" maxLength={12}
                          placeholder={
                            countryCode === 'IN' ? 'e.g. 500032'
                            : countryCode === 'US' ? 'e.g. 90210'
                            : countryCode === 'GB' ? 'e.g. SW1A 1AA'
                            : countryCode === 'CA' ? 'e.g. K1A 0A6'
                            : 'Postal / ZIP code'
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="pt-6 border-t border-background/30">
                    <div className="bg-background/10 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="agree-terms" checked={agreeToTerms}
                          onChange={e => setAgreeToTerms(e.target.checked)}
                          className="mt-1 w-5 h-5 text-secondary bg-white border-background/50 focus:ring-secondary focus:ring-2 cursor-pointer rounded" required />
                        <label htmlFor="agree-terms" className="block text-sm text-text/80 cursor-pointer leading-relaxed font-light">
                          I agree to the{' '}
                          <a href="/termsconditions" target="_blank" className="text-secondary font-medium underline hover:text-secondary/80">Terms & Conditions</a>,{' '}
                          <a href="/privacypolicy"   target="_blank" className="text-secondary font-medium underline hover:text-secondary/80">Privacy Policy</a>, and{' '}
                          <a href="/shippingpolicy"  target="_blank" className="text-secondary font-medium underline hover:text-secondary/80">Shipping Policy</a>.
                          I understand that orders are processed within 0-7 days and Aarovi is not liable for courier delays. *
                        </label>
                      </div>
                      {!agreeToTerms && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <p className="text-xs text-red-600 flex items-center gap-2 font-medium">
                            <Shield size={12} /> Please agree to our terms before placing your order
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-5 border border-background/30 rounded-xl bg-gradient-to-br from-background/5 to-background/10">
                      <h4 className="font-semibold text-text text-sm mb-3 flex items-center gap-2">
                        <CheckCircle size={14} className="text-secondary" /> Key Policy Highlights
                      </h4>
                      <ul className="text-xs text-text/70 space-y-2 font-light">
                        <li className="flex items-start gap-2"><span className="text-secondary mt-0.5">•</span><span>Processing time: 0-7 days from order confirmation</span></li>
                        <li className="flex items-start gap-2"><span className="text-secondary mt-0.5">•</span><span>Shipping via registered courier services (domestic & international)</span></li>
                        <li className="flex items-start gap-2"><span className="text-secondary mt-0.5">•</span><span>Aarovi ensures timely handover to courier companies</span></li>
                        <li className="flex items-start gap-2"><span className="text-secondary mt-0.5">•</span><span>Support available at +91 9063284008 or aaroviofficial@gmail.com</span></li>
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
                  <PaymentOption method={method} setMethod={setMethod} type="qr" />
                  {/* <PaymentOption method={method} setMethod={setMethod} type="razorpay" logo={assets.razorpay_logo} /> */}
                  {/* <PaymentOption method={method} setMethod={setMethod} type="cod" /> */}
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
                  <CartTotal overrideShipping={shippingFee} />
                  <div className="space-y-3 pt-6 border-t border-background/30">
                    <button type="submit" disabled={isLoading || !agreeToTerms}
                      className={`group w-full py-4 font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-3 ${
                        !agreeToTerms ? 'bg-background/30 text-text/40 cursor-not-allowed' : 'bg-secondary text-white hover:bg-secondary/90'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}>
                      {isLoading
                        ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /><span>Processing...</span></>
                        : <span>{method === 'qr' ? 'Proceed to Payment' : 'Place Order'}</span>
                      }
                    </button>
                    <button type="button" onClick={() => navigate('/cart')}
                      className="w-full py-4 bg-background/30 text-text font-semibold rounded-full hover:bg-background/50 transition-all duration-300 flex items-center justify-center gap-2">
                      <span>Back to Cart</span>
                    </button>
                  </div>
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

      {/* Sticky mobile bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-4 py-3 shadow-xl">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <p className="text-xs text-stone-500">Total</p>
            <p className="text-base font-bold text-secondary">₹{(getCartAmount() + shippingFee).toLocaleString()}</p>
          </div>
          <button
            onClick={e => { e.preventDefault(); onSubmitHandler(e); }}
            disabled={isLoading || !agreeToTerms}
            className="flex-shrink-0 px-6 py-3 bg-secondary text-white rounded-xl text-sm font-semibold disabled:opacity-40 flex items-center gap-2"
          >
            {isLoading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><CreditCard size={15} />{method === 'qr' ? 'Pay Now' : 'Place Order'}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentOption = ({ method, setMethod, type, logo }) => (
  <div
    onClick={() => setMethod(type)}
    className={`group flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
      method === type ? 'border-secondary bg-secondary/5 shadow-lg' : 'border-background/50 hover:border-background hover:shadow-md'
    }`}
  >
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${method === type ? 'border-secondary' : 'border-background/50'}`}>
      {method === type && <div className="w-2.5 h-2.5 bg-secondary rounded-full" />}
    </div>
    {type === 'qr' ? (
      <div className="flex items-center gap-3 flex-1">
        <div className="bg-background/20 p-2 rounded-lg group-hover:bg-background/30 transition-colors"><QrCode size={18} className="text-text" /></div>
        <div className="flex flex-col">
          <span className="font-semibold text-text">QR Code Payment</span>
          <span className="text-xs text-text/50 font-light">Pay via UPI by scanning QR code</span>
        </div>
      </div>
    ) : logo ? (
      <div className="flex items-center gap-3 flex-1">
        <img className="h-6 object-contain" src={logo} alt={`${type} payment`} />
        <div className="flex flex-col">
          <span className="font-semibold text-text capitalize">{type}</span>
          <span className="text-xs text-text/50 font-light">Credit/Debit Cards, UPI, Net Banking</span>
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-3 flex-1">
        <div className="bg-background/20 p-2 rounded-lg group-hover:bg-background/30 transition-colors"><Package size={18} className="text-text" /></div>
        <div className="flex flex-col">
          <span className="font-semibold text-text">Cash on Delivery</span>
          <span className="text-xs text-text/50 font-light">Pay when you receive your order</span>
        </div>
      </div>
    )}
  </div>
);

export default PlaceOrder;