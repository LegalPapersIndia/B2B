// src/Component/ActionSide.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, Shield, ShoppingCart, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "http://localhost:5000/api";

// Helper function to convert category name to display format
const toTitle = (value = "") =>
  value
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

// Normalize subcategories from API
const normalizeSubcategories = (subcategories) => {
  if (!Array.isArray(subcategories)) return [];
  return subcategories
    .map((item) => {
      if (typeof item === 'string') return { name: item, referenceImage: '' };
      return {
        name: String(item?.name || '').trim().toLowerCase(),
        referenceImage: String(item?.referenceImage || '').trim(),
      };
    })
    .filter((item) => item.name);
};

const ActionSidebar = ({ onWantToBuyClick, isFullScreen = false, onClose }) => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        if (data.success && data.categories) {
          setAllCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);
  
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    subcategory: "",
    quantity: "",
    description: "",
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
        alert(data.error || data.message || "Failed to submit requirement");
        setIsSubmitting(false);
        return;
      }

      alert("✅ Thank you! Your buy requirement has been submitted successfully.\nWe will connect you with relevant sellers soon.");

      setIsSubmitting(false);
      
      if (isFullScreen && onClose) {
        onClose();
      } else {
        // Reset form in sidebar mode
        setFormData({
          productName: "", category: "", subcategory: "", quantity: "",
          description: "", buyerName: "", buyerEmail: "", buyerPhone: ""
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      alert("Failed to submit requirement. Please try again.");
    }
  };

  // ===================== FULL SCREEN MODE =====================
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-[10000] overflow-y-auto">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Post Buy Requirement</h2>
              <p className="text-sm text-gray-500">Get best quotes from verified sellers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-7 h-7 text-gray-600" />
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
                placeholder="e.g. HDPE Granules, Nitrile Gloves, Cotton Fabric..."
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
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
                  disabled={categoriesLoading}
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-600 bg-white"
                >
                  <option value="">{categoriesLoading ? "Loading categories..." : "Select Category"}</option>
                  {allCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2">Subcategory</label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  placeholder="e.g. HDPE, Surgical Gloves, Cotton Yarn..."
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-600"
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
                className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-600"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800 mb-2">Detailed Requirement</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                placeholder="Specifications, quality standards, delivery timeline, target price, etc."
                className="w-full px-5 py-4 text-base border border-gray-300 rounded-3xl focus:outline-none focus:border-orange-600 resize-y"
              />
            </div>

            {/* Contact Details */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-5">Your Contact Details</h3>
              <div className="space-y-5">
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                  required
                  placeholder="Full Name *"
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-600"
                />
                <input
                  type="email"
                  name="buyerEmail"
                  value={formData.buyerEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="Email Address *"
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-600"
                />
                <input
                  type="tel"
                  name="buyerPhone"
                  value={formData.buyerPhone}
                  onChange={handleInputChange}
                  required
                  placeholder="Phone Number *"
                  className="w-full px-5 py-4 text-base border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 
                         text-white font-semibold py-6 rounded-3xl text-xl mt-8 
                         transition-all active:scale-[0.98] shadow-lg shadow-orange-500/30"
            >
              {isSubmitting ? "Submitting..." : "Submit Buy Requirement"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===================== NORMAL SIDEBAR MODE =====================
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-5 shadow-inner">
            <Shield className="w-9 h-9" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">B2B Marketplace</h3>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Connect directly with verified manufacturers and buyers across India
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5" />
            Login to Dashboard
          </Link>

          <Link
            to="/login"
            className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-5 h-5" />
            Create Free Account
          </Link>

          <button
            onClick={onWantToBuyClick}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md"
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