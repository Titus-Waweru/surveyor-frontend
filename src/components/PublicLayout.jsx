import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

export default function PublicLayout({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => setIsNavOpen(false);

  // Check if current page is auth-related (no nav needed)
  const isAuthPage = ['/login', '/signup', '/verify-otp', '/forgot-password', '/reset-password'].includes(location.pathname);

  if (isAuthPage) {
    return children;
  }

  return (
    <div className="bg-[#fff6e5] min-h-screen font-poppins">
      {/* Global Navigation Header - Fixed Position */}
      <header className="fixed top-0 left-0 right-0 px-4 sm:px-8 md:px-20 py-2 sm:py-3 bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-100 z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img
              src="/assets/logo.png"
              alt="LandLink Logo"
              className="h-[70px] md:h-[100px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link
              to="/home"
              className={`font-semibold transition-all duration-300 hover:scale-105 ${
                location.pathname === '/home' 
                  ? 'text-[#1a5632] border-b-2 border-[#1a5632]' 
                  : 'text-gray-700 hover:text-[#1a5632]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`font-semibold transition-all duration-300 hover:scale-105 ${
                location.pathname === '/about' 
                  ? 'text-[#1a5632] border-b-2 border-[#1a5632]' 
                  : 'text-gray-700 hover:text-[#1a5632]'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/news"
              className={`font-semibold transition-all duration-300 hover:scale-105 ${
                location.pathname === '/news' 
                  ? 'text-[#1a5632] border-b-2 border-[#1a5632]' 
                  : 'text-gray-700 hover:text-[#1a5632]'
              }`}
            >
              News
            </Link>
            <Link
              to="/contact"
              className={`font-semibold transition-all duration-300 hover:scale-105 ${
                location.pathname === '/contact' 
                  ? 'text-[#1a5632] border-b-2 border-[#1a5632]' 
                  : 'text-gray-700 hover:text-[#1a5632]'
              }`}
            >
              Contact Us
            </Link>
            
            {/* Auth Buttons */}
            <div className="flex gap-3 ml-6">
              <Link to="/login">
                <button className="border border-[#1a5632] text-[#1a5632] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a5632] hover:text-white transition-all duration-300 shadow-sm">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-[#e9b949] hover:bg-[#d4a73f] text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                  Sign Up
                </button>
              </Link>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg hover:bg-[#1a5632]/10 transition-colors"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <Menu size={28} className="text-[#1a5632]" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isNavOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-sm shadow-xl rounded-xl p-6 border border-gray-200">
            <Link
              to="/home"
              onClick={handleLinkClick}
              className={`block py-3 font-semibold border-l-4 pl-4 ${
                location.pathname === '/home' 
                  ? 'text-[#1a5632] border-[#1a5632] bg-[#1a5632]/5' 
                  : 'text-gray-700 hover:text-[#1a5632] border-transparent hover:border-[#1a5632]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={handleLinkClick}
              className={`block py-3 font-semibold border-l-4 pl-4 ${
                location.pathname === '/about' 
                  ? 'text-[#1a5632] border-[#1a5632] bg-[#1a5632]/5' 
                  : 'text-gray-700 hover:text-[#1a5632] border-transparent hover:border-[#1a5632]'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/news"
              onClick={handleLinkClick}
              className={`block py-3 font-semibold border-l-4 pl-4 ${
                location.pathname === '/news' 
                  ? 'text-[#1a5632] border-[#1a5632] bg-[#1a5632]/5' 
                  : 'text-gray-700 hover:text-[#1a5632] border-transparent hover:border-[#1a5632]'
              }`}
            >
              News
            </Link>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className={`block py-3 font-semibold border-l-4 pl-4 ${
                location.pathname === '/contact' 
                  ? 'text-[#1a5632] border-[#1a5632] bg-[#1a5632]/5' 
                  : 'text-gray-700 hover:text-[#1a5632] border-transparent hover:border-[#1a5632]'
              }`}
            >
              Contact Us
            </Link>
            
            {/* Mobile Auth Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <Link to="/login" onClick={handleLinkClick} className="flex-1">
                <button className="w-full border border-[#1a5632] text-[#1a5632] font-semibold px-4 py-3 rounded-xl hover:bg-[#1a5632] hover:text-white transition-all duration-300">
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={handleLinkClick} className="flex-1">
                <button className="w-full bg-[#e9b949] hover:bg-[#d4a73f] text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 shadow-md">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page Content - Added padding-top to account for fixed header */}
      <main className="pt-32 md:pt-36">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="bg-white py-8 px-4 sm:px-8 md:px-20 text-center text-sm text-gray-600 border-t border-gray-100">
        <p>
          © {new Date().getFullYear()} LandLink. All rights reserved.{" "}
          <Link to="/terms" className="text-[#1a5632] hover:underline font-medium ml-1">
            Terms &amp; Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}