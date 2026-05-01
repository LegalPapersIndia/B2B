// src/Pages/Home.jsx
import React, { useState } from 'react';

import HeroCarousel from '../Component/HeroCarousel';
import Sidebar from '../Component/Sidebar';
import ActionSidebar from '../Component/ActionSide';
import CategoryShowcase from '../Component/CategoryShowcase';
import ManufacturingHubsCarousel from '../Component/ManufacturingHubsCarousel';
import AllCompanies from '../Component/AllCompanies';
import PromoCard from '../Component/PromoCard';
import BuyerPromoCard from '../Component/BuyerPromoCard';
import Testimonials from '../Component/Testimonials';

export default function Home() {
  const [showBuyForm, setShowBuyForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Main Home Content */}
      {!showBuyForm && (
        <>
          {/* Hero + Sidebars Layout */}
          <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-8 pt-6">
            <div className="relative flex flex-col lg:flex-row gap-6 xl:gap-8">
              
              {/* Left Sidebar - Categories */}
              <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
                <div className="sticky top-6">
                  <Sidebar />
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                <HeroCarousel />
              </div>

              {/* Right Action Sidebar */}
              <aside className="hidden xl:block xl:w-80 shrink-0">
                <div className="sticky top-6">
                  <ActionSidebar 
                    onWantToBuyClick={() => setShowBuyForm(true)} 
                  />
                </div>
              </aside>

            </div>
          </div>

          {/* Below-the-fold Sections */}
          <div className="space-y-20 mt-12">
            <CategoryShowcase />
            <ManufacturingHubsCarousel />
            <AllCompanies />
            <PromoCard />
            <BuyerPromoCard />
            <Testimonials />
          </div>
        </>
      )}

      {/* Full Screen "I Want to Buy" Form */}
      {showBuyForm && (
        <ActionSidebar 
          isFullScreen={true} 
          onClose={() => setShowBuyForm(false)} 
        />
      )}

    </div>
  );
}