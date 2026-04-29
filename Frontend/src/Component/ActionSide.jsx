// src/Component/ActionSide.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, Shield, ShoppingCart, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

const ActionSidebar = ({ onWantToBuyClick, isFullScreen = false, onClose }) => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    subcategory: "",
    quantity: "",
    description: "",
    gstNumber: "",
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
    const res = await fetch(`${API_BASE_URL}/enquiries/other`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (!res.ok) {
      setIsSubmitting(false);
      alert(data.error || data.message || "Failed to submit requirement");
      return;
    }

    alert("✅ Thank you! Your buy requirement has been submitted successfully.\nWe will connect you with relevant sellers soon.");

    setIsSubmitting(false);
    
    if (isFullScreen && onClose) {
      onClose();
    } else {
      // Reset form if opened from normal sidebar (optional)
      setFormData({
        productName: "", category: "", subcategory: "", quantity: "",
        description: "", gstNumber: "", buyerName: "", buyerEmail: "", buyerPhone: ""
      });
    }
    } catch (err) {
      setIsSubmitting(false);
      alert(err.message || "Failed to submit requirement. Please try again.");
    }
  };

  // ==================== FULL SCREEN MODE ====================
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-[10000] overflow-y-auto">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-amber-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Post Buy Requirement</h2>
              <p className="text-sm text-gray-500">Get best quotes from verified sellers across India</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-7 h-7 text-gray-700" />
          </button>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-8">

            <div>
              <label className="block text-lg font-medium text-gray-800 mb-2">
                What do you want to buy? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                placeholder="e.g. HDPE Granules, Nitrile Examination Gloves..."
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-amber-600 bg-white"
                >
                  <option value="">Select Category</option>
                  <option value="plastics">Plastics & Polymers</option>
                  <option value="pharma">Pharmaceuticals</option>
                  <option value="cosmetics">Cosmetics & Personal Care</option>
                  <option value="packaging">Packaging Materials</option>
                  <option value="textiles">Textiles & Apparel</option>
                  <option value="electronics">Electronics</option>
                  <option value="construction">Construction Materials</option>
                  <option value="food">Food & Beverages</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2">Subcategory</label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  placeholder="e.g. HDPE, LDPE, PP, Surgical"
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800 mb-2">Required Quantity</label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g. 5 Tons, 10,000 Pieces, 2 Containers"
                className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800 mb-2">Detailed Requirement</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                placeholder="Write specifications, quality required, delivery timeline, target price, etc."
                className="w-full px-5 py-4 text-base border border-gray-300 rounded-3xl focus:outline-none focus:border-amber-600 resize-y"
              />
            </div>

            {/* Contact Details */}
            <div className="pt-6 border-t">
              <h3 className="text-xl font-semibold text-gray-900 mb-5">Your Contact Details</h3>
              <div className="space-y-5">
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  required
                  placeholder="Full Name *"
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-amber-600"
                />
                <input
                  type="email"
                  name="buyerEmail"
                  value={formData.buyerEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="Email Address *"
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-amber-600"
                />
                <input
                  type="tel"
                  name="buyerPhone"
                  value={formData.buyerPhone}
                  onChange={handleInputChange}
                  required
                  placeholder="Phone Number *"
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-6 rounded-3xl text-xl mt-8 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? "Submitting..." : "Submit Buy Requirement"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==================== NORMAL SIDEBAR MODE ====================
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-5">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">B2B Marketplace</h3>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Connect directly with verified manufacturers and buyers across India
          </p>
        </div>

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

          <button
            onClick={onWantToBuyClick}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <ShoppingCart className="w-5 h-5" />
            I Want to Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionSidebar;
