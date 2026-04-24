import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppAuth } from "../context/AuthContext";

const CompleteProfile = () => {
  const { user, isLoaded, isSignedIn, isProfileComplete, getToken } = useAppAuth();
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
      navigate("/", { replace: true });
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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await axios.post(`${API_BASE_URL}/api/auth/complete-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 800);
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
          Add your business details before you start sending enquiries or adding products
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Profile saved successfully! Redirecting...
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
              disabled={loading || success}
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
              disabled={loading || success}
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
              disabled={loading || success}
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-2xl text-lg transition-all"
          >
            {loading ? "Saving Profile..." : success ? "Profile Saved!" : "Save Profile & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
