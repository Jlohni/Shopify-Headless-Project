import React from 'react';
import { Link } from '@remix-run/react';

export function SoleSelectFooter() {
  const columns = {
    SHOP: ['New In', 'Men', 'Women', 'Brands', 'Sale'],
    HELP: ['Track Order', 'Returns', 'Shipping', 'FAQs', 'Size Guide'],
    ABOUT: ['Our Story', 'Journal', 'Careers', 'Contact Us'],
    LEGAL: ['Terms & Conditions', 'Privacy Policy', 'Refund Policy'],
  };

  return (
    <footer className="bg-ink text-white pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-sans font-black text-2xl tracking-[0.2em] text-white uppercase">
                SOLESELECT
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Curated sneakers.<br />Across for culture.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-slate-400 pt-2">
              <a href="#instagram" className="hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#facebook" className="hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.415V8z"/></svg>
              </a>
              <a href="#youtube" className="hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>
              </a>
              <a href="#x" className="hover:text-white transition-colors" aria-label="X">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* 4 Link Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(columns).map(([title, links]) => (
              <div key={title} className="space-y-3">
                <h4 className="font-bold text-xs tracking-[0.15em] uppercase text-white">
                  {title}
                </h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  {links.map((link) => (
                    <li key={link}>
                      <Link to="/collections/all" className="hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© 2026 SOLESELECT. All rights reserved.</div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-slate-300 transition-colors">
            <span>India (INR ₹)</span>
            <span>↓</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
