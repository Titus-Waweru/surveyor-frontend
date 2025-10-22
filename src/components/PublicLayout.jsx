import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function PublicLayout({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => setIsNavOpen(false);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if current page is auth-related (no nav needed)
  const isAuthPage = ['/login', '/signup', '/verify-otp', '/forgot-password', '/reset-password'].includes(location.pathname);

  if (isAuthPage) {
    return children;
  }

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 font-inter">
      {/* Enhanced Global Navigation Header */}
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg py-2 border-b border-white/20' 
          : 'bg-transparent py-4'
        }
      `}>
        <div className="px-4 sm:px-8 lg:px-16 xl:px-24">
          <div className="flex items-center justify-between">
            {/* Logo with enhanced styling */}
            <Link 
              to="/" 
              className="group relative z-10"
              onClick={handleLinkClick}
            >
              <div className="relative">
                <img
                  src="/assets/logo.png"
                  alt="LandLink - Connecting Surveyors & Clients"
                  className="h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Desktop Navigation - Enhanced */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative px-4 py-2 font-medium transition-all duration-300
                    rounded-xl mx-1
                    ${location.pathname === item.path
                      ? 'text-emerald-800 bg-white/80 shadow-sm'
                      : 'text-slate-700 hover:text-emerald-700 hover:bg-white/50'
                    }
                  `}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  )}
                </Link>
              ))}
              
              {/* Enhanced Auth Buttons */}
              <div className="flex items-center gap-3 ml-6 pl-6 border-l border-slate-200">
                <Link to="/login">
                  <button className="px-6 py-2.5 font-semibold text-emerald-700 border-2 border-emerald-600/20 rounded-xl hover:border-emerald-600/40 hover:bg-emerald-600/5 transition-all duration-300 hover:scale-105 active:scale-95">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-6 py-2.5 font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transform hover:scale-105 active:scale-95 transition-all duration-300">
                    Join Now
                  </button>
                </Link>
              </div>
            </nav>

            {/* Enhanced Mobile Toggle */}
            <button
              aria-label="Toggle navigation menu"
              className="lg:hidden p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 z-50"
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              {isNavOpen ? (
                <X size={24} className="text-slate-700" />
              ) : (
                <Menu size={24} className="text-slate-700" />
              )}
            </button>
          </div>

          {/* Enhanced Mobile Menu */}
          <div className={`
            lg:hidden absolute top-full left-4 right-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20
            transform transition-all duration-500 ease-out overflow-hidden
            ${isNavOpen 
              ? 'translate-y-0 opacity-100 visible' 
              : '-translate-y-4 opacity-0 invisible'
            }
          `}>
            <div className="p-6">
              {/* Mobile Navigation Items */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={`
                      block px-4 py-3 font-medium rounded-xl transition-all duration-300
                      ${location.pathname === item.path
                        ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-600'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Auth Buttons - Enhanced */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                <Link to="/login" onClick={handleLinkClick} className="flex-1">
                  <button className="w-full px-4 py-3 font-semibold text-emerald-700 border-2 border-emerald-600/20 rounded-xl hover:border-emerald-600/40 hover:bg-emerald-600/5 transition-all duration-300">
                    Login
                  </button>
                </Link>
                <Link to="/signup" onClick={handleLinkClick} className="flex-1">
                  <button className="w-full px-4 py-3 font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content Area */}
      <main className="pt-28 lg:pt-32">
        {children}
      </main>

      {/* Enhanced Global Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60">
        <div className="px-4 sm:px-8 lg:px-16 xl:px-24 py-8">
          <div className="text-center">
            <p className="text-slate-600 text-sm font-medium">
              © {new Date().getFullYear()} LandLink. Precision in every connection.{" "}
              <Link 
                to="/terms" 
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-300 ml-1 inline-flex items-center"
              >
                Terms & Privacy Policy
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}