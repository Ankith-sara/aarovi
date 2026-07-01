import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ArrowRight, Mail } from 'lucide-react';
import { auth, googleProvider } from '../configs/firebase';
import { signInWithPopup } from 'firebase/auth';

const C = { primary: '#4F200D', gold: '#AF8255', bg: '#FBF7F3', text: '#2A1506' };

const Label = ({ children }) => (
  <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: 'rgba(42,21,6,0.5)' }}>{children}</label>
);

const Input = ({ error, ...props }) => (
  <input {...props}
    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all font-light"
    style={{ background: 'white', border: `1.5px solid ${error ? '#ef4444' : 'rgba(79,32,13,0.18)'}`, color: C.text }}
    onFocus={e => { if (!error) e.target.style.borderColor = C.primary; }}
    onBlur={e => { if (!error) e.target.style.borderColor = 'rgba(79,32,13,0.18)'; }} />
);

const PrimaryBtn = ({ children, loading, disabled, type = 'button', onClick }) => (
  <button type={type} onClick={onClick} disabled={disabled || loading}
    className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:-translate-y-0.5"
    style={{ background: C.primary, color: 'white', boxShadow: '0 4px 20px rgba(79,32,13,0.22)' }}>
    {loading
      ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      : children}
  </button>
);

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => { 
    if (token) { 
      const r = sessionStorage.getItem('returnUrl'); 
      sessionStorage.removeItem('returnUrl'); 
      navigate(r || '/'); 
    } 
  }, [token]);

  useEffect(() => { 
    document.title = mode === 'login' ? 'Sign In | Aarovi' : 'Sign Up | Aarovi'; 
  }, [mode]);

  const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleAuthSubmit = async (e) => {
    if (e) e.preventDefault();
    
    let valid = true;
    if (!isValidEmail(email)) { setEmailError('Enter a valid email address'); valid = false; } else { setEmailError(''); }
    if (!password || password.length < 8) { setPasswordError('Password must be at least 8 characters'); valid = false; } else { setPasswordError(''); }
    if (mode === 'signup' && (!name.trim() || name.trim().length < 2)) { setNameError('Enter your full name (min 2 characters)'); valid = false; } else { setNameError(''); }

    if (!valid) return;
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (res.data.success) {
          toast.success(`Welcome back, ${res.data.name || 'User'}!`);
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
        }
      } else {
        const res = await axios.post(`${backendUrl}/api/user/register`, { name: name.trim(), email, password });
        if (res.data.success) {
          toast.success(`Welcome, ${res.data.name}! Your account has been created.`);
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const res = await axios.post(`${backendUrl}/api/auth/google`, { idToken });
      
      if (res.data.success) {
        toast.success(`Welcome, ${res.data.user?.fullName || res.data.user?.name || 'User'}!`);
        setToken(res.data.accessToken);
        localStorage.setItem('token', res.data.accessToken);
      } else {
        toast.error(res.data.message || 'Google sign-in failed.');
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        toast.info('Google sign-in popup closed.');
      } else {
        toast.error(err.response?.data?.message || err.message || 'Google sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — editorial image */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80" alt="Aarovi Indian fashion"
             className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)' }} />
        <div className="relative z-10 flex flex-col justify-between p-14 xl:p-20 w-full">
          <span className="text-white/80 text-[11px] tracking-[0.3em] uppercase font-semibold">Aarovi</span>
          <div className="space-y-5">
            <div className="w-10 h-px" style={{ background: 'rgba(175,130,85,0.7)' }} />
            <h2 className="text-5xl xl:text-6xl font-light text-white tracking-tight leading-[1.08]"
                style={{ fontFamily: "'Cormorant Garamond',serif" }}>
              Where tradition<br />meets elegance
            </h2>
            <p className="text-white/70 text-base font-light leading-relaxed max-w-sm">
              Handcrafted Indian fashion, made for you. Every stitch tells a story.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-12 min-h-screen" style={{ background: C.bg }}>

        <div className="lg:hidden mb-10 text-center">
          <p className="text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond',serif", color: C.primary }}>Aarovi</p>
          <p className="text-[10px] uppercase tracking-[0.25em] mt-1" style={{ color: C.gold }}>Ethnic Wear</p>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight" style={{ color: C.text }}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-sm font-light mt-2" style={{ color: 'rgba(42,21,6,0.5)' }}>
              {mode === 'login' ? 'Enter your credentials to sign in' : 'Fill in the form to get started'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <button type="button" onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-sm font-medium transition-all hover:shadow-md"
                    style={{ background: 'white', border: '1.5px solid rgba(79,32,13,0.15)', color: C.text }}>
              <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'rgba(79,32,13,0.1)' }} />
              <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(42,21,6,0.4)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(79,32,13,0.1)' }} />
            </div>

            {mode === 'signup' && (
              <div>
                <Label>Full Name</Label>
                <Input type="text" value={name} onChange={e => { setName(e.target.value); setNameError(''); }}
                       placeholder="Priya Sharma" error={nameError} />
                {nameError && <p className="text-red-500 text-xs mt-1.5">{nameError}</p>}
              </div>
            )}

            <div>
              <Label>Email address</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(42,21,6,0.35)' }} />
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                       placeholder="you@example.com"
                       className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all font-light"
                       style={{ background: 'white', border: `1.5px solid ${emailError ? '#ef4444' : 'rgba(79,32,13,0.18)'}`, color: C.text }}
                       onFocus={e => { if (!emailError) e.target.style.borderColor = C.primary; }}
                       onBlur={e => { if (!emailError) e.target.style.borderColor = 'rgba(79,32,13,0.18)'; }} />
              </div>
              {emailError && <p className="text-red-500 text-xs mt-1.5">{emailError}</p>}
            </div>

            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                     placeholder="Min. 8 characters" error={passwordError} />
              {passwordError && <p className="text-red-500 text-xs mt-1.5">{passwordError}</p>}
            </div>

            <div className="pt-2">
              <PrimaryBtn type="submit" loading={loading}>
                <span>{mode === 'login' ? 'Sign In' : 'Register'}</span> <ArrowRight size={15} />
              </PrimaryBtn>
            </div>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setEmailError(''); setPasswordError(''); setNameError(''); }}
                    className="text-xs transition-colors hover:underline" style={{ color: C.primary }}>
              {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
