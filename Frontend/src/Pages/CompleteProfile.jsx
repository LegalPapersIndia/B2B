// src/pages/CompleteProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";

const CompleteProfile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    mobile: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if profile is already complete
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const metadata = user.unsafeMetadata || {};

    if (metadata.profileCompleted || 
        (metadata.businessName && metadata.mobile && metadata.address)) {
      navigate("/"); // already complete → home
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.businessName || !formData.mobile || !formData.address) {
      setError("Sab fields bharna zaroori hai");
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await axios.post(`${API_BASE_URL}/api/auth/complete-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        alert("Profile successfully saved! Welcome to B2B");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Complete Your Business Profile</h2>
        <p className="text-center text-gray-600 mb-8">
          B2B platform use karne ke liye business details zaroori hain
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="businessName"
              placeholder="Your Company / Business Name"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="mobile"
              placeholder="+91 9876543210"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Address <span className="text-red-500">*</span></label>
            <textarea
              name="address"
              placeholder="House no, Street, Area, City, State, PIN Code"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500 resize-y"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-2xl text-lg transition-all"
          >
            {loading ? "Saving Profile..." : "Save Profile & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;