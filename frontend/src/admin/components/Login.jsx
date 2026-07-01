import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Shield, Mail, User, Lock, ArrowRight } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../configs/firebase';
import { backendUrl } from '../AdminLayout';

const AdminLogin = ({ setToken }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = mode === 'login' ? 'Admin Login | Aarovi' : 'Admin Register | Aarovi';
  }, [mode]);

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleAuthSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!isValidEmail(email)) { toast.error('Enter a valid email address'); return; }
    if (!password || password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (mode === 'register' && (!name.trim() || name.trim().length < 2)) {
      toast.error('Enter your full name (min 2 characters)');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await axios.post(`${backendUrl}/api/user/login-admin`, { email, password });
        if (res.data.success) {
          toast.success(res.data.message || 'Welcome Admin!');
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
        } else {
          toast.error(res.data.message || 'Failed to login');
        }
      } else {
        const res = await axios.post(`${backendUrl}/api/user/register-admin`, { name: name.trim(), email, password });
        if (res.data.success) {
          toast.success(res.data.message || 'Welcome Admin!');
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
        } else {
          toast.error(res.data.message || 'Failed to register');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const res = await axios.post(`${backendUrl}/api/auth/google`, { idToken, role: 'admin' });
      
      if (res.data.success) {
        toast.success(`Welcome, ${res.data.user?.fullName || res.data.user?.name || 'Admin'}!`);
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

  const switchMode = (m) => {
    setMode(m);
    setEmail('');
    setName('');
    setPassword('');
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

          <div className="flex rounded-lg bg-background/50 p-1 mb-6">
            {(['login', 'register']).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all
                  ${mode === m ? 'bg-secondary text-primary shadow-sm' : 'text-text/60 hover:text-text'}`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-secondary/20 rounded-full text-sm font-semibold text-text hover:bg-secondary/5 transition-all shadow-sm bg-primary"
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
                  placeholder="admin@aarovi.com"
                  className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-lg text-sm bg-primary text-text focus:outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text/75 uppercase tracking-wider mb-2 font-inter">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-4 py-3 border border-secondary/20 rounded-lg text-sm bg-primary text-text focus:outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-secondary text-primary rounded-full text-sm font-semibold hover:bg-secondary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                : <><span>{mode === 'login' ? 'Sign In' : 'Register'}</span><ArrowRight size={15} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text/40 mt-6 flex items-center justify-center gap-2">
          <Shield size={12} /> Secure admin access · Aarovi
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;