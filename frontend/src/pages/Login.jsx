import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Mail, User, Lock, ArrowRight, X } from 'lucide-react';

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
    <div className="min-h-screen relative overflow-hidden bg-stone-50">
      {/* Fashion Model Background */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[55%]">
        <div className="relative w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80" 
            alt="Fashion" 
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-12 xl:p-16 text-white">
            <div className="max-w-md">
              <div className="mb-6">
                <div className="w-16 h-px bg-white/60 mb-4"></div>
                <h2 className="text-5xl xl:text-6xl font-light tracking-tight mb-4">
                  AAROVI
                </h2>
              </div>
              <p className="text-lg font-light text-white/90 leading-relaxed">
                Where tradition meets contemporary elegance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="min-h-screen lg:ml-[55%] flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-12 h-px bg-stone-300 mx-auto mb-4"></div>
            <h2 className="text-3xl font-light tracking-tight text-stone-900">AAROVI</h2>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-stone-200 p-8 lg:p-10">
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-light tracking-tight text-stone-900 mb-2">
                {currentState === 'Login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <div className="w-12 h-px bg-secondary mt-4"></div>
            </div>

            {/* LOGIN FORM */}
            {currentState === 'Login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-0 py-3 bg-transparent border-b-2 transition-colors focus:outline-none text-stone-900 placeholder-stone-400 ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-stone-300 focus:border-secondary'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-0 py-3 pr-10 bg-transparent border-b-2 transition-colors focus:outline-none text-stone-900 placeholder-stone-400 ${
                        errors.password
                          ? 'border-red-500'
                          : 'border-stone-300 focus:border-secondary'
                      }`}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-8 py-4 bg-secondary text-white font-medium tracking-widest uppercase text-sm hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    'Signing In...'
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* SIGNUP FORM */}
            {currentState === 'Sign Up' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-0 py-3 bg-transparent border-b-2 transition-colors focus:outline-none text-stone-900 placeholder-stone-400 ${
                      errors.name
                        ? 'border-red-500'
                        : 'border-stone-300 focus:border-secondary'
                    }`}
                    placeholder="John Doe"
                    disabled={otpSent}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-2">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-0 py-3 bg-transparent border-b-2 transition-colors focus:outline-none text-stone-900 placeholder-stone-400 ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-stone-300 focus:border-secondary'
                    }`}
                    placeholder="your@email.com"
                    disabled={otpSent}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-2 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-0 py-3 pr-10 bg-transparent border-b-2 transition-colors focus:outline-none text-stone-900 placeholder-stone-400 ${
                        errors.password
                          ? 'border-red-500'
                          : 'border-stone-300 focus:border-secondary'
                      }`}
                      placeholder="Create password"
                      autoComplete="new-password"
                      disabled={otpSent}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                  )}
                </div>

                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="w-full mt-8 py-4 bg-secondary text-white font-medium tracking-widest uppercase text-sm hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {otpLoading ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Code
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                )}

                {otpSent && (
                  <form onSubmit={handleVerifyOtp} className="space-y-6 pt-6 border-t border-stone-200">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-600 mb-4 font-medium">
                        Verification Code
                      </label>
                      
                      <div className="flex gap-2 mb-4">
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
                              className="w-full h-14 text-center text-xl font-light border-b-2 border-stone-300 focus:border-secondary focus:outline-none transition-colors bg-transparent"
                            />
                          ))}
                      </div>

                      {otpError && (
                        <p className="text-red-500 text-xs mb-4">{otpError}</p>
                      )}

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading || otpTimer > 0}
                        className="text-xs uppercase tracking-wider text-secondary hover:text-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend Code'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-secondary text-white font-medium tracking-widest uppercase text-sm hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      {isLoading ? (
                        'Verifying...'
                      ) : (
                        <>
                          Create Account
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Switch State */}
            <div className="mt-8 pt-8 border-t border-stone-200 text-center">
              <p className="text-sm text-stone-600">
                {currentState === 'Login' ? (
                  <>
                    New customer?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentState('Sign Up');
                        resetForm();
                      }}
                      className="text-secondary hover:text-secondary/80 transition-colors font-medium underline"
                    >
                      Create account
                    </button>
                  </>
                ) : (
                  <>
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentState('Login');
                        resetForm();
                      }}
                      className="text-secondary hover:text-secondary/80 transition-colors font-medium underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;