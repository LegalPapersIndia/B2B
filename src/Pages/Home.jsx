// src/pages/Home.jsx
import React from 'react';
import HeroCarousel from '../Component/HeroCarousel';
import Sidebar from '../Component/SideBar';          // rename kar liya SideBar → Sidebar
import ActionSidebar from '../Component/ActionSide';
import PromoCard from '../Component/PromoCard';
import BuyerPromoCard from '../Component/BuyerPromoCard';
import Testimonials from '../Component/Testimonials';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50/60">

      {/* Hero + Sidebars container */}
      <div className="mx-auto max-w-[1400px] xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">

        <div className="relative flex flex-col lg:flex-row gap-0 lg:gap-6 xl:gap-8">

          {/* LEFT SIDEBAR - Categories */}
          <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
            <div 
              className="
                sticky 
                top-28     // ← navbar ke baad start (approx 112px = top-28)
                h-[calc(100vh-7rem)]   // 100vh - navbar height
                overflow-y-auto 
                overscroll-contain     // ← important: parent scroll ko affect nahi karega
                rounded-2xl 
                shadow-2xl 
                bg-white/95 
                backdrop-blur-lg 
                border border-gray-200/60
                scrollbar-hide         // agar plugin hai to, warna neeche CSS
              "
            >
              <Sidebar />
            </div>
          </aside>

          {/* Hero Carousel */}
          <div className="flex-1 min-w-0 lg:mt-10 z-10">
            <HeroCarousel />
          </div>

          {/* RIGHT SIDEBAR - Actions */}
          <aside className="hidden xl:block xl:w-80 shrink-0">
            <div 
              className="
                sticky 
                top-28 
                h-[calc(100vh-7rem)] 
                overflow-y-auto 
                overscroll-contain
                rounded-2xl 
                shadow-2xl 
                bg-white/95 
                backdrop-blur-lg 
                border border-gray-200/60
                scrollbar-hide
              "
            >
              <ActionSidebar />
            </div>
          </aside>

        </div>
      </div>

      {/* Product grid - hero ke neeche normal flow mein */}
<div className="mx-auto max-w-[1400px] xl:max-w-[1520px] px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

        {/* Headline (optional - agar carousel mein already hai to remove kar sakte ho) */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
            Premium Products • Global Suppliers
          </h1>
          <p className="mt-4 text-xl text-gray-700 max-w-4xl mx-auto">
            Verified • Competitive Pricing • Secure Trade
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-gray-200/70 shadow-md hover:shadow-2xl hover:border-emerald-300 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden bg-gray-50">
                <img
                  src={`https://source.unsplash.com/600x400/?product,business&sig=${i}`}
                  alt="product"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-600/90 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow backdrop-blur-sm">
                    Verified Supplier
                  </span>
                </div>

                <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                  MOQ 100 pcs
                </span>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 min-h-[3rem]">
                  Premium {['Basmati Rice', 'Pharma APIs', 'Steel Pipes', 'Organic Cream', 'Spice Mix', 'LED Parts'][i % 6]} {i + 1}
                </h3>

                <p className="text-sm text-gray-600">
                  {['Agro Global', 'MediCorp', 'SteelMaster', 'BeautyPure', 'SpiceKing', 'TechComp'][i % 6]}
                </p>

                <div className="flex items-center gap-2 text-amber-500 text-sm">
                  ★★★★☆ <span className="text-gray-500">(4.{5 + i % 5})</span>
                </div>

                <div className="flex items-end justify-between pt-3">
                  <div>
                    <p className="text-2xl font-bold text-emerald-700">
                      ₹{(1500 + i * 400).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">per unit • ex-works</p>
                  </div>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition hover:scale-105 shadow-sm">
                    Inquiry
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-5 rounded-xl text-lg font-semibold transition hover:scale-105 shadow-lg">
            Load More Products
          </button>
        </div>
      </div>

<PromoCard />
      <BuyerPromoCard />
      <Testimonials />

    </div>
  );
}