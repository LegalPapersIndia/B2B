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
      setError(err.response?.data?.message || "Unable to sign in. Please check your credentials.");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-10">
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-gray-600 text-center mb-8">
          Sign in with your company email and password, or continue with Google
        </p>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="company@example.com"
              className="w-full rounded-2xl border px-4 py-3 focus:outline-none focus:border-emerald-500"
              required
              disabled={loading || googleLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-2xl border px-4 py-3 focus:outline-none focus:border-emerald-500"
              required
              disabled={loading || googleLoading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-2xl bg-emerald-600 py-4 text-white font-semibold hover:bg-emerald-700 disabled:bg-gray-400 transition-all"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-wider text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          onClick={loginWithGoogle}
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-4 rounded-2xl font-medium hover:bg-gray-50 transition-all text-lg disabled:opacity-60"
        >
          <FaGoogle className="text-red-500 text-2xl" />
          {googleLoading ? "Connecting to Google..." : "Sign In with Google"}
        </button>

        <p className="text-center text-sm mt-8 text-gray-600">
          Need a new company account?{" "}
          <Link to="/contact" className="text-indigo-600 font-semibold hover:underline">
            Want to list your company
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
