import React from 'react';

export function BrandStrip() {
  const brands = [
    { name: 'NIKE', font: 'font-black' },
    { name: 'ADIDAS', font: 'font-bold' },
    { name: 'PUMA', font: 'font-black tracking-widest' },
    { name: 'REEBOK', font: 'font-extrabold' },
    { name: 'NEW BALANCE', font: 'font-bold tracking-tight' },
  ];

  return (
    <section className="bg-ivory border-y border-borderColor py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        {brands.map((brand, idx) => (
          <React.Fragment key={brand.name}>
            <div className="flex-1 text-center min-w-[110px]">
              <span className={`text-lg sm:text-xl lg:text-2xl text-ink ${brand.font} opacity-90 hover:opacity-100 transition-opacity cursor-pointer`}>
                {brand.name}
              </span>
            </div>
            {idx < brands.length - 1 && (
              <div className="h-6 w-[1px] bg-borderColor shrink-0"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
