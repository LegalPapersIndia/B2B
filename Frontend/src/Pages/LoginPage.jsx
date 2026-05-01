// src/Pages/LoginPage.jsx
import React, { useEffect, useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { useAppAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { isLoaded: clerkLoaded, signIn } = useSignIn();
  const { loginWithPassword, isSignedIn, isLoaded, isProfileComplete } = useAppAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    navigate(isProfileComplete ? "/seller-dashboard" : "/complete-profile", { replace: true });
  }, [isLoaded, isSignedIn, isProfileComplete, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginWithPassword(formData);
      const nextProfileState = res?.user?.isProfileComplete;
      navigate(nextProfileState ? "/seller-dashboard" : "/complete-profile", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!clerkLoaded) return;
    setError("");
    setGoogleLoading(true);

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/complete-profile",
      });
    } catch (err) {
      console.error(err);
      setError("Google sign in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10">
        
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-5">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Sign in to access your seller dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="company@example.com"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-300 transition-all"
              required
              disabled={loading || googleLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-300 transition-all"
              required
              disabled={loading || googleLoading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-2xl text-lg transition-all active:scale-[0.98]"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-widest text-gray-400">or continue with</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          onClick={loginWithGoogle}
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-4 rounded-2xl font-medium hover:bg-gray-50 transition-all text-base disabled:opacity-60"
        >
          <FaGoogle className="text-red-500 text-2xl" />
          {googleLoading ? "Connecting to Google..." : "Sign in with Google"}
        </button>

        <p className="text-center text-sm mt-10 text-gray-600">
          Don't have an account?{" "}
          <Link to="/contact" className="text-orange-600 font-semibold hover:underline">
            List your company as a seller
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;