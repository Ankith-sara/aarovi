import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Plus, Package,
  ShoppingBag, ChevronLeft, ChevronRight, LogOut, Menu, X, Shield
} from 'lucide-react';

const Sidebar = ({ token, setToken }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      to: '/',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & Analytics'
    },
    {
      to: '/add',
      icon: Plus,
      label: 'Add Product',
      description: 'Create new items'
    },
    {
      to: '/list',
      icon: Package,
      label: 'Products',
      description: 'Manage inventory'
    },
    {
      to: '/orders',
      icon: ShoppingBag,
      label: 'Orders',
      description: 'Track & fulfill'
    },
    {
      to: '/customizations',
      icon: ShoppingBag,
      label: 'Customizations',
      description: 'Customer Requests'
    }
  ];

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.to}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
      className={({ isActive }) => `
        group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300
        ${isActive
          ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
          : 'text-text/70 hover:text-text hover:bg-background/30'
        }
        ${mobile ? 'mx-4' : ''}
      `}
    >
      {({ isActive }) => (
        <>
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
            ${isActive ? 'bg-white/20' : 'group-hover:bg-background/30'}
          `}>
            <item.icon
              size={20}
              className={`transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-text/70 group-hover:text-text'
              }`}
            />
          </div>

          {(!isCollapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-text group-hover:text-text'
              }`}>
                {item.label}
              </p>
              <p className={`text-xs font-light transition-colors duration-300 ${
                isActive ? 'text-white/80' : 'text-text/50 group-hover:text-text/60'
              }`}>
                {item.description}
              </p>
            </div>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && !mobile && (
            <div className="absolute left-full ml-3 px-4 py-3 bg-text text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-2xl">
              <div className="flex flex-col">
                <span className="font-semibold">{item.label}</span>
                <span className="text-xs text-white/70 font-light">{item.description}</span>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1.5 w-3 h-3 bg-text rotate-45" />
            </div>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-3 bg-white rounded-xl shadow-md border border-background/30 hover:bg-background/10 transition-all duration-300"
        >
          <Menu size={20} className="text-text" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-2xl border-r border-background/30 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/30">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-text">Menu</h2>
              <p className="text-xs text-text/50 font-light">Navigation</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-background/30 rounded-xl transition-all duration-300"
          >
            <X size={20} className="text-text/50" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="py-6 space-y-2">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} mobile={true} />
          ))}
        </div>

        {/* Mobile Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-background/30 bg-gradient-to-br from-background/10 to-background/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 text-text/70 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border border-background/30 hover:border-red-200 font-semibold"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:flex flex-col h-screen bg-white border-r border-background/30 shadow-sm transition-all duration-300 ease-in-out sticky top-0
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Desktop Header */}
        {!isCollapsed && (
          <div className="p-6 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/30">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-lg font-serif font-bold text-text">Aharyas Admin</h1>
                <p className="text-xs text-text/50 font-light">Management Panel</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed Header */}
        {isCollapsed && (
          <div className="p-4 border-b border-background/30 bg-gradient-to-br from-secondary/5 to-secondary/10 flex justify-center">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/30">
              <Shield className="text-white" size={24} />
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>

        {/* Desktop Footer */}
        <div className="p-4 border-t border-background/30 bg-gradient-to-br from-background/10 to-background/5 space-y-2">
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-3 text-text/70 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border border-background/30 hover:border-red-200 font-semibold"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              w-full flex items-center justify-center p-3 rounded-xl transition-all duration-300
              bg-white hover:bg-background/20 text-text/70 hover:text-text 
              border border-background/30 hover:border-background/50 shadow-sm
              ${isCollapsed ? 'px-3' : 'gap-3'}
            `}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span className="text-sm font-semibold">Collapse</span>
              </>
            )}
          </button>

          {/* Collapsed Logout Button */}
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 text-text/70 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 border border-background/30 hover:border-red-200 group"
              title="Logout"
            >
              <LogOut size={18} />
              <div className="absolute left-full ml-3 px-4 py-3 bg-text text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-2xl font-semibold">
                Logout
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1.5 w-3 h-3 bg-text rotate-45" />
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;