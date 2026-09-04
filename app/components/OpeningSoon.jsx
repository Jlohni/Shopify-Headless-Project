import React, { useState, useEffect } from 'react';

const TARGET_LAUNCH_DATE = new Date('2026-10-02T00:00:00+05:30').getTime();

function calculateTimeLeft(target) {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isComplete: false,
  };
}

export function OpeningSoon({ onLaunch }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(TARGET_LAUNCH_DATE));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(TARGET_LAUNCH_DATE);
      setTimeLeft(remaining);
      if (remaining.isComplete && onLaunch) {
        onLaunch();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [onLaunch]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden py-12 px-4 selection:bg-rose-500">
      <div className="max-w-4xl mx-auto w-full text-center my-auto space-y-8">
        <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs uppercase tracking-widest animate-pulse">
          ✨ Official Store Launch Notice
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          We Are <span className="text-amber-400">Opening Soon!</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-lg max-w-xl mx-auto">
          NineCart is preparing to launch with thousands of daily essentials at flat value wholesale rates.
        </p>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
          <div className="bg-slate-900 border-2 border-amber-400/40 rounded-2xl p-4 sm:p-5 text-center">
            <div className="text-3xl sm:text-5xl font-black text-white">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase mt-1">Days</div>
          </div>
          <div className="bg-slate-900 border-2 border-amber-400/40 rounded-2xl p-4 sm:p-5 text-center">
            <div className="text-3xl sm:text-5xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase mt-1">Hours</div>
          </div>
          <div className="bg-slate-900 border-2 border-amber-400/40 rounded-2xl p-4 sm:p-5 text-center">
            <div className="text-3xl sm:text-5xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase mt-1">Minutes</div>
          </div>
          <div className="bg-slate-900 border-2 border-rose-500/40 rounded-2xl p-4 sm:p-5 text-center">
            <div className="text-3xl sm:text-5xl font-black text-rose-400 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-[10px] sm:text-xs font-bold text-rose-300 uppercase mt-1">Seconds</div>
          </div>
        </div>

        {/* Location Box */}
        <div className="max-w-xl mx-auto bg-slate-900/90 border border-amber-400/30 rounded-2xl p-5 text-left space-y-3">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">🗓️ Grand Opening: 2 Oct 2026</div>
          <div className="text-sm font-semibold text-white">
            📍 Shop Location: <span className="text-amber-200">Ninecart, Maldhan Chour No. 4, Main Road (Near LIC Office)</span>
          </div>
          <div className="text-xs text-slate-400">Maldhan Chour, Ramnagar, Nainital - 244715</div>
        </div>
      </div>
    </div>
  );
}
export default OpeningSoon;
