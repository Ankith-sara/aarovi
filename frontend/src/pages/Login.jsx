import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, User, Lock, Sparkles, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  // Form fields
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    setOtp(updated.join(''));
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // OTP Timer effect
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Handle redirect after login
  const handlePostLoginRedirect = () => {
    const returnUrl = sessionStorage.getItem('returnUrl');
    if (returnUrl) {
      sessionStorage.removeItem('returnUrl');
      navigate(returnUrl);
    } else {
      navigate('/');
    }
  };

  // Redirect if logged in
  useEffect(() => {
    if (token) {
      handlePostLoginRedirect();
    }
  }, [token, navigate]);

  useEffect(() => {
    document.title = 'Login | Aarovi';
  }, []);

  // Reset form when switching between Login/SignUp
  const resetForm = () => {
    setName('');
    setPassword('');
    setEmail('');
    setErrors({});
    setOtpSent(false);
    setOtp('');
    setOtpError('');
    setOtpTimer(0);
    setOtpDigits(Array(6).fill(''));
  };

  // SEND OTP
  const handleSendOtp = async () => {
    setOtpError('');
    setErrors({});

    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setOtpLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/send-otp`, {
        email,
        name,
        password
      });
      if (res.data.success) {
        setOtpSent(true);
        setOtpTimer(60);
        toast.success('OTP sent to your email');
      } else {
        setOtpError(res.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Error sending OTP');
    }
    setOtpLoading(false);
  };

  // VERIFY OTP & CREATE ACCOUNT
  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setOtpError('');

    if (!otp) {
      setOtpError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        name,
        email,
        password,
        otp,
      });

      if (res.data.success) {
        toast.success('Account created successfully!');
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else {
        setOtpError(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Error verifying OTP');
    }
    setIsLoading(false);
  };

  // LOGIN HANDLER
  const handleLogin = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password
      });

      if (response.data.success) {
        toast.success(`Welcome back, ${response.data.name}!`);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-gradient-to-br from-secondary to-text overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo/Brand */}
          <div>
            <h2 className="text-4xl font-serif font-bold text-white mb-2">AAROVI</h2>
            <div className="w-16 h-1 bg-white/60"></div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <Sparkles className="w-16 h-16 text-white/90 mb-6" />
              <h1 className="text-5xl xl:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                Crafted with
                <br />
                Heritage,
                <br />
                Worn with Pride
              </h1>
              <p className="text-xl text-white/80 font-light leading-relaxed max-w-md">
                Join a community that celebrates handcrafted elegance and timeless traditions
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 max-w-md">
              {[
                'Exclusive handcrafted collections',
                'Artisan-made quality pieces',
                'Secure & seamless checkout',
                'Free shipping on all orders'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90" style={{
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                }}>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                  <span className="font-light">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="border-l-4 border-white/40 pl-6">
            <p className="text-lg text-white/80 italic font-light">
              "Where tradition meets contemporary elegance"
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-12 right-12 w-32 h-32 border-2 border-white/20 rounded-full"></div>
        <div className="absolute bottom-12 right-24 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45"></div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-text">AAROVI</h2>
            <div className="w-16 h-1 bg-secondary mx-auto mt-2"></div>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold text-text mb-3">
              {currentState === 'Login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-text/60 font-light text-base">
              {currentState === 'Login'
                ? 'Enter your credentials to access your account'
                : 'Start your journey with handcrafted elegance'}
            </p>
          </div>

          {/* LOGIN FORM */}
          {currentState === 'Login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold text-text/70 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-text/30" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 bg-background/30 border-2 rounded-xl focus:outline-none transition-all duration-300 font-light ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500 bg-red-50/50'
                        : 'border-transparent focus:border-secondary focus:bg-white'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-bold text-text/70 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-text/30" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3.5 bg-background/30 border-2 rounded-xl focus:outline-none transition-all duration-300 font-light ${
                      errors.password
                        ? 'border-red-400 focus:border-red-500 bg-red-50/50'
                        : 'border-transparent focus:border-secondary focus:bg-white'
                    }`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text/40 hover:text-secondary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-4 bg-secondary text-white font-bold tracking-wide rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  'Signing In...'
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {currentState === 'Sign Up' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-xs font-bold text-text/70 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-text/30" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 bg-background/30 border-2 rounded-xl focus:outline-none transition-all duration-300 font-light ${
                      errors.name
                        ? 'border-red-400 focus:border-red-500 bg-red-50/50'
                        : 'border-transparent focus:border-secondary focus:bg-white'
                    }`}
                    placeholder="John Doe"
                    disabled={otpSent}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold text-text/70 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-text/30" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 bg-background/30 border-2 rounded-xl focus:outline-none transition-all duration-300 font-light ${
                      errors.email
                        ? 'border-red-400 focus:border-red-500 bg-red-50/50'
                        : 'border-transparent focus:border-secondary focus:bg-white'
                    }`}
                    placeholder="your.email@example.com"
                    disabled={otpSent}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-bold text-text/70 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-text/30" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-3.5 bg-background/30 border-2 rounded-xl focus:outline-none transition-all duration-300 font-light ${
                      errors.password
                        ? 'border-red-400 focus:border-red-500 bg-red-50/50'
                        : 'border-transparent focus:border-secondary focus:bg-white'
                    }`}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    disabled={otpSent}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text/40 hover:text-secondary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>
                  )}
                </div>
              </div>

              {!otpSent && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  className="w-full mt-6 py-4 bg-secondary text-white font-bold tracking-wide rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm flex items-center justify-center gap-2 group"
                >
                  {otpLoading ? (
                    'Sending Code...'
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              )}

              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-5 pt-4">
                  <div className="bg-gradient-to-br from-background/40 to-primary/30 rounded-2xl p-6 border-2 border-background">
                    <div className="text-center mb-5">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                        <Mail size={20} className="text-secondary" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-text mb-1">Verify Your Email</h3>
                      <p className="text-text/60 font-light text-sm">Enter the 6-digit code we sent to your email</p>
                    </div>

                    <div className="flex gap-2 justify-center mb-5">
                      {Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <input
                            key={i}
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            ref={(el) => (otpRefs.current[i] = el)}
                            value={otpDigits[i] || ''}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className="w-11 h-14 text-center text-xl font-bold border-2 border-background focus:border-secondary focus:outline-none transition-all duration-300 bg-white rounded-xl shadow-sm"
                          />
                        ))}
                    </div>

                    {otpError && (
                      <p className="text-red-500 text-sm text-center font-medium mb-4 bg-red-50 py-2 rounded-lg">{otpError}</p>
                    )}

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading || otpTimer > 0}
                        className="text-sm text-secondary hover:text-[#8B6F47] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend Code'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-secondary text-white font-bold tracking-wide rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      'Verifying...'
                    ) : (
                      <>
                        <span>Verify & Create Account</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Switch State */}
          <div className="mt-8 pt-6 border-t border-background">
            <p className="text-center text-text/60 font-light text-sm">
              {currentState === 'Login' ? (
                <>
                  New to Aarovi?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentState('Sign Up');
                      resetForm();
                    }}
                    className="text-secondary font-bold hover:text-secondary/80 transition-colors"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentState('Login');
                      resetForm();
                    }}
                    className="text-secondary font-bold hover:text-secondary/80 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;