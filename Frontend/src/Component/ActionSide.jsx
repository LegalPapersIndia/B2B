// src/Component/ActionSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, Shield } from "lucide-react";

const ActionSidebar = () => {
  return (
    <div className="p-6 space-y-6">

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">

        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-5">
            <Shield className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            B2B Marketplace
          </h3>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Connect directly with verified manufacturers and buyers across India
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            to="/login"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5" />
            Login to Dashboard
          </Link>

          <Link
            to="/login"
            className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-5 h-5" />
            Create Free Account
          </Link>
        </div>

        {/* Trust Line */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
            🔒 Secure Platform • GST Verified Sellers
          </p>
        </div>
      </div>

    </div>
  );
};

export default ActionSidebar;