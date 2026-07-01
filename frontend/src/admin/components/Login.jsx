import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Shield, Mail, User, ArrowRight, Sparkles } from 'lucide-react';
import { backendUrl } from '../AdminLayout';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
    if (!GOOGLE_CLIENT_ID || window.google) return;
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    document.head.appendChild(s);
  }, []);

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

  const handleGoogleSignIn = () => {
    if (!window.google || !GOOGLE_CLIENT_ID) {
      toast.info('Google Sign-In is not configured yet.');
      return;
    }
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        setLoading(true);
        try {
          const res = await axios.post(`${backendUrl}/api/user/admin-google-signin`, { credential });
          if (res.data.success) {
            toast.success(res.data.message || 'Welcome!');
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
          } else {
            toast.error(res.data.message || 'Google sign-in failed');
          }
        } catch (err) {
          toast.error(err.response?.data?.message || 'Google sign-in failed');
        } finally {
          setLoading(false);
        }
      },
    });
    window.google.accounts.id.prompt();
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center mb-4">
            <span className="font-polysans text-4xl font-bold tracking-tight text-text relative">
              aarovi
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gold rounded-full"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gold mt-2 font-inter">
              Admin Panel
            </span>
          </div>
          <p className="text-sm text-text/60 font-light mt-1">Aarovi management dashboard</p>
        </div>

        <div className="space-y-6">

          {step === 'email' && (
            <div className="flex rounded-lg bg-background/50 p-1 mb-6">
              {(['login', 'register']).map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all
                    ${mode === m ? 'bg-secondary text-primary shadow-sm' : 'text-text/60 hover:text-text'}`}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>
          )}

          {/* ── Email step ── */}
          {step === 'email' && (
            <div className="space-y-4">
              {mode === 'login' && (
                <>
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-secondary/20 rounded-full text-sm font-semibold text-text hover:bg-secondary/5 transition-all shadow-sm"
                  >
                    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                      <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-secondary/10" />
                    <span className="text-[10px] font-semibold text-text/45 uppercase tracking-wider font-inter">or</span>
                    <div className="flex-1 h-px bg-secondary/10" />
                  </div>
                </>
              )}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-text/75 uppercase tracking-wider mb-2 font-inter">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Admin Name"
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-lg text-sm bg-primary text-text focus:outline-none focus:border-secondary transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text/75 uppercase tracking-wider mb-2 font-inter">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendOtp()}
                    placeholder="admin@aarovi.com"
                    autoFocus={mode === 'login'}
                    className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-lg text-sm bg-primary text-text focus:outline-none focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-3 bg-secondary text-primary rounded-full text-sm font-semibold hover:bg-secondary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  : <><span>Send Verification Code</span><ArrowRight size={15} /></>}
              </button>
            </div>
          )}

          {/* ── OTP step ── */}
          {step === 'otp' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-background/60 rounded-lg mb-3">
                  <Sparkles className="text-gold" size={24} />
                </div>
                <p className="text-sm text-text/60 font-light">
                  Code sent to <span className="font-semibold text-text">{email}</span>
                </p>
              </div>

              <div className="flex justify-center gap-3">
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
                    className={`
                      w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl border-2 transition-all duration-300
                      ${d 
                        ? 'border-gold bg-white text-text shadow-sm' 
                        : 'border-secondary/15 bg-background/25 text-text/80'
                      }
                      focus:border-gold focus:ring-4 focus:ring-gold/15 focus:outline-none
                    `}
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading || otpDigits.join('').length < 6}
                className="w-full py-3 bg-secondary text-primary rounded-full text-sm font-semibold hover:bg-secondary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  : 'Verify & Continue'}
              </button>

              <div className="text-center space-y-2">
                <button
                  onClick={sendOtp}
                  disabled={otpTimer > 0 || loading}
                  className="text-xs text-gold hover:text-gold/80 disabled:text-text/40 disabled:cursor-not-allowed font-medium"
                >
                  {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend code'}
                </button>
                <br />
                <button
                  onClick={resetToEmail}
                  className="text-xs text-text/40 hover:text-text/60"
                >
                  Change email
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-text/40 mt-6 flex items-center justify-center gap-2">
          <Shield size={12} /> Secure admin access · Aarovi
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;