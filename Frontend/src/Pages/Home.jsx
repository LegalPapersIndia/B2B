// src/Pages/Home.jsx
import React, { useState } from 'react';

import HeroCarousel from '../Component/HeroCarousel';
import Sidebar from '../Component/SideBar';
import ActionSidebar from '../Component/ActionSide';
import PromoCard from '../Component/PromoCard';
import BuyerPromoCard from '../Component/BuyerPromoCard';
import Testimonials from '../Component/Testimonials';
import CategoryShowcase from '../Component/CategoryShowcase';
import ManufacturingHubsCarousel from '../Component/ManufacturingHubsCarousel';
import AllCompanies from '../Component/AllCompanies';

export default function Home() {
  const [showBuyForm, setShowBuyForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/60">
      
      {/* Normal Home Page Content */}
      {!showBuyForm && (
        <>
          <div className="mx-auto max-w-[1400px] xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
            <div className="relative flex flex-col lg:flex-row gap-0 lg:gap-6 xl:gap-8">
              
              {/* Left Sidebar */}
              <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
                <Sidebar />
              </aside>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0 lg:mt-10 z-10">
                <HeroCarousel />
              </div>

              {/* Right Action Sidebar */}
              <aside className="hidden xl:block xl:w-80 shrink-0">
                <div className="sticky top-28">
                  <ActionSidebar 
                    onWantToBuyClick={() => setShowBuyForm(true)} 
                  />
                </div>
              </aside>

            </div>
          </div>

          {/* Other Sections */}
          <CategoryShowcase />
          <ManufacturingHubsCarousel />
          <AllCompanies />
          <PromoCard />
          <BuyerPromoCard />
          <Testimonials />
        </>
      )}

      {/* Full Screen Buy Requirement Form */}
      {showBuyForm && (
        <ActionSidebar 
          isFullScreen={true} 
          onClose={() => setShowBuyForm(false)} 
        />
      )}

    </div>
  );
}