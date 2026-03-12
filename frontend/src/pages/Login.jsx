import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';

// Google client ID from env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const otpRefs = useRef([]);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      const returnUrl = sessionStorage.getItem('returnUrl');
      sessionStorage.removeItem('returnUrl');
      navigate(returnUrl || '/');
    }
  }, [token]);

  useEffect(() => { document.title = 'Sign In | Aarovi'; }, []);

  // OTP countdown
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  // Load Google Sign-In script once
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || window.google) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // ── OTP input handlers ─────────────────────────────────────────────────
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

  const handleEmailContinue = async () => {
    if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address');
      return;
    }
    setEmailError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/send-otp`, { email, name: '' });

      if (res.data.success) {
        setIsNewUser(false);
        setStep('otp');
        setOtpTimer(60);
        setOtpDigits(Array(6).fill(''));
        toast.success('Verification code sent to your email');
      }
    } catch (err) {
      const msg = err.response?.data?.message || '';

      if (msg.toLowerCase().includes('name is required')) {
        setIsNewUser(true);
        setStep('name');
      } else if (msg.toLowerCase().includes('wait')) {
        setIsNewUser(false);
        setStep('otp');
        toast.info(msg);
      } else {
        toast.error(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameContinue = async () => {
    if (!name.trim() || name.trim().length < 2) {
      setNameError('Enter your full name (min 2 characters)');
      return;
    }
    setNameError('');
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/send-otp`, { email, name: name.trim() });
      if (res.data.success) {
        setStep('otp');
        setOtpTimer(60);
        setOtpDigits(Array(6).fill(''));
        toast.success('Verification code sent to your email');
      } else {
        toast.error(res.data.message || 'Failed to send code');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending code');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────
  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/api/user/send-otp`, { email, name: name.trim() || undefined });
      setOtpTimer(60);
      setOtpDigits(Array(6).fill(''));
      toast.success('New code sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resending code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join('');
    if (otp.length < 6) { toast.error('Enter all 6 digits'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/verify-otp`, { email, otp });
      if (res.data.success) {
        toast.success(isNewUser ? `Welcome, ${res.data.name}! 🎉` : 'Welcome back!');
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

  // ── Google Sign-In ────────────────────────────────────────────────────
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
          const res = await axios.post(`${backendUrl}/api/user/google-signin`, { credential });
          if (res.data.success) {
            toast.success(`Welcome, ${res.data.name}!`);
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

  // ── Reset to email step ───────────────────────────────────────────────
  const resetToEmail = () => {
    setStep('email');
    setName('');
    setIsNewUser(false);
    setOtpDigits(Array(6).fill(''));
    setOtpTimer(0);
    setNameError('');
  };

  // ── UI ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&amp;q=80"
          alt="Aarovi Indian fashion"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/65" />

        <div className="relative z-10 flex flex-col justify-between p-14 xl:p-20 w-full">
          <span className="text-white/90 text-xs tracking-[0.3em] uppercase font-semibold">
            Aarovi
          </span>

          <div className="space-y-5">
            <div className="w-10 h-px bg-white/50" />
            <h2 className="text-5xl xl:text-6xl font-light text-white tracking-tight leading-[1.1]"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
              Where tradition<br />meets elegance
            </h2>
            <p className="text-white/75 text-base font-light leading-relaxed max-w-sm"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
              Handcrafted Indian fashion, made for you. Every stitch tells a story.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <div className="h-1.5 w-6 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 bg-primary min-h-screen">

        <div className="lg:hidden mb-10 text-center">
          <h1 className="text-3xl font-light tracking-[0.15em] text-secondary uppercase">Aarovi</h1>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-light text-text tracking-tight">
              {step === 'email' && 'Sign in or sign up'}
              {step === 'name' && 'Create your account'}
              {step === 'otp' && (isNewUser ? 'Verify your email' : 'Welcome back')}
            </h2>
            <p className="text-sm text-text/50 mt-2">
              {step === 'email' && 'Enter your email to continue'}
              {step === 'name' && 'What should we call you?'}
              {step === 'otp' && `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {/* ── Email step ── */}
          {step === 'email' && (
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm font-medium text-text"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                  <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-text/50 mb-2 font-medium">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleEmailContinue()}
                    placeholder="you@example.com"
                    autoFocus
                    className={`w-full pl-10 pr-4 py-3.5 border rounded-lg text-sm outline-none transition-all text-text placeholder-stone-400 bg-white
                      ${emailError ? 'border-red-400 bg-red-50' : 'border-stone-300 focus:border-secondary'}`}
                  />
                </div>
                {emailError && <p className="text-red-500 text-xs mt-1.5">{emailError}</p>}
              </div>

              <button
                onClick={handleEmailContinue}
                disabled={loading}
                className="w-full py-3.5 bg-secondary text-background rounded-lg text-sm font-semibold tracking-wide hover:bg-secondary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                  : <span>Continue</span>}
              </button>
            </div>
          )}

          {step === 'name' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-text/50 mb-2 font-medium">
                  Your full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setNameError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleNameContinue()}
                  placeholder="Priya Sharma"
                  autoFocus
                  className={`w-full px-4 py-3.5 border rounded-lg text-sm outline-none transition-all text-text placeholder-stone-400 bg-white
                    ${nameError ? 'border-red-400 bg-red-50' : 'border-stone-300 focus:border-secondary'}`}
                />
                {nameError && <p className="text-red-500 text-xs mt-1.5">{nameError}</p>}
              </div>

              <button
                onClick={handleNameContinue}
                disabled={loading}
                className="w-full py-3.5 bg-secondary text-background rounded-lg text-sm font-semibold tracking-wide hover:bg-secondary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                  : <><span>Send verification code</span><ArrowRight size={16} /></>}
              </button>

              <button
                onClick={resetToEmail}
                className="w-full text-xs text-text/40 hover:text-text/60 transition-colors py-1"
              >
                ← Change email
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-text/50 mb-4 font-medium">
                  Verification code
                </label>
                <div className="flex gap-2">
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
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold border-2 border-stone-200 rounded-lg focus:border-secondary focus:outline-none transition-colors bg-white text-text"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otpDigits.join('').length < 6}
                className="w-full py-3.5 bg-secondary text-background rounded-lg text-sm font-semibold tracking-wide hover:bg-secondary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full animate-spin" />
                  : <span>{isNewUser ? 'Create Account' : 'Sign In'}</span>}
              </button>

              <div className="text-center space-y-3">
                <button
                  onClick={handleResend}
                  disabled={otpTimer > 0 || loading}
                  className="text-xs text-secondary hover:text-secondary/70 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {otpTimer > 0 ? `Resend code in ${otpTimer}s` : 'Resend code'}
                </button>
                <br />
                <button
                  onClick={resetToEmail}
                  className="text-xs text-text/40 hover:text-text/60 transition-colors"
                >
                  Change email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;