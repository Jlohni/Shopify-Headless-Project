import React, { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';

export function SoleSelectHeader({ cartCount = 0, openCart }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled
        ? 'bg-ivory/95 backdrop-blur-md shadow-md border-b border-borderColor'
        : 'bg-ivory border-b border-borderColor/60'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-sans font-black text-2xl tracking-[0.2em] text-ink uppercase">
            SOLESELECT
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-[0.15em] text-ink uppercase">
          <Link to="/collections/all" className="hover:text-coral transition-colors">NEW IN</Link>
          <Link to="/collections/all" className="hover:text-coral transition-colors">MEN</Link>
          <Link to="/collections/all" className="hover:text-coral transition-colors">WOMEN</Link>
          <Link to="/collections/all" className="hover:text-coral transition-colors">BRANDS</Link>
          <Link to="/journal" className="hover:text-coral transition-colors">JOURNAL</Link>
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-5 text-ink">
          
          {/* Search Trigger */}
          <Link to="/search" className="hover:text-coral transition-colors p-1" aria-label="Search">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* Account Icon */}
          <Link to="/account" className="hidden sm:block hover:text-coral transition-colors p-1" aria-label="Account">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Cart Icon & Drawer Trigger */}
          <button
            onClick={openCart}
            className="relative hover:text-coral transition-colors p-1"
            aria-label="Shopping Cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-coral text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1 hover:text-coral transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-ivory border-t border-borderColor px-6 py-6 space-y-4 animate-fade-in">
          <nav className="flex flex-col gap-4 text-sm font-bold tracking-[0.15em] text-ink uppercase">
            <Link to="/collections/all" onClick={() => setIsMobileMenuOpen(false)}>NEW IN</Link>
            <Link to="/collections/all" onClick={() => setIsMobileMenuOpen(false)}>MEN</Link>
            <Link to="/collections/all" onClick={() => setIsMobileMenuOpen(false)}>WOMEN</Link>
            <Link to="/collections/all" onClick={() => setIsMobileMenuOpen(false)}>BRANDS</Link>
            <Link to="/journal" onClick={() => setIsMobileMenuOpen(false)}>JOURNAL</Link>
            <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>ACCOUNT</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
