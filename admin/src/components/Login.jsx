import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Shield, Mail, User, ArrowRight, Sparkles } from 'lucide-react';
import { backendUrl } from '../App';

const AdminLogin = ({ setToken }) => {
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[i] = val;
    setOtpDigits(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const sendOtp = async () => {
    if (!isValidEmail(email)) { toast.error('Enter a valid email address'); return; }
    if (mode === 'register' && (!name.trim() || name.trim().length < 2)) {
      toast.error('Enter your full name (min 2 characters)');
      return;
    }
    setLoading(true);
    try {
      const payload = { email };
      if (mode === 'register') payload.name = name.trim();
      const res = await axios.post(`${backendUrl}/api/user/send-admin-otp`, payload);
      if (res.data.success) {
        setStep('otp');
        setOtpTimer(60);
        setOtpDigits(Array(6).fill(''));
        toast.success('Verification code sent to your email');
      } else {
        toast.error(res.data.message || 'Failed to send code');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error sending code';
      if (msg.toLowerCase().includes('wait')) {
        setStep('otp');
        toast.info(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otp = otpDigits.join('');
    if (otp.length < 6) { toast.error('Enter all 6 digits'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/verify-admin-otp`, { email, otp });
      if (res.data.success) {
        toast.success(res.data.message || 'Welcome!');
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
      } else {
        toast.error(res.data.message || 'Invalid code');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resetToEmail = () => {
    setStep('email');
    setOtpDigits(Array(6).fill(''));
    setOtpTimer(0);
  };

  const switchMode = (m) => {
    setMode(m);
    setStep('email');
    setEmail('');
    setName('');
    setOtpDigits(Array(6).fill(''));
    setOtpTimer(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-2xl shadow-lg mb-4">
            <Shield className="text-white" size={30} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Aarovi management dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {step === 'email' && (
            <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
              {(['login', 'register']).map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all
                    ${mode === m ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>
          )}

          {/* ── Email step ── */}
          {step === 'email' && (
            <div className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Admin Name"
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-secondary transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendOtp()}
                    placeholder="admin@aarovi.com"
                    autoFocus={mode === 'login'}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-3.5 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Send Verification Code</span><ArrowRight size={15} /></>}
              </button>
            </div>
          )}

          {/* ── OTP step ── */}
          {step === 'otp' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 rounded-2xl mb-3">
                  <Sparkles className="text-secondary" size={24} />
                </div>
                <p className="text-sm text-gray-500">
                  Code sent to <span className="font-semibold text-gray-900">{email}</span>
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)}
                    style={{ height: '52px' }}
                    className="w-11 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:border-secondary focus:outline-none transition-colors"
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading || otpDigits.join('').length < 6}
                className="w-full py-3.5 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Verify & Continue'}
              </button>

              <div className="text-center space-y-2">
                <button
                  onClick={sendOtp}
                  disabled={otpTimer > 0 || loading}
                  className="text-xs text-secondary hover:text-secondary/70 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend code'}
                </button>
                <br />
                <button
                  onClick={resetToEmail}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Change email
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
          <Shield size={12} /> Secure admin access · Aarovi
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;