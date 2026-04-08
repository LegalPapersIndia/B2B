// src/pages/LoginPage.jsx
import React from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const { isLoaded, signIn } = useSignIn();
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/complete-profile",   // Yeh page decide karega
      });
    } catch (err) {
      console.error(err);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-8">Welcome Back</h2>
        
        <p className="text-gray-600 mb-10">Sign in with Google to continue</p>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-5 rounded-2xl font-medium hover:bg-gray-50 transition-all text-lg"
        >
          <FaGoogle className="text-red-500 text-2xl" /> 
          Login with Google
        </button>

        <p className="text-center text-sm mt-10 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
            Create new account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;