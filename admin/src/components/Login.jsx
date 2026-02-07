import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { backendUrl } from '../App';

const Login = ({ setToken }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  // OTP handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);
    setOtp(updated.join(''));
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter a valid email');
    if (!name) return toast.error('Please enter your full name');
    if (!password) return toast.error('Please enter a password');
    if (password.length < 8) return toast.error('Password must be at least 8 characters');

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/send-admin-otp`, {
        email,
        name,
        password
      });

      if (res.data.success) {
        setOtpSent(true);
        setOtpTimer(60);
        toast.success('OTP sent to your email');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return toast.error('Enter the complete 6-digit OTP');

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/verify-admin-otp`, {
        email,
        otp
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Admin registration successful');
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else {
        toast.error(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/admin-login`, { email, password });
      if (res.data.success) {
        toast.success('Admin login successful');
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const toggleFormMode = () => {
    setIsRegistering(!isRegistering);
    setName('');
    setEmail('');
    setPassword('');
    setOtp('');
    setOtpSent(false);
    setOtpDigits(Array(6).fill(''));
    setOtpTimer(0);
    setShowPassword(false);
  };

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="text-white" size={28} />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-text text-center mb-2">
            Admin {isRegistering ? 'Registration' : 'Portal'}
          </h1>
          <p className="text-sm text-text/60 text-center font-light">
            {isRegistering ? 'Create your admin account with verified access' : 'Welcome back! Sign in to manage your platform'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {!otpSent ? (
            <form onSubmit={isRegistering ? handleSendOtp : handleLogin} className="space-y-5">
              {/* Name Field (Registration only) */}
              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" size={18} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-all font-medium text-text"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" size={18} />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-all font-medium text-text"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text/40" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition-all font-medium text-text"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text/40 hover:text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isRegistering && (
                  <p className="text-xs text-text/50 mt-1.5 ml-1">Must be at least 8 characters</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-4 px-4 rounded-lg font-bold uppercase tracking-wider hover:bg-secondary/90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 mt-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isRegistering ? 'Send Verification Code' : 'Sign In'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Sparkles className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-text mb-2">Verify Your Email</h3>
                <p className="text-sm text-text/60 font-light">
                  We've sent a 6-digit verification code to<br />
                  <span className="font-semibold text-secondary">{email}</span>
                </p>
              </div>

              {/* OTP Input Grid */}
              <div className="flex justify-center gap-2.5 mb-6">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center border-2 border-gray-200 rounded-lg text-xl font-bold focus:outline-none focus:border-secondary transition-all shadow-sm"
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-center mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-semibold text-text/60 mb-2 uppercase tracking-wide">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpTimer > 0 || loading}
                  className="text-sm text-secondary hover:text-secondary/80 font-bold disabled:text-text/30 disabled:cursor-not-allowed transition-colors uppercase tracking-wide"
                >
                  {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend Code'}
                </button>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-secondary text-white py-4 px-4 rounded-lg font-bold uppercase tracking-wider hover:bg-secondary/90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Verify & Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-text/60 hover:text-text py-3 text-sm font-semibold transition-colors uppercase tracking-wide"
              >
                ← Back to Registration
              </button>
            </form>
          )}

          {/* Toggle Form Mode */}
          {!otpSent && (
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-text/60 mb-3 font-light">
                {isRegistering ? 'Already have an admin account?' : 'Need to create an admin account?'}
              </p>
              <button
                onClick={toggleFormMode}
                className="text-secondary font-bold hover:text-secondary/80 transition-colors text-sm uppercase tracking-wide"
              >
                {isRegistering ? 'Sign In Instead' : 'Create New Account'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield size={14} className="text-text/40" />
            <p className="text-xs text-text/50 font-medium uppercase tracking-wide">
              Secure Admin Access
            </p>
          </div>
          <p className="text-xs text-text/40 font-light">
            Powered by advanced verification system
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;