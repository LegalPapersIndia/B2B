// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    mobile: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const { isLoaded, signUp } = useSignUp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Google Signup with pre-filled data
  const signUpWithGoogle = async () => {
    if (!formData.businessName || !formData.mobile || !formData.address) {
      alert("Please fill all fields: Business Name, Mobile & Address");
      return;
    }

    setLoading(true);

    // Temporary data save in localStorage (Google redirect ke baad use karenge)
    localStorage.setItem("tempSignupData", JSON.stringify(formData));

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/complete-profile",
      });
    } catch (err) {
      console.error(err);
      alert("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Join B2B</h2>
        <p className="text-center text-gray-600 mb-8">
          Tell us about your business first
        </p>

        <div className="space-y-6">
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
              placeholder="+91 98765 43210"
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
              placeholder="House no, Street, City, State, PIN"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            onClick={signUpWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-semibold text-lg transition-all"
          >
            <FaGoogle className="text-xl" />
            {loading ? "Connecting to Google..." : "Sign Up with Google"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;