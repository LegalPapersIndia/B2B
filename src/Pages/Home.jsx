// src/Pages/Home.jsx
import React from 'react';
import Sidebar from '../Component/SideBar';
import ActionSidebar from '../Component/ActionSide';
import HeroCarousel from '../Component/HeroCarousel';
import PromoCard from '../Component/PromoCard';
import BuyerPromoCard from '../Component/BuyerPromoCard';
import Testimonials from '../Component/Testimonials';

const Home = () => {
  return (
    <>
    <div className="flex flex-col bg-gray-50/70">
      {/* Hero - already good, just ensure full bleed */}
      <HeroCarousel />
      

      {/* Main content area */}
      <div className="flex flex-1 min-h-[calc(100vh-500px)]">
        {/* Left Sidebar - Categories */}
        <aside className="hidden lg:block lg:w-64 xl:w-72 shrink-0 border-r border-gray-200/70 bg-white/80 backdrop-blur-sm">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scroll-smooth">
            <Sidebar />
          </div>
        </aside>

        {/* Center – Products */}
        <main className="flex-1 min-w-0 bg-gradient-to-b from-white to-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            {/* Hero text block */}
            <div className="text-center mb-12 lg:mb-16">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
                Source Premium Products Globally
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto font-light">
                Connect with verified manufacturers • Transparent pricing • Secure trade
              </p>
            </div>

            {/* Product Grid – enhanced cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl border border-gray-200/60 shadow-md hover:shadow-2xl hover:border-indigo-200/70 transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden"
                >
                  {/* Image + overlays */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={`https://source.unsplash.com/600x400/?product,industry&sig=${i}`}
                      alt="product"
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-emerald-600/90 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                        Verified Supplier
                      </span>
                    </div>

                    <span className="absolute bottom-4 right-4 bg-white/85 backdrop-blur-md text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                      MOQ 100 pcs
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2 min-h-[3rem]">
                      Premium {['Basmati Rice', 'Pharma APIs', 'Stainless Pipes', 'Organic Skincare', 'Spices Blend', 'LED Components'][i % 6]} Series {i + 1}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {['Global Agro Exports', 'MediPharm Ltd', 'SteelTech India', 'BeautyCos Pvt', 'SpiceWorld', 'ElectroComp'][i % 6]}
                    </p>

                    <div className="flex items-center gap-1.5 text-amber-500 text-sm font-medium">
                      ★★★★☆ <span className="text-gray-500 ml-1.5">(4.{(i + 2) % 10})</span>
                    </div>

                    <div className="flex items-end justify-between pt-3">
                      <div>
                        <p className="text-2xl font-bold text-emerald-700">
                          ₹{(1800 + i * 320).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">per unit • ex-factory</p>
                      </div>

                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-md">
                        Send Inquiry
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-16 text-center">
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-5 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                Load More Products
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar – Actions */}
        <aside className="hidden xl:block xl:w-80 shrink-0 border-l border-gray-200/70 bg-white/80 backdrop-blur-sm">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scroll-smooth">
            <ActionSidebar />
          </div>
        </aside>
      </div>
    </div>
    <PromoCard />
    <BuyerPromoCard />
    <Testimonials />
    </>
  );
};

export default Home;