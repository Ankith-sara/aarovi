import React, { useState, useEffect, useContext, useRef } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ChevronDown, X, Search, User, LogOut, ShoppingBag, Heart } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { setShowSearch, getWishlistCount, getCartCount, navigate, token, setToken, setCartItems, setSelectedSubCategory } = useContext(ShopContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showWomenDropdown, setShowWomenDropdown] = useState(false);
  const [showMenDropdown, setShowMenDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const womenDropdownRef = useRef(null);
  const menDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  let userId = "";

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
      if (womenDropdownRef.current && !womenDropdownRef.current.contains(event.target)) {
        setShowWomenDropdown(false);
      }
      if (menDropdownRef.current && !menDropdownRef.current.contains(event.target)) {
        setShowMenDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (menuVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuVisible]);

  const handleCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setShowWomenDropdown(false);
    setShowMenDropdown(false);
    setMenuVisible(false);
  };

  const categories = [
    {
      name: 'Women',
      id: 'women',
      subcategories: [
        { name: 'Kurtis', path: '/shop/Kurtis' },
        { name: 'Kurti Sets', path: '/shop/Kurti-Sets' },
        { name: 'Anarkalis', path: '/shop/Anarkalis' },
        { name: 'Lehengas', path: '/shop/Lehengas' },
        { name: 'Sheraras', path: '/shop/Sheraras' },
      ]
    },
    {
      name: 'Men',
      id: 'men',
      subcategories: [
        { name: 'Kurtas', path: '/shop/Kurtas' },
      ]
    }
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-text/60 backdrop-blur-sm transition-all duration-500 z-40 ${menuVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuVisible(false)}
      />

      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-300 ${isScrolled ? 'border-background/50 shadow-md' : 'border-background/30'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              to='/'
              onClick={() => window.location.href = '/'}
              className="flex items-center group"
            >
              <img src={assets.logo} alt="Aarovi Logo" className="h-auto w-32" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <NavLink
                to="/"
                className={({ isActive }) => `
                  text-sm font-medium tracking-wide transition-all duration-300 relative
                  ${isActive ? 'text-secondary' : 'text-text/70 hover:text-text'}
                `}
              >
                {({ isActive }) => (
                  <>
                    HOME
                    {isActive && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary"></span>}
                  </>
                )}
              </NavLink>

              <div ref={womenDropdownRef} className="relative">
                <button
                  onClick={() => {
                    setShowWomenDropdown(prev => !prev);
                    setShowMenDropdown(false);
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium tracking-wide transition-all duration-300 text-text/70 hover:text-text"
                >
                  WOMEN
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${showWomenDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                <div className={`absolute top-full left-0 mt-3 w-56 transition-all duration-300 transform origin-top ${showWomenDropdown ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}>
                  <div className="bg-white backdrop-blur-xl rounded-lg shadow-xl border border-background/30 overflow-hidden">
                    <div className="bg-gradient-to-r from-background/20 to-primary px-4 py-3 border-b border-background/30">
                      <p className="text-xs font-semibold text-text/60 tracking-widest uppercase">Women's Collection</p>
                    </div>
                    <div className="py-2">
                      {categories[0].subcategories.map((subcategory, index) => (
                        <NavLink
                          key={subcategory.path}
                          to={subcategory.path}
                          onClick={() => handleCategoryClick(subcategory.name)}
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          {({ isActive }) => (
                            <div className={`
                              flex items-center justify-between px-4 py-2.5 transition-all duration-200
                              ${isActive
                                ? 'bg-gradient-to-r from-background to-primary text-secondary font-medium'
                                : 'text-text/70 hover:bg-background/30 hover:text-text'
                              }
                            `}>
                              <span className="text-sm">{subcategory.name}</span>
                            </div>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div ref={menDropdownRef} className="relative">
                <button
                  onClick={() => {
                    setShowMenDropdown(prev => !prev);
                    setShowWomenDropdown(false);
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium tracking-wide transition-all duration-300 text-text/70 hover:text-text"
                >
                  MEN
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${showMenDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                <div className={`absolute top-full left-0 mt-3 w-56 transition-all duration-300 transform origin-top ${showMenDropdown ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}>
                  <div className="bg-white backdrop-blur-xl rounded-lg shadow-xl border border-background/30 overflow-hidden">
                    <div className="bg-gradient-to-r from-background/20 to-primary px-4 py-3 border-b border-background/30">
                      <p className="text-xs font-semibold text-text/60 tracking-widest uppercase">Men's Collection</p>
                    </div>
                    <div className="py-2">
                      {categories[1].subcategories.map((subcategory) => (
                        <NavLink
                          key={subcategory.path}
                          to={subcategory.path}
                          onClick={() => handleCategoryClick(subcategory.name)}
                        >
                          {({ isActive }) => (
                            <div className={`
                              flex items-center justify-between px-4 py-2.5 transition-all duration-200
                              ${isActive
                                ? 'bg-gradient-to-r from-background to-primary text-secondary font-medium'
                                : 'text-text/70 hover:bg-background/30 hover:text-text'
                              }
                            `}>
                              <span className="text-sm">{subcategory.name}</span>
                            </div>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <NavLink
                to="/about"
                className={({ isActive }) => `
                  text-sm font-medium tracking-wide transition-all duration-300 relative
                  ${isActive ? 'text-secondary' : 'text-text/70 hover:text-text'}
                `}
              >
                {({ isActive }) => (
                  <>
                    ABOUT
                    {isActive && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary"></span>}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/customize"
                className={({ isActive }) => `
                  text-sm font-medium tracking-wide transition-all duration-300 relative
                  ${isActive ? 'text-secondary' : 'text-text/70 hover:text-text'}
                `}
              >
                {({ isActive }) => (
                  <>
                    CUSTOMIZE
                    {isActive && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary"></span>}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) => `
                  text-sm font-medium tracking-wide transition-all duration-300 relative
                  ${isActive ? 'text-secondary' : 'text-text/70 hover:text-text'}
                `}
              >
                {({ isActive }) => (
                  <>
                    CONTACT
                    {isActive && <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-secondary"></span>}
                  </>
                )}
              </NavLink>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowSearch(true); navigate('/shop/collection') }}
                className="p-2.5 transition-all duration-300 rounded-full hover:bg-background/30 text-text/70 hover:text-text"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              <div ref={profileDropdownRef} className="relative hidden lg:block">
                <button
                  onClick={() => token ? setShowProfileDropdown(!showProfileDropdown) : navigate('/login')}
                  className="p-2.5 transition-all duration-300 rounded-full hover:bg-background/30 text-text/70 hover:text-text"
                  aria-label="Profile"
                >
                  <User size={19} />
                </button>

                {token && showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-56 transition-all duration-300 animate-slideDown">
                    <div className="bg-white backdrop-blur-xl rounded-lg shadow-xl border border-background/30 overflow-hidden">
                      <div className="bg-gradient-to-r from-background/20 to-primary px-4 py-3 border-b border-background/30">
                        <p className="text-xs font-semibold text-text/60 tracking-widest uppercase">My Account</p>
                      </div>
                      <div className="py-2">
                        <NavLink
                          to={`/profile/${userId}`}
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-text/70 hover:bg-background/30 hover:text-text transition-all duration-200"
                        >
                          <User size={16} />
                          <span className="text-sm">My Profile</span>
                        </NavLink>
                        <NavLink
                          to="/orders"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-text/70 hover:bg-background/30 hover:text-text transition-all duration-200"
                        >
                          <ShoppingBag size={16} />
                          <span className="text-sm">My Orders</span>
                        </NavLink>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to log out?")) {
                              logout();
                              setShowProfileDropdown(false);
                            }
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-text/70 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                          <LogOut size={16} />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to='/wishlist' className='relative'>
                <button
                  className="p-2.5 transition-all duration-300 rounded-full hover:bg-background/30 text-text/70 hover:text-text"
                  aria-label="Wishlist"
                >
                  <Heart size={19} />
                  {getWishlistCount() > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-secondary text-white rounded-full text-[10px] font-bold shadow-md">
                      {getWishlistCount()}
                    </span>
                  )}
                </button>
              </Link>

              <Link to='/cart' className='relative'>
                <button
                  className="p-2.5 transition-all duration-300 rounded-full hover:bg-background/30 text-text/70 hover:text-text"
                  aria-label="Cart"
                >
                  <ShoppingBag size={19} />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-secondary text-white rounded-full text-[10px] font-bold shadow-md">
                      {getCartCount()}
                    </span>
                  )}
                </button>
              </Link>

              <button
                onClick={() => setMenuVisible(true)}
                className="lg:hidden p-2.5 transition-all duration-300 rounded-full hover:bg-background/30 text-text/70 hover:text-text"
                aria-label="Menu"
              >
                <div className="flex flex-col gap-1">
                  <span className="w-5 h-0.5 bg-text transition-all duration-300"></span>
                  <span className="w-5 h-0.5 bg-text transition-all duration-300"></span>
                  <span className="w-4 h-0.5 bg-text transition-all duration-300"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 bottom-0 h-full w-full sm:w-96 bg-white shadow-2xl overflow-y-auto transition-transform duration-500 z-50 ${menuVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="bg-background p-6 sticky top-0 z-10 border-b border-background/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-text">Aarovi</h2>
              <p className="text-xs text-text/60 tracking-widest">ETHNIC WEAR</p>
            </div>
            <button
              onClick={() => setMenuVisible(false)}
              className="p-2.5 hover:bg-white/20 rounded-full transition-all duration-300 text-text"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <NavLink
              to="/"
              onClick={() => setMenuVisible(false)}
              className={({ isActive }) => `
                block px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm tracking-wide
                ${isActive
                  ? 'bg-secondary text-white shadow-md'
                  : 'text-text hover:bg-background/50'
                }
              `}
            >
              HOME
            </NavLink>

            <div className="pt-4">
              <div className="flex items-center gap-2 px-4 py-2 mb-3">
                <div className="h-px flex-1 bg-background"></div>
                <p className="text-xs font-semibold text-text/60 tracking-widest uppercase">Collections</p>
                <div className="h-px flex-1 bg-background"></div>
              </div>

              {categories.map((category) => (
                <div key={category.id} className="mb-2">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-text font-medium text-sm tracking-wide hover:bg-background/30 rounded-lg transition-all duration-300"
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                  >
                    <span>{category.name}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {expandedCategory === category.id && (
                    <div className="mt-1 ml-4 space-y-1 animate-slideDown">
                      {category.subcategories.map((subcategory) => (
                        <NavLink
                          key={subcategory.path}
                          to={subcategory.path}
                          onClick={() => handleCategoryClick(subcategory.name)}
                          className={({ isActive }) => `
                            block px-4 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-2
                            ${isActive ? 'bg-background text-secondary font-medium border-secondary' : 'text-text/70 hover:bg-background/30 border-transparent hover:border-text/30'}
                          `}
                        >
                          {subcategory.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4">
              <div className="h-px bg-background mb-4"></div>
            </div>

            <NavLink
              to="/about"
              onClick={() => setMenuVisible(false)}
              className={({ isActive }) => `
                block px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm tracking-wide
                ${isActive ? 'bg-secondary text-white shadow-md' : 'text-text hover:bg-background/50'}
              `}
            >
              ABOUT
            </NavLink>

            <NavLink
              to="/customize"
              onClick={() => setMenuVisible(false)}
              className={({ isActive }) => `
                block px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm tracking-wide
                ${isActive ? 'bg-secondary text-white shadow-md' : 'text-text hover:bg-background/50'}
              `}
            >
              CUSTOMIZE
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMenuVisible(false)}
              className={({ isActive }) => `
                block px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm tracking-wide
                ${isActive ? 'bg-secondary text-white shadow-md' : 'text-text hover:bg-background/50'}
              `}
            >
              CONTACT
            </NavLink>
          </div>

          <div>
            <div className="flex items-center gap-2 px-4 py-2 mb-3">
              <div className="h-px flex-1 bg-background"></div>
              <p className="text-xs font-semibold text-text/60 tracking-widest uppercase">My Account</p>
              <div className="h-px flex-1 bg-background"></div>
            </div>

            {token ? (
              <div className="space-y-2">
                <NavLink
                  to={`/profile/${userId}`}
                  onClick={() => setMenuVisible(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm
                    ${isActive
                      ? 'bg-background text-text font-medium'
                      : 'text-text/70 hover:bg-background/30'
                    }
                  `}
                >
                  <User size={16} />
                  My Profile
                </NavLink>
                <NavLink
                  to="/orders"
                  onClick={() => setMenuVisible(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm
                    ${isActive
                      ? 'bg-background text-text font-medium'
                      : 'text-text/70 hover:bg-background/30'
                    }
                  `}
                >
                  <ShoppingBag size={16} />
                  My Orders
                </NavLink>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to log out?")) {
                      logout();
                      setMenuVisible(false);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-text/70 hover:bg-red-50 hover:text-red-600 transition-all duration-300 text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMenuVisible(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-text/70 hover:bg-background/30 transition-all duration-300 text-sm"
              >
                <User size={16} />
                Login / Sign Up
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;