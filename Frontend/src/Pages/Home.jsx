import React from 'react';

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
  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="mx-auto max-w-[1400px] xl:max-w-[1520px] px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col lg:flex-row gap-0 lg:gap-6 xl:gap-8">
          <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
            <Sidebar />
          </aside>

          <div className="flex-1 min-w-0 lg:mt-10 z-10">
            <HeroCarousel />
          </div>

          <aside className="hidden xl:block xl:w-80 shrink-0">
            <div className="sticky top-28 h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-2xl shadow-2xl bg-white/95 backdrop-blur-lg border border-gray-200/60">
              <ActionSidebar />
            </div>
          </aside>
        </div>
      </div>

      <CategoryShowcase />
      <ManufacturingHubsCarousel />
      <AllCompanies />
      <PromoCard />
      <BuyerPromoCard />
      <Testimonials />
    </div>
  );
}
