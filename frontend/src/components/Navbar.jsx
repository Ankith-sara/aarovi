import React, { useState, useEffect, useContext, useRef } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ChevronDown, X, Search, User, LogOut, ShoppingBag, Heart, AlertCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

// ── Logout confirmation modal ──────────────────────────────────────────────
const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
          <AlertCircle size={20} className="text-red-500" />
        </div>
        <div>
          <h3 className="font-semibold text-text text-base">Sign out?</h3>
          <p className="text-text/50 text-xs mt-0.5">You'll need to sign in again to access your account.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-text/70 hover:border-gray-300 hover:text-text transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all shadow-md"
        >
          Sign out
        </button>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { setShowSearch, getWishlistCount, getCartCount, navigate, token, setToken, setCartItems, setSelectedSubCategory } = useContext(ShopContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showWomenDropdown, setShowWomenDropdown] = useState(false);
  const [showMenDropdown, setShowMenDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userId, setUserId] = useState('');

  const location = useLocation();
  const menuRef = useRef(null);
  const womenDropdownRef = useRef(null);
  const menDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Decode token safely outside render
  useEffect(() => {
    if (!token) { setUserId(''); return; }
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id || '');
    } catch {
      setUserId('');
    }
  }, [token]);

  // Close all dropdowns on route change
  useEffect(() => {
    setShowWomenDropdown(false);
    setShowMenDropdown(false);
    setShowProfileDropdown(false);
    setMenuVisible(false);
  }, [location.pathname]);

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setCartItems({});
    setShowLogoutModal(false);
    navigate('/login');
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuVisible(false);
      if (womenDropdownRef.current && !womenDropdownRef.current.contains(e.target)) setShowWomenDropdown(false);
      if (menDropdownRef.current && !menDropdownRef.current.contains(e.target)) setShowMenDropdown(false);
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) setShowProfileDropdown(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuVisible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuVisible]);

  const handleCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setShowWomenDropdown(false);
    setShowMenDropdown(false);
    setMenuVisible(false);
  };

  const categories = [
    {
      name: 'Women', id: 'women',
      subcategories: [
        { name: 'Kurtis', path: '/shop/Kurtis' },
        { name: 'Kurti Sets', path: '/shop/Kurti-Sets' },
        { name: 'Anarkalis', path: '/shop/Anarkalis' },
        { name: 'Lehengas', path: '/shop/Lehangas' },
        { name: 'Sheraras', path: '/shop/Sheraras' },
      ]
    },
    {
      name: 'Men', id: 'men',
      subcategories: [
        { name: 'Kurtas', path: '/shop/Kurtas' },
      ]
    }
  ];

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium tracking-wide transition-colors duration-200 ${isActive ? 'text-secondary' : 'text-text/65 hover:text-text'}`;

  const ActiveUnderline = ({ isActive }) =>
    isActive ? <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary rounded-full" /> : null;

  const DropdownMenu = ({ label, dropdownRef, isOpen, onToggle, items, header }) => (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-200 text-text/65 hover:text-text"
      >
        {label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`absolute top-full left-0 mt-2 w-52 transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'}`}>
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-2.5 bg-background/40 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-text/50 uppercase tracking-widest">{header}</p>
          </div>
          <div className="py-1.5">
            {items.map(sub => (
              <NavLink
                key={sub.path}
                to={sub.path}
                onClick={() => handleCategoryClick(sub.name)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm transition-colors duration-150 ${isActive ? 'bg-background/60 text-secondary font-medium' : 'text-text/70 hover:bg-background/30 hover:text-text'}`
                }
              >
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
      {/* Mobile backdrop — z-index BELOW the sidebar (z-50) but above page (z-40) */}
      <div
        className={`fixed inset-0 bg-text/55 backdrop-blur-sm transition-all duration-400 z-40 lg:hidden ${menuVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuVisible(false)}
        aria-hidden="true"
      />

      {showLogoutModal && <LogoutModal onConfirm={logout} onCancel={() => setShowLogoutModal(false)} />}

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${isScrolled ? 'border-gray-200 shadow-sm' : 'border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src={assets.logo} alt="Aarovi" className="h-auto w-28" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-7">
              <NavLink to="/" className={navLinkClass}>
                {({ isActive }) => (<>HOME<ActiveUnderline isActive={isActive} /></>)}
              </NavLink>

              <DropdownMenu
                label="WOMEN"
                dropdownRef={womenDropdownRef}
                isOpen={showWomenDropdown}
                onToggle={() => { setShowWomenDropdown(v => !v); setShowMenDropdown(false); }}
                items={categories[0].subcategories}
                header="Women's Collection"
              />

              <DropdownMenu
                label="MEN"
                dropdownRef={menDropdownRef}
                isOpen={showMenDropdown}
                onToggle={() => { setShowMenDropdown(v => !v); setShowWomenDropdown(false); }}
                items={categories[1].subcategories}
                header="Men's Collection"
              />

              <NavLink to="/about" className={navLinkClass}>
                {({ isActive }) => (<>ABOUT<ActiveUnderline isActive={isActive} /></>)}
              </NavLink>

              <NavLink to="/customize" className={navLinkClass}>
                {({ isActive }) => (<>CUSTOMIZE<ActiveUnderline isActive={isActive} /></>)}
              </NavLink>

              <NavLink to="/contact" className={navLinkClass}>
                {({ isActive }) => (<>CONTACT<ActiveUnderline isActive={isActive} /></>)}
              </NavLink>
            </div>

            {/* Action icons */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <button
                onClick={() => { setShowSearch(true); navigate('/shop/collection'); }}
                className="p-2.5 rounded-full text-text/60 hover:text-text hover:bg-background/50 transition-all"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Profile (desktop) */}
              <div ref={profileDropdownRef} className="relative hidden lg:block">
                <button
                  onClick={() => token ? setShowProfileDropdown(v => !v) : navigate('/login')}
                  className="p-2.5 rounded-full text-text/60 hover:text-text hover:bg-background/50 transition-all"
                  aria-label="Account"
                >
                  <User size={18} />
                </button>
                {token && showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-52 z-10">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                      <div className="px-4 py-2.5 bg-background/40 border-b border-gray-100">
                        <p className="text-[10px] font-semibold text-text/50 uppercase tracking-widest">My Account</p>
                      </div>
                      <div className="py-1.5">
                        <NavLink to={`/profile/${userId}`} onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text/70 hover:bg-background/30 hover:text-text transition-colors">
                          <User size={15} /> My Profile
                        </NavLink>
                        <NavLink to="/orders" onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text/70 hover:bg-background/30 hover:text-text transition-colors">
                          <ShoppingBag size={15} /> My Orders
                        </NavLink>
                        <button
                          onClick={() => { setShowProfileDropdown(false); setShowLogoutModal(true); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-text/70 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut size={15} /> Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2.5 rounded-full text-text/60 hover:text-text hover:bg-background/50 transition-all" aria-label="Wishlist">
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center bg-secondary text-white rounded-full text-[9px] font-bold leading-none px-0.5">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2.5 rounded-full text-text/60 hover:text-text hover:bg-background/50 transition-all" aria-label="Cart">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center bg-secondary text-white rounded-full text-[9px] font-bold leading-none px-0.5">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setMenuVisible(true)}
                className="lg:hidden p-2.5 rounded-full text-text/60 hover:text-text hover:bg-background/50 transition-all ml-0.5"
                aria-label="Open menu"
              >
                <div className="flex flex-col gap-[5px]">
                  <span className="w-5 h-[1.5px] bg-current rounded-full transition-all" />
                  <span className="w-5 h-[1.5px] bg-current rounded-full transition-all" />
                  <span className="w-3.5 h-[1.5px] bg-current rounded-full transition-all" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile sidebar ── */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl overflow-y-auto transition-transform duration-400 ease-in-out z-50 ${menuVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Sidebar header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="font-serif font-bold text-text text-lg leading-none">Aarovi</p>
            <p className="text-[10px] text-text/50 tracking-widest uppercase mt-0.5">Ethnic Wear</p>
          </div>
          <button onClick={() => setMenuVisible(false)} className="p-2 rounded-full hover:bg-white/60 transition-colors" aria-label="Close menu">
            <X size={20} className="text-text" />
          </button>
        </div>

        <div className="p-5 space-y-1">
          <NavLink to="/" onClick={() => setMenuVisible(false)}
            className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${isActive ? 'bg-secondary text-white' : 'text-text hover:bg-background/60'}`}>
            Home
          </NavLink>

          <div className="pt-2 pb-1">
            <p className="text-[10px] font-semibold text-text/40 uppercase tracking-widest px-4 mb-2">Collections</p>
            {categories.map(cat => (
              <div key={cat.id}>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text hover:bg-background/60 rounded-xl transition-all"
                  onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                >
                  <span>{cat.name}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 text-text/50 ${expandedCategory === cat.id ? 'rotate-180' : ''}`} />
                </button>
                {expandedCategory === cat.id && (
                  <div className="ml-4 mb-1 space-y-0.5">
                    {cat.subcategories.map(sub => (
                      <NavLink key={sub.path} to={sub.path} onClick={() => handleCategoryClick(sub.name)}
                        className={({ isActive }) =>
                          `block px-4 py-2.5 rounded-lg text-sm border-l-2 transition-all ${isActive ? 'bg-background/80 text-secondary border-secondary font-medium' : 'text-text/65 hover:bg-background/40 border-transparent hover:border-gray-300'}`
                        }>
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-2 space-y-1">
            {['about', 'customize', 'contact'].map(page => (
              <NavLink key={page} to={`/${page}`} onClick={() => setMenuVisible(false)}
                className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-medium capitalize tracking-wide transition-all ${isActive ? 'bg-secondary text-white' : 'text-text hover:bg-background/60'}`}>
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </NavLink>
            ))}
          </div>

          {/* Account section */}
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[10px] font-semibold text-text/40 uppercase tracking-widest px-4 mb-2">Account</p>
            {token ? (
              <>
                <NavLink to={`/profile/${userId}`} onClick={() => setMenuVisible(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text/70 hover:bg-background/60 hover:text-text transition-all">
                  <User size={15} /> My Profile
                </NavLink>
                <NavLink to="/orders" onClick={() => setMenuVisible(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text/70 hover:bg-background/60 hover:text-text transition-all">
                  <ShoppingBag size={15} /> My Orders
                </NavLink>
                <button
                  onClick={() => { setMenuVisible(false); setShowLogoutModal(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left text-text/70 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={() => setMenuVisible(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text/70 hover:bg-background/60 hover:text-text transition-all">
                <User size={15} /> Sign in / Register
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
