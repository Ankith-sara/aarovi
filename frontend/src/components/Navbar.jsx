import React, { useState, useEffect, useContext, useRef } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ChevronDown, X, Search, User, LogOut, ShoppingBag, Heart, AlertCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const C = { bg: '#FBF7F3', primary: '#4F200D', gold: '#AF8255', text: '#2A1506' };

const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full z-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
          <AlertCircle size={20} className="text-red-500" />
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: C.text }}>Sign out of Aarovi?</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(42,21,6,0.5)' }}>You'll need to sign in again to access your account.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-medium border-2 border-gray-200 hover:border-gray-300 transition-all" style={{ color: 'rgba(42,21,6,0.7)' }}>Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all shadow-md">Sign out</button>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { setShowSearch, getWishlistCount, getCartCount, navigate, token, setToken, setCartItems, setSelectedSubCategory } = useContext(ShopContext) ?? {};
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showWomenDropdown, setShowWomenDropdown] = useState(false);
  const [showMenDropdown, setShowMenDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userId, setUserId] = useState('');

  const location = useLocation();
  const menuRef = useRef(null);
  const womenRef = useRef(null);
  const menRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!token) { setUserId(''); return; }
    try { const d = jwtDecode(token); setUserId(d.id || ''); } catch { setUserId(''); }
  }, [token]);

  useEffect(() => {
    setShowWomenDropdown(false); setShowMenDropdown(false);
    setShowProfileDropdown(false); setMenuVisible(false);
  }, [location.pathname]);

  const logout = () => { setToken(''); localStorage.removeItem('token'); setCartItems({}); setShowLogoutModal(false); navigate('/login'); };

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuVisible(false);
      if (womenRef.current && !womenRef.current.contains(e.target)) setShowWomenDropdown(false);
      if (menRef.current && !menRef.current.contains(e.target)) setShowMenDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileDropdown(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuVisible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuVisible]);

  const CATEGORIES = [
    { name: 'Women', id: 'women', subs: [{ name: 'Kurtis', path: '/shop/Kurtis' }, { name: 'Kurti Sets', path: '/shop/Kurti-Sets' }, { name: 'Anarkalis', path: '/shop/Anarkalis' }, { name: 'Lehengas', path: '/shop/Lehangas' }, { name: 'Sheraras', path: '/shop/Sheraras' }] },
    { name: 'Men', id: 'men', subs: [{ name: 'Kurtas', path: '/shop/Kurtas' }] },
  ];

  const handleCat = (name) => { setSelectedSubCategory(name); setShowWomenDropdown(false); setShowMenDropdown(false); setMenuVisible(false); };

  const Dropdown = ({ label, dropRef, isOpen, onToggle, items, header }) => (
    <div ref={dropRef} className="relative">
      <button onClick={onToggle} className="flex items-center gap-1 text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-200"
        style={{ color: isOpen ? C.primary : 'rgba(42,21,6,0.55)' }}>
        {label}
        <ChevronDown size={11} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`absolute top-full left-0 mt-3 w-52 transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'}`}>
        <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: 'rgba(79,32,13,0.08)' }}>
          <div className="px-4 py-2.5 border-b" style={{ background: C.bg, borderColor: 'rgba(79,32,13,0.08)' }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.gold }}>{header}</p>
          </div>
          <div className="py-1.5">
            {items.map(sub => (
              <NavLink key={sub.path} to={sub.path} onClick={() => handleCat(sub.name)}
                className={({ isActive }) => `block px-4 py-2.5 text-xs font-medium tracking-wide transition-colors duration-150 ${isActive ? 'text-[#4F200D] bg-[#FBF7F3]' : 'text-[rgba(42,21,6,0.65)] hover:bg-[#FBF7F3] hover:text-[#2A1506]'}`}>
                {sub.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  return (
    <>
      {/* Mobile backdrop */}
      <div className={`fixed inset-0 transition-all duration-300 z-40 lg:hidden ${menuVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(42,21,6,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={() => setMenuVisible(false)} aria-hidden="true" />

      {showLogoutModal && <LogoutModal onConfirm={logout} onCancel={() => setShowLogoutModal(false)} />}

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}
        style={{ background: isScrolled ? 'rgba(251,247,243,0.97)' : 'rgba(251,247,243,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${isScrolled ? 'rgba(79,32,13,0.12)' : 'transparent'}` }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={assets.logo} alt="Aarovi" className="h-auto w-24 sm:w-28" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-7">
              {[{ to: '/', label: 'HOME' }].map(({ to, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-200 relative pb-0.5 ${isActive ? 'text-[#4F200D]' : 'text-[rgba(42,21,6,0.55)] hover:text-[#2A1506]'}`}>
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && <span className="absolute -bottom-px left-0 w-full h-px bg-[#4F200D] rounded-full" />}
                    </>
                  )}
                </NavLink>
              ))}
              <Dropdown label="WOMEN" dropRef={womenRef} isOpen={showWomenDropdown} onToggle={() => { setShowWomenDropdown(v => !v); setShowMenDropdown(false); }} items={CATEGORIES[0].subs} header="Women's Collection" />
              <Dropdown label="MEN" dropRef={menRef} isOpen={showMenDropdown} onToggle={() => { setShowMenDropdown(v => !v); setShowWomenDropdown(false); }} items={CATEGORIES[1].subs} header="Men's Collection" />
              {[{ to: '/about', label: 'ABOUT' }, { to: '/customize', label: 'CUSTOMIZE' }, { to: '/contact', label: 'CONTACT' }].map(({ to, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-200 relative pb-0.5 ${isActive ? 'text-[#4F200D]' : 'text-[rgba(42,21,6,0.55)] hover:text-[#2A1506]'}`}>
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && <span className="absolute -bottom-px left-0 w-full h-px bg-[#4F200D] rounded-full" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-0.5">
              <button onClick={() => { setShowSearch(true); navigate('/shop/collection'); }}
                className="p-2.5 rounded-full transition-all hover:bg-[rgba(79,32,13,0.07)]"
                style={{ color: 'rgba(42,21,6,0.6)' }} aria-label="Search">
                <Search size={18} />
              </button>

              {/* Profile */}
              <div ref={profileRef} className="relative hidden lg:block">
                <button onClick={() => token ? setShowProfileDropdown(v => !v) : navigate('/login')}
                  className="p-2.5 rounded-full transition-all hover:bg-[rgba(79,32,13,0.07)]"
                  style={{ color: 'rgba(42,21,6,0.6)' }} aria-label="Account">
                  <User size={18} />
                </button>
                {token && showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-52 z-10">
                    <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden" style={{ borderColor: 'rgba(79,32,13,0.08)' }}>
                      <div className="px-4 py-2.5 border-b" style={{ background: C.bg, borderColor: 'rgba(79,32,13,0.08)' }}>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.gold }}>My Account</p>
                      </div>
                      <div className="py-1.5">
                        <NavLink to={`/profile/${userId}`} onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-[#FBF7F3] transition-colors" style={{ color: 'rgba(42,21,6,0.7)' }}>
                          <User size={14} /> My Profile
                        </NavLink>
                        <NavLink to="/orders" onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-[#FBF7F3] transition-colors" style={{ color: 'rgba(42,21,6,0.7)' }}>
                          <ShoppingBag size={14} /> My Orders
                        </NavLink>
                        <button onClick={() => { setShowProfileDropdown(false); setShowLogoutModal(true); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left hover:bg-red-50 hover:text-red-600 transition-colors" style={{ color: 'rgba(42,21,6,0.7)' }}>
                          <LogOut size={14} /> Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/wishlist" className="relative p-2.5 rounded-full transition-all hover:bg-[rgba(79,32,13,0.07)]" style={{ color: 'rgba(42,21,6,0.6)' }} aria-label="Wishlist">
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[15px] h-[15px] flex items-center justify-center text-white rounded-full text-[9px] font-bold" style={{ background: C.primary }}>
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative p-2.5 rounded-full transition-all hover:bg-[rgba(79,32,13,0.07)]" style={{ color: 'rgba(42,21,6,0.6)' }} aria-label="Cart">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[15px] h-[15px] flex items-center justify-center text-white rounded-full text-[9px] font-bold" style={{ background: C.primary }}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setMenuVisible(true)} className="lg:hidden p-2.5 rounded-full transition-all hover:bg-[rgba(79,32,13,0.07)] ml-0.5" style={{ color: 'rgba(42,21,6,0.6)' }} aria-label="Open menu">
                <div className="flex flex-col gap-[5px]">
                  <span className="w-5 h-[1.5px] bg-current rounded-full" />
                  <span className="w-5 h-[1.5px] bg-current rounded-full" />
                  <span className="w-3.5 h-[1.5px] bg-current rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar */}
      <div ref={menuRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl overflow-y-auto transition-transform duration-400 ease-in-out z-50 ${menuVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="sticky top-0 z-10 px-5 py-4 border-b flex items-center justify-between" style={{ background: C.bg, borderColor: 'rgba(79,32,13,0.1)' }}>
          <div>
            <p className="font-bold text-lg leading-none" style={{ fontFamily: "'Cormorant Garamond',serif", color: C.primary }}>Aarovi</p>
            <p className="text-[9px] uppercase tracking-[0.25em] mt-0.5" style={{ color: C.gold }}>Ethnic Wear</p>
          </div>
          <button onClick={() => setMenuVisible(false)} className="p-2 rounded-full hover:bg-white/60 transition-colors" aria-label="Close menu">
            <X size={18} style={{ color: C.text }} />
          </button>
        </div>

        <div className="p-4 space-y-1">
          <NavLink to="/" onClick={() => setMenuVisible(false)}
            className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${isActive ? 'text-white' : 'hover:bg-[#FBF7F3]'}`}
            style={({ isActive }) => ({ background: isActive ? C.primary : 'transparent', color: isActive ? 'white' : C.text })}>
            Home
          </NavLink>

          <div className="pt-2 pb-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] px-4 mb-2" style={{ color: C.gold }}>Collections</p>
            {CATEGORIES.map(cat => (
              <div key={cat.id}>
                <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all hover:bg-[#FBF7F3]"
                  onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)} style={{ color: C.text }}>
                  <span>{cat.name}</span>
                  <ChevronDown size={13} className={`transition-transform duration-200 ${expandedCategory === cat.id ? 'rotate-180' : ''}`} style={{ color: C.gold }} />
                </button>
                {expandedCategory === cat.id && (
                  <div className="ml-4 mb-1 space-y-0.5">
                    {cat.subs.map(sub => (
                      <NavLink key={sub.path} to={sub.path} onClick={() => handleCat(sub.name)}
                        className={({ isActive }) => `block px-4 py-2.5 rounded-lg text-xs border-l-2 transition-all font-medium ${isActive ? 'bg-[#FBF7F3] border-[#4F200D]' : 'text-[rgba(42,21,6,0.65)] border-transparent hover:bg-[#FBF7F3] hover:border-[rgba(79,32,13,0.3)]'}`}
                        style={({ isActive }) => ({ color: isActive ? C.primary : undefined })}>
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t pt-2 space-y-1" style={{ borderColor: 'rgba(79,32,13,0.08)' }}>
            {['about', 'customize', 'contact'].map(p => (
              <NavLink key={p} to={`/${p}`} onClick={() => setMenuVisible(false)}
                className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-medium capitalize tracking-wide transition-all ${isActive ? 'text-white' : 'hover:bg-[#FBF7F3]'}`}
                style={({ isActive }) => ({ background: isActive ? C.primary : 'transparent', color: isActive ? 'white' : C.text })}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </NavLink>
            ))}
          </div>

          <div className="border-t pt-3" style={{ borderColor: 'rgba(79,32,13,0.08)' }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] px-4 mb-2" style={{ color: C.gold }}>Account</p>
            {token ? (
              <>
                <NavLink to={`/profile/${userId}`} onClick={() => setMenuVisible(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-[#FBF7F3] transition-all" style={{ color: 'rgba(42,21,6,0.7)' }}>
                  <User size={14} /> My Profile
                </NavLink>
                <NavLink to="/orders" onClick={() => setMenuVisible(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-[#FBF7F3] transition-all" style={{ color: 'rgba(42,21,6,0.7)' }}>
                  <ShoppingBag size={14} /> My Orders
                </NavLink>
                <button onClick={() => { setMenuVisible(false); setShowLogoutModal(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left hover:bg-red-50 hover:text-red-500 transition-all" style={{ color: 'rgba(42,21,6,0.7)' }}>
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={() => setMenuVisible(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-[#FBF7F3] transition-all" style={{ color: 'rgba(42,21,6,0.7)' }}>
                <User size={14} /> Sign in / Register
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
