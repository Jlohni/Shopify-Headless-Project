import React from 'react';

export function ServiceBenefits() {
  const benefits = [
    {
      title: 'EXPRESS DELIVERY',
      desc: 'Fast, reliable shipping across India.',
      icon: (
        <svg className="w-8 h-8 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h2.25c.621 0 1.129.504 1.09 1.124" />
        </svg>
      ),
    },
    {
      title: 'EASY RETURNS',
      desc: 'Hassle-free 30-day returns.',
      icon: (
        <svg className="w-8 h-8 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
    },
    {
      title: 'AUTHENTICITY FIRST',
      desc: '100% authentic products. Always.',
      icon: (
        <svg className="w-8 h-8 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-ivory border-y border-borderColor py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {benefits.map((item, idx) => (
          <div key={idx} className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="p-3 rounded-2xl bg-white border border-borderColor/80 shadow-sm shrink-0">
              {item.icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-ink tracking-wider uppercase">
                {item.title}
              </h3>
              <p className="text-xs text-mutedText leading-relaxed">
                {item.description || item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
