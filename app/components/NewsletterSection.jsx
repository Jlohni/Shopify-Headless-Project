import React, { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!agreed) {
      setErrorMsg('Please agree to receive emails from SOLESELECT.');
      return;
    }

    setErrorMsg('');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 4000);
  };

  return (
    <section className="bg-ink text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Headline */}
        <div className="lg:col-span-6 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.1]">
            GOOD SHOES.<br />
            <span className="font-editorial font-normal lowercase italic text-white/90 block">
              BETTER PLACES.
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md font-normal leading-relaxed pt-1">
            Stories, style tips and early access to new arrivals.<br />Straight to your inbox.
          </p>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase block">
            JOIN THE MOVEMENT
          </span>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/20 focus:border-white rounded-none px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-colors pr-12"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 text-white hover:text-coral transition-colors"
                aria-label="Submit Newsletter"
              >
                <span className="text-lg font-bold">→</span>
              </button>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-coral focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span>I agree to receive emails from SOLESELECT.</span>
            </label>

            {errorMsg && (
              <div className="text-xs font-bold text-coral">{errorMsg}</div>
            )}

            {submitted && (
              <div className="text-xs font-bold text-emerald-400">
                ✓ Welcome to the movement! Check your inbox soon.
              </div>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}
