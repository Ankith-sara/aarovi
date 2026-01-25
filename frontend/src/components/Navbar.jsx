import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ChevronDown, Search, User, ShoppingCart, Heart, Menu, X, LogOut, ShoppingBag } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { setShowSearch, getWishlistCount, getCartCount, token, setToken, setCartItems, setSelectedSubCategory } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const womenDropdownRef = useRef(null);
  const menDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  let userId = "";
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.id;
  }

  const isHomePage = location.pathname === '/';

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideWomenDropdown = womenDropdownRef.current && !womenDropdownRef.current.contains(event.target);
      const isOutsideMenDropdown = menDropdownRef.current && !menDropdownRef.current.contains(event.target);
      const isOutsideProfileDropdown = profileDropdownRef.current && !profileDropdownRef.current.contains(event.target);

      if (isOutsideWomenDropdown && isOutsideMenDropdown && isOutsideProfileDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleCategoryClick = (subCategory, path) => {
    setSelectedSubCategory(subCategory);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    navigate(path);
  };

  const handleMobileNavClick = (path) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    navigate(path);
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const getNavbarClasses = () => {
    if (isHomePage && !isScrolled) {
      return 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm';
    }
    return 'bg-white shadow-md border-b border-gray-200';
  };

  const getTextColor = () => {
    return 'text-gray-900';
  };

  const getHoverClass = () => {
    return 'hover:text-secondary hover:bg-gray-50';
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 z-40 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarClasses()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to='/' className="flex-shrink-0">
              <span className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight ${getTextColor()} hover:text-secondary transition-colors`}>
                AAROVI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) => `px-5 py-2 text-sm font-semibold tracking-wide rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'text-secondary bg-gray-50'
                    : `${getTextColor()} ${getHoverClass()}`
                }`}
              >
                Home
              </NavLink>
            
              {/* Women Dropdown */}
              <div className="relative" ref={womenDropdownRef}>
                <button
                  onClick={() => toggleDropdown('women')}
                  className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold tracking-wide rounded-lg transition-all duration-300 ${
                    activeDropdown === 'women'
                      ? 'text-secondary bg-gray-50'
                      : `${getTextColor()} ${getHoverClass()}`
                  }`}
                >
                  Women
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${activeDropdown === 'women' ? 'rotate-180' : ''}`}
                  />
                </button>

                {activeDropdown === 'women' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-slideDown">
                    <div className="py-2">
                      {categories[0].subcategories.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <button
                            key={sub.path}
                            onClick={() => handleCategoryClick(sub.name, sub.path)}
                            className={`w-full text-left block px-5 py-3 text-sm font-medium transition-all duration-200 ${
                              isSubActive
                                ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-secondary'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-secondary hover:pl-6'
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Men Dropdown */}
              <div className="relative" ref={menDropdownRef}>
                <button
                  onClick={() => toggleDropdown('men')}
                  className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold tracking-wide rounded-lg transition-all duration-300 ${
                    activeDropdown === 'men'
                      ? 'text-secondary bg-gray-50'
                      : `${getTextColor()} ${getHoverClass()}`
                  }`}
                >
                  Men
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${activeDropdown === 'men' ? 'rotate-180' : ''}`}
                  />
                </button>

                {activeDropdown === 'men' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-slideDown">
                    <div className="py-2">
                      {categories[1].subcategories.map((sub) => {
                        const isSubActive = location.pathname === sub.path;
                        return (
                          <button
                            key={sub.path}
                            onClick={() => handleCategoryClick(sub.name, sub.path)}
                            className={`w-full text-left block px-5 py-3 text-sm font-medium transition-all duration-200 ${
                              isSubActive
                                ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-secondary'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-secondary hover:pl-6'
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <NavLink
                to="/about"
                className={({ isActive }) => `px-5 py-2.5 text-sm font-semibold tracking-wide rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'text-secondary bg-gray-50'
                    : `${getTextColor()} ${getHoverClass()}`
                }`}
              >
                About
              </NavLink>

              <NavLink
                to="/customize"
                className={({ isActive }) => `px-5 py-2.5 text-sm font-semibold tracking-wide rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'text-secondary bg-gray-50'
                    : `${getTextColor()} ${getHoverClass()}`
                }`}
              >
                Customize
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) => `px-5 py-2.5 text-sm font-semibold tracking-wide rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'text-secondary bg-gray-50'
                    : `${getTextColor()} ${getHoverClass()}`
                }`}
              >
                Contact
              </NavLink>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => { setShowSearch(true); navigate('/shop/collection') }}
                className={`p-2.5 rounded-lg transition-all duration-300 ${getTextColor()} ${getHoverClass()}`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Profile Dropdown - Desktop */}
              <div className="relative hidden lg:block" ref={profileDropdownRef}>
                <button
                  onClick={() => token ? toggleDropdown('profile') : navigate('/login')}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${
                    activeDropdown === 'profile'
                      ? 'text-secondary bg-gray-50'
                      : `${getTextColor()} ${getHoverClass()}`
                  }`}
                  aria-label="User Profile"
                >
                  <User size={20} />
                </button>

                {token && activeDropdown === 'profile' && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-slideDown">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate(`/profile/${userId}`);
                          setActiveDropdown(null);
                        }}
                        className="w-full flex items-center px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-secondary transition-all duration-200"
                      >
                        <User size={16} className="mr-3" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate('/orders');
                          setActiveDropdown(null);
                        }}
                        className="w-full flex items-center px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-secondary transition-all duration-200"
                      >
                        <ShoppingBag size={16} className="mr-3" />
                        My Orders
                      </button>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to log out?")) {
                            logout();
                            setActiveDropdown(null);
                          }
                        }}
                        className="w-full flex items-center px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to='/wishlist' className='relative'>
                <button className={`p-2.5 rounded-lg transition-all duration-300 ${getTextColor()} ${getHoverClass()}`}>
                  <Heart size={20} />
                  {getWishlistCount() > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-md">
                      {getWishlistCount()}
                    </span>
                  )}
                </button>
              </Link>

              {/* Cart */}
              <Link to='/cart' className='relative'>
                <button className={`p-2.5 rounded-lg transition-all duration-300 ${getTextColor()} ${getHoverClass()}`}>
                  <ShoppingCart size={20} />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-md">
                      {getCartCount()}
                    </span>
                  )}
                </button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-2.5 rounded-lg transition-all duration-300 ${getTextColor()} ${getHoverClass()}`}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 transition-transform duration-300 overflow-y-auto ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Mobile Menu Header */}
        <div className="bg-gradient-to-br from-secondary to-secondary/80 p-6">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-serif font-bold text-white tracking-tight">AAROVI</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-6">
          <div className="space-y-2">
            {/* Home */}
            <NavLink
              to="/"
              onClick={() => handleMobileNavClick('/')}
              className={({ isActive }) => `w-full text-left block px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-secondary shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-secondary'
              }`}
            >
              Home
            </NavLink>

            {/* Women Mobile Dropdown */}
            <div>
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'women-mobile' ? null : 'women-mobile')}
                className="w-full flex items-center justify-between px-5 py-3.5 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:text-secondary transition-all duration-300"
              >
                <span>Women</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${activeDropdown === 'women-mobile' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeDropdown === 'women-mobile' && (
                <div className="ml-4 mt-2 space-y-1 animate-slideDown">
                  {categories[0].subcategories.map((sub) => {
                    const isSubActive = location.pathname === sub.path;
                    return (
                      <button
                        key={sub.path}
                        onClick={() => handleCategoryClick(sub.name, sub.path)}
                        className={`w-full text-left block px-5 py-2.5 text-sm rounded-xl font-medium transition-all duration-200 ${
                          isSubActive
                            ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-secondary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-secondary hover:pl-6'
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Men Mobile Dropdown */}
            <div>
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'men-mobile' ? null : 'men-mobile')}
                className="w-full flex items-center justify-between px-5 py-3.5 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:text-secondary transition-all duration-300"
              >
                <span>Men</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${activeDropdown === 'men-mobile' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeDropdown === 'men-mobile' && (
                <div className="ml-4 mt-2 space-y-1 animate-slideDown">
                  {categories[1].subcategories.map((sub) => {
                    const isSubActive = location.pathname === sub.path;
                    return (
                      <button
                        key={sub.path}
                        onClick={() => handleCategoryClick(sub.name, sub.path)}
                        className={`w-full text-left block px-5 py-2.5 text-sm rounded-xl font-medium transition-all duration-200 ${
                          isSubActive
                            ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-secondary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-secondary hover:pl-6'
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* About */}
            <NavLink
              to="/about"
              onClick={() => handleMobileNavClick('/about')}
              className={({ isActive }) => `w-full text-left block px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-secondary shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-secondary'
              }`}
            >
              About
            </NavLink>

            {/* Customize */}
            <NavLink
              to="/customize"
              onClick={() => handleMobileNavClick('/customize')}
              className={({ isActive }) => `w-full text-left block px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-secondary shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-secondary'
              }`}
            >
              Customize
            </NavLink>

            {/* Contact */}
            <NavLink
              to="/contact"
              onClick={() => handleMobileNavClick('/contact')}
              className={({ isActive }) => `w-full text-left block px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-gray-100 to-gray-50 text-secondary shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-secondary'
              }`}
            >
              Contact
            </NavLink>

            {/* Account Section */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <p className="px-5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Account
              </p>
              {token ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleMobileNavClick(`/profile/${userId}`)}
                    className="w-full flex items-center px-5 py-3.5 text-gray-700 hover:bg-gray-50 hover:text-secondary rounded-xl transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mr-3">
                      <User size={18} className="text-secondary" />
                    </div>
                    <span className="font-semibold">My Profile</span>
                  </button>
                  <button
                    onClick={() => handleMobileNavClick('/orders')}
                    className="w-full flex items-center px-5 py-3.5 text-gray-700 hover:bg-gray-50 hover:text-secondary rounded-xl transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mr-3">
                      <ShoppingBag size={18} className="text-secondary" />
                    </div>
                    <span className="font-semibold">My Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to log out?")) {
                        logout();
                        setMobileMenuOpen(false);
                      }
                    }}
                    className="w-full flex items-center px-5 py-3.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mr-3">
                      <LogOut size={18} className="text-red-600" />
                    </div>
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleMobileNavClick('/login')}
                  className="w-full flex items-center px-5 py-3.5 text-gray-700 hover:bg-gray-50 hover:text-secondary rounded-xl transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mr-3">
                    <User size={18} className="text-secondary" />
                  </div>
                  <span className="font-semibold">Login / Sign Up</span>
                </button>
              )}
            </div>
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
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;