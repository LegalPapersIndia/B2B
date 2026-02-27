// src/Component/ActionSidebar.jsx
import React from 'react';

const ActionSidebar = () => {
  return (
    <aside className="w-72 bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto hidden xl:block">
      <div className="p-6 flex flex-col gap-8">
        {/* Want to Buy Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-blue-100">
          <div className="text-center mb-5">
            <h3 className="text-2xl font-bold text-indigo-800 mb-2">Want to Buy</h3>
            <p className="text-gray-600 text-sm">
              Find trusted suppliers and quality products for your business
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm">
              Sign Up as Buyer
            </button>
            <button className="bg-white border-2 border-indigo-600 text-indigo-700 font-medium py-3 px-6 rounded-xl hover:bg-indigo-50 transition-all">
              Login as Buyer
            </button>
          </div>
        </div>

        {/* Want to Sell Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-emerald-100">
          <div className="text-center mb-5">
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">Want to Sell</h3>
            <p className="text-gray-600 text-sm">
              Reach thousands of buyers and grow your business today
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm">
              Sign Up as Seller
            </button>
            <button className="bg-white border-2 border-emerald-600 text-emerald-700 font-medium py-3 px-6 rounded-xl hover:bg-emerald-50 transition-all">
              Login as Seller
            </button>
          </div>
        </div>

        {/* Optional small footer / note */}
        <div className="text-center text-xs text-gray-500 mt-4">
          Join our growing B2B community today
        </div>
      </div>
    </aside>
  );
};

export default ActionSidebar;