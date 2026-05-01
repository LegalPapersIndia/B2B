// src/Pages/CompleteProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppAuth } from "../context/AuthContext";

const CompleteProfile = () => {
  const { user, isLoaded, isSignedIn, isProfileComplete, getToken, refreshProfile } = useAppAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    mobile: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    if (isProfileComplete) {
      navigate("/seller-dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, user, isProfileComplete, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.businessName || !formData.mobile || !formData.address) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
        ? `${import.meta.env.VITE_API_BASE_URL}/api` 
        : "http://localhost:5000/api";

      const res = await axios.post(`${API_BASE_URL}/auth/complete-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        await refreshProfile(token);
        setSuccess(true);
        setTimeout(() => {
          navigate("/seller-dashboard", { replace: true });
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 md:p-10">
        
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-5">
            <span className="text-3xl">📋</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="text-gray-600 mt-3 text-[15px]">
            Please add your business details to continue using seller features
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl mb-6 flex items-center text-sm">
            <span className="mr-2">✅</span>
            Profile saved successfully! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="businessName"
              placeholder="Your Company / Business Name"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-300 transition-all"
              required
              disabled={loading || success}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="+91 98765 43210"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-300 transition-all"
              required
              disabled={loading || success}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Business Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              placeholder="House No, Street, Area, City, State, PIN Code"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-5 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-300 resize-y transition-all"
              required
              disabled={loading || success}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 
                       text-white font-semibold rounded-2xl text-lg transition-all duration-200 
                       active:scale-[0.98] shadow-lg shadow-orange-500/30"
          >
            {loading ? "Saving Profile..." : success ? "Profile Saved!" : "Save Profile & Continue"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          This information helps us verify your business and improve your experience
        </p>
      </div>
    </div>
  );
};

export default CompleteProfile;