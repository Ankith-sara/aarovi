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
      to: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & Analytics'
    },
    {
      to: '/admin/add',
      icon: Plus,
      label: 'Add Product',
      description: 'Create new items'
    },
    {
      to: '/admin/list',
      icon: Package,
      label: 'Products',
      description: 'Manage inventory'
    },
    {
      to: '/admin/orders',
      icon: ShoppingBag,
      label: 'Orders',
      description: 'Track & fulfill'
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
      end
      onClick={() => mobile && setIsMobileMenuOpen(false)}
      className={({ isActive }) => `
        group relative flex items-center gap-3 p-2.5 rounded-full transition-all duration-300
        ${isActive
          ? 'bg-secondary text-primary shadow-sm'
          : 'text-text/70 hover:text-text hover:bg-secondary/5'
        }
        ${mobile ? 'mx-4' : ''}
      `}
    >
      {({ isActive }) => (
        <>
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
            ${isActive ? 'bg-primary/20' : 'group-hover:bg-secondary/10'}
          `}>
            <item.icon
              size={18}
              className={`transition-colors duration-300 ${
                isActive ? 'text-primary' : 'text-text/70 group-hover:text-text'
              }`}
            />
          </div>

          {(!isCollapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm transition-colors duration-300 ${
                isActive ? 'text-primary' : 'text-text group-hover:text-text'
              }`}>
                {item.label}
              </p>
              <p className={`text-xs font-light transition-colors duration-300 ${
                isActive ? 'text-primary/75' : 'text-text/50 group-hover:text-text/60'
              }`}>
                {item.description}
              </p>
            </div>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && !mobile && (
            <div className="absolute left-full ml-3 px-4 py-3 bg-secondary text-primary text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-md">
              <div className="flex flex-col">
                <span className="font-semibold">{item.label}</span>
                <span className="text-xs text-primary/75 font-light">{item.description}</span>
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1.5 w-3 h-3 bg-secondary rotate-45" />
            </div>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-3 bg-primary rounded-lg shadow-sm border border-secondary/15 hover:bg-secondary/5 transition-all duration-300"
        >
          <Menu size={20} className="text-text" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 z-50 h-full w-80 bg-primary shadow-2xl border-r border-secondary/15 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-secondary/15 bg-background/50">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-polysans text-3xl font-bold tracking-tight text-text relative">
                aarovi
                <span className="absolute -bottom-0.5 left-0 w-8 h-[2px] bg-gold rounded-full"></span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-gold mt-1 font-inter">
                Admin
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-secondary/10 rounded-full transition-all duration-300"
          >
            <X size={20} className="text-text/50" />
          </button>
        </div>

        <div className="py-6 space-y-2">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} mobile={true} />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-secondary/15 bg-background/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 text-text/75 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 border border-secondary/15 hover:border-red-200 font-semibold"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      <div className={`
        hidden lg:flex flex-col h-screen bg-primary border-r border-secondary/15 shadow-sm transition-all duration-300 ease-in-out sticky top-0
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Desktop Header */}
        {!isCollapsed && (
          <div className="p-6 border-b border-secondary/15 bg-background/30">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-polysans text-3xl font-bold tracking-tight text-text relative">
                  aarovi
                  <span className="absolute -bottom-0.5 left-0 w-8 h-[2px] bg-gold rounded-full"></span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-gold mt-1 font-inter">
                  Admin
                </span>
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="p-6 border-b border-secondary/15 bg-background/30 flex justify-center">
            <span className="font-polysans text-3xl font-bold tracking-tight text-text relative">
              a
              <span className="absolute bottom-1 -right-1 w-1.5 h-1.5 bg-gold rounded-full"></span>
            </span>
          </div>
        )}

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </div>

        <div className="p-4 border-t border-secondary/15 bg-background/30 space-y-2">
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 p-2.5 text-text/75 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 border border-secondary/20 hover:border-red-200 font-semibold"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              w-full flex items-center justify-center p-2.5 rounded-full transition-all duration-300
              bg-primary hover:bg-secondary/5 text-text/75 hover:text-text 
              border border-secondary/20 hover:border-secondary/35 shadow-sm
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

          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 text-text/70 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300 border border-secondary/20 hover:border-red-200 group"
              title="Logout"
            >
              <LogOut size={18} />
              <div className="absolute left-full ml-3 px-4 py-3 bg-secondary text-primary text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-md font-semibold">
                Logout
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1.5 w-3 h-3 bg-secondary rotate-45" />
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;